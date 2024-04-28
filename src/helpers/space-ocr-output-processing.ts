//https://ocr.space/OCRAPI
// Les 25k premiers appels sont gratuits
// Soit il rentre ses grilles à la main
// On donne accès à 10 scans offerts par mois (2 loto)
// Au delà, on demande d'acheter des crédits (1 crédit = 1 scan validé)
// L'utilisateur peut voir ses crédits disponibles sur l'appli

export const processImageLocally = async (image: string) => {};

type OCRWord = {
    WordText: string;
    Left: number;
    Top: number;
    Height: number;
    Width: number;
};

type OCRLine = {
    LineText: string;
    Words: OCRWord[];
    MaxHeight: number;
    MinTop: number;
};

type LotoGrid = [LotoLine, LotoLine, LotoLine];

type LotoLine = [LotoCell, LotoCell, LotoCell, LotoCell, LotoCell, LotoCell, LotoCell, LotoCell, LotoCell];

type LotoCell = number | null;

type LineNumber = 0 | 1 | 2;

type ProcessingGrid = {
    currentLine: LineNumber;
    prevLine?: LineNumber;
    max: number;
    prev: number;
    grid: LotoGrid;
};

type CharSizePool = { sizes: number[]; max: number; min: number; average: number };

let smallChars: CharSizePool | undefined;
let bigChars: CharSizePool;
let row1FromTop: number;
let row2FromTop: number;
let row3FromTop: number;

const createEmptyGrid = (): LotoGrid => {
    const emptyLine = [null, null, null, null, null, null, null, null, null] as LotoLine;
    return [[...emptyLine], [...emptyLine], [...emptyLine]];
};

const initProcessingValues = (): void => {
    row1FromTop = 0;
    row2FromTop = 0;
    row3FromTop = 0;

    smallChars = undefined;
};

const isBigChar = (charSize: number) => charSize >= bigChars.min && charSize <= bigChars.max;
const isSmallChar = (charSize: number) => smallChars && charSize >= smallChars?.min && charSize <= smallChars?.max;

/**
 * Détermine les tranches de tailles qui correspondent aux petits et gros caractères
 * Avoir cette information va permettre de positionner avec certitude les caractères qui sont gros
 * Si un caractère n'est pas gros, on peut voir s'il correspond au standard des petits caractères pour le placer
 * @param ocrOutput
 * @returns
 */
const detectCharSizes = (ocrOutput: OCRLine[]): { bigCharSize: CharSizePool; smallCharSize?: CharSizePool } => {
    const detectedCharSizes = ocrOutput.reduce((acc: number[], line: OCRLine) => {
        return [...acc, line.MaxHeight];
    }, []);

    /**
     * Find the index of the pool that fits the size with a +-20% margin
     * @param size
     * @param pools
     * @returns index of the pool that fits the size
     * */
    const findFittingSizePoolIndex = (size: number, pools: CharSizePool[]): number => {
        return pools.findIndex((pool) => size >= pool.min * 0.8 && size <= pool.max * 1.2);
    };

    const updatePool = (pool: CharSizePool, size: number): CharSizePool => {
        return {
            sizes: [...pool.sizes, size],
            max: Math.max(pool.max, size),
            min: Math.min(pool.min, size),
            average: pool.sizes.reduce((acc, value) => acc + value, 0) / pool.sizes.length,
        };
    };

    const charSizePools: CharSizePool[] = [];

    detectedCharSizes.forEach((size) => {
        // Si c'est le premier caractère, on crée un pool
        if (!charSizePools.length) {
            charSizePools.push({ sizes: [size], max: size, min: size, average: size });
            return;
        }

        const fittingSizePoolIndex = findFittingSizePoolIndex(size, charSizePools);

        // Si on n'a pas trouvé de pool qui correspond, on en crée un nouveau
        if (fittingSizePoolIndex === -1) {
            charSizePools.push({ sizes: [size], max: size, min: size, average: size });
            return;
        }

        const pool = updatePool(charSizePools[fittingSizePoolIndex], size);
        charSizePools[fittingSizePoolIndex] = pool;
    });

    // On prend le pool avec la plus grande moyenne
    const bigCharPoolIndex = charSizePools.findIndex(
        (pool) => pool.average === Math.max(...charSizePools.map((pool) => pool.average))
    );
    if (bigCharPoolIndex === -1) {
        throw new Error('No char pool found');
    }

    // Pour les petits caractères, on prend le pool qui a le plus de valeurs
    const smallCharPool = charSizePools.find(
        (pool, index) =>
            index !== bigCharPoolIndex &&
            pool.sizes.length === Math.max(...charSizePools.map((pool) => pool.sizes.length))
    );

    return {
        bigCharSize: charSizePools[bigCharPoolIndex],
        smallCharSize: smallCharPool,
    };
};

/**
 *
 * Si on tombe sur une petite taille de caractère, on cherche le même en gros caractère
 * Si on le trouve, on le dismiss
 * Sinon on le conserve
 * @param ocrOutput
 * @returns
 */
const sanitizeDuplicatedNumbers = (ocrOutput: OCRLine[]): OCRLine[] => {
    return ocrOutput.reduce((acc: OCRLine[], line: OCRLine) => {
        // Si on tombe sur une grosse taille de caractère, on peut process tranquillement le nombre
        if (isBigChar(line.MaxHeight)) {
            return [...acc, line];
        }

        // Si on tombe sur une petite taille de caractère, on cherche le même en gros caractère
        const availableBigNumbers = line.Words.filter((word) =>
            ocrOutput.find((l) => l.Words.some((w) => w.WordText === word.WordText) && isBigChar(l.MaxHeight))
        );
        // Si toute la ligne est disponible en gros caractère, on prendra la ligne disponible en gros, et on skip celle ci
        // Dans le cas où on arrive pas à retrouver la ligne complète ET que la taille de caractère ne correspond pas aux standards, on la skip également
        if (availableBigNumbers.length === line.Words.length || (smallChars && !isSmallChar(line.MaxHeight))) {
            return acc;
        }

        // Si la ligne n'est pas en gros caractères, on retire les nombres qui sont tout de même en gros caractères
        return [
            ...acc,
            {
                ...line,
                Words: [
                    ...line.Words.filter((word) => !availableBigNumbers.map((n) => n.WordText).includes(word.WordText)),
                ],
            },
        ];
    }, []);
};

/**
 * Detects the span of rows in the grid, based on their distance from top, and the detected char sizes
 * @param ocrOutput
 */
const detectRowsPosition = (ocrOutput: OCRLine[]) => {
    const avgBigCharSize = bigChars.average;
    // First row starts at the top of the first big char
    const row1FromTopUnsorted = ocrOutput.filter((line) => isBigChar(line.Words[0].Height));
    row1FromTop = [...row1FromTopUnsorted].sort((a, b) => a.MinTop - b.MinTop)[0].MinTop;

    // Second row starts at the first big char not in the first row
    const row2FromTopUnsorted = ocrOutput
        .filter((line) => isBigChar(line.Words[0].Height))
        .filter((line) => line.MinTop > row1FromTop + avgBigCharSize);
    row2FromTop = [...row2FromTopUnsorted].sort((a, b) => a.MinTop - b.MinTop)[0].MinTop;

    // Third row starts at the first big char not in the other rows
    const row3FromTopUnsorted = ocrOutput
        .filter((line) => isBigChar(line.Words[0].Height))
        .filter((line) => line.MinTop > row2FromTop + avgBigCharSize);
    row3FromTop = [...row3FromTopUnsorted].sort((a, b) => a.MinTop - b.MinTop)[0].MinTop;
};

const cleanNonGridNumbers = (ocrOutput: OCRLine[]) => {
    // If the grid is only composed of big characters ( = no small characters),
    // We can safely remove all non big characters
    return !smallChars ? ocrOutput.filter((line) => isBigChar(line.MaxHeight)) : ocrOutput;
};

const isPresentInGrid = (value: string, grid: LotoGrid): boolean => {
    return grid.some((line: LotoLine) => line.some((cell: LotoCell) => cell === parseInt(value)));
};

const setNumberInLotoLine = (
    value: string,
    line: LotoLine,
    max: number
): { max: number; prev: number; line: LotoLine } => {
    const parsedValue = parseInt(value);
    // Si le nombre est < 10 ou > 89, on prend le premier chiffre de sa dizaine pour le placer
    if (parsedValue >= 10 && parsedValue < 89) {
        const col = parseInt(value[0]);
        line[col] = parsedValue;
    }
    // Si < 10, c'est la première ligne
    else if (parsedValue < 10) {
        line[0] = parsedValue;
    }
    // Sinon c'est la dernière (Uniquement pour le 90)
    else {
        line[8] = parsedValue;
    }

    // On met à jour le max
    max = max < parsedValue ? parsedValue : max;

    return {
        line,
        max,
        prev: parsedValue,
    };
};

const detectLotoLineNumber = (value: OCRWord): LineNumber => {
    if (value.Top < row2FromTop) return 0;
    if (value.Top >= row2FromTop && value.Top < row3FromTop) return 1;
    else return 2;
};

export const processSpaceOcrOutputGrid = (ocrOutput: OCRLine[]) => {
    initProcessingValues();
    // Avant de commencer à process le contenu, on exclue les lignes qui contiennent autre chose que des chiffres ou des espaces
    const linesWithNumbers = ocrOutput.filter((line) => line.LineText.match(/^[0-9\s]+$/));

    // On fait un comparatif entre les lignes pour identifier les hauteurs moyennes des petits et gros caractères
    const { bigCharSize, smallCharSize } = detectCharSizes(linesWithNumbers);
    bigChars = bigCharSize;
    if (smallCharSize) smallChars = smallCharSize;

    console.log('ocrOutput', JSON.stringify(ocrOutput));

    const sanitizedLines = sanitizeDuplicatedNumbers(linesWithNumbers);

    // Remove lines that should not be considered as grid numbers
    const gridNumbers = cleanNonGridNumbers(sanitizedLines);

    detectRowsPosition(gridNumbers);

    console.log('\r\n');
    console.log('gridNumbers', JSON.stringify(gridNumbers));

    const grid = gridNumbers.reduce(
        (acc: ProcessingGrid, value: OCRLine) => {
            const targetLine = detectLotoLineNumber(value.Words[0]);

            const numbersInOCRLine = value.Words.map((word) => word.WordText);

            // Init data for the current line
            let updatedLotoGridLine: { max: number; prev: number; line: LotoLine } = {
                max: acc.max,
                prev: acc.prev,
                line: acc.grid[targetLine],
            };

            numbersInOCRLine.forEach((number) => {
                //  Si il y a plus de 2 chiffres alors on a affaire à une suite qu'il va falloir séparer

                // Séparer les nombres de 2 chiffres
                if (number.length > 2 && number.length % 2 === 0) {
                    for (let i = 0; i < number.length; i += 2) {
                        const integer = number.slice(i, i + 2);
                        updatedLotoGridLine = setNumberInLotoLine(integer, acc.grid[targetLine], acc.max);
                    }
                }
                // Séparation des nombres si la première colonne (à 1 chiffre) est aussi inclue dans la suite
                else if (number.length > 2 && number.length % 2 !== 0) {
                    const firstInteger = number.slice(0, 1);
                    updatedLotoGridLine = setNumberInLotoLine(firstInteger, acc.grid[targetLine], acc.max);
                    for (let i = 1; i < number.length; i += 2) {
                        const integer = number.slice(i, i + 2);
                        updatedLotoGridLine = setNumberInLotoLine(integer, acc.grid[targetLine], acc.max);
                    }
                }
                // Processing d'un nombre seul
                else {
                    //  Si le nombre existe déja, on le skip
                    if (!isPresentInGrid(number, acc.grid)) {
                        updatedLotoGridLine = setNumberInLotoLine(number, acc.grid[targetLine], acc.max);
                    }
                }
            });

            const newGrid = [...acc.grid];
            newGrid[targetLine] = updatedLotoGridLine.line;

            return {
                currentLine: targetLine,
                prev: parseInt(updatedLotoGridLine.prev.toString()),
                max: updatedLotoGridLine?.max ?? acc.max,
                grid: newGrid,
            } as ProcessingGrid;
        },
        {
            currentLine: 0,
            prev: 0,
            max: 0,
            grid: createEmptyGrid(),
        } as ProcessingGrid
    );

    return grid.grid;
};
