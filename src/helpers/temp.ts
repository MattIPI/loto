// Output from https://www.onlineocr.net/
// 12 25 47 5168 103995- 7 29 32 72 89 11 34 57 65 87

// Spécificités:
// - Il y a un 1 au début qui ne devrait pas être pris en compte
// - Le 12 25 étaient collés et n'auraient pas été détectés
// - Le 1039957 devrait être filtré
// - Le 47 51 68 est mal filtré à cause des espaces
const content1 = `
****** Result for Image/Page 1 ******
1039957
12 25
29 32
34
47 51 68
7
72 89
57 65
87`;

const content1bis = `
12 25
29 32
34
47 51 68
7
72 89
57 65
87`;

// Spécificités:
// - Le numéro de téléphone doit être complètement filtré et considéré comme une seule suite
// - Le 100 001 doit être filtré
const content2 = `
****** Result for Image/Page 1 ******
100 001
1 13
35
1
13
35
102732
10
27
32
9
22
22
5164
51
64
5660
56
49
49
www.cartaloto.net - 05.63.38.34.64
7985
79
85`;

const content2bis = `
1 13
35
1
13
35
10
27
32
9
22
22
5164
51
64
5660
56
49
49
7985
79
85`;

const content3 = `
"Carton personnalisable vert"
1
1
2
2
10
24 36
24
36
00001
41
60
81
52
47 59
65 77
47
59
65
77
84
19
www.lepalaisduloto.fr - Série 1/1000/40`;

const content3sanitized = `
1
1
2
2
10
24 36
24
36
41
60
81
52
47 59
65 77
47
59
65
77
84
19`;

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

type LotoCol = { values: [LotoCell, LotoCell, LotoCell]; start: number; end: number };

const createEmptyGrid = (): LotoGrid => {
    const emptyLine = [null, null, null, null, null, null, null, null, null] as LotoLine;
    return [[...emptyLine], [...emptyLine], [...emptyLine]];
};

const isValueAFlushOfNumbers = (value: string): boolean => {
    return value.length > 3;
};

const getNumbersInFlush = (value: string): string[] => {
    const numbers = value.split(' ');
    return numbers;
};

const isColEmpty = (col: number, grid: LotoGrid): boolean => {
    return !grid[0][col] && !grid[1][col] && !grid[2][col];
};

// -1 signifie qu'il faut remonter les lignes
const detectLine = (
    value: string,
    grid: LotoGrid,
    currentLineNumber: LineNumber,
    prev: number,
    max: number
): LineNumber => {
    const col = detectCol(value);
    const parsedValue = parseInt(value);

    // Si la valeur précédente était plus élevée, il y a beaucoup de chances qu'on passe sur une nouvelle ligne
    if (prev > parsedValue) {
        if (currentLineNumber >= 2) {
            throw new Error('cannot go to further line');
        } else {
            return (currentLineNumber + 1) as LineNumber;
        }
    }

    // Si on a jamais été sur une aussi grosse valeur, il y a beaucoup de chances qu'on soit remonté sur la première ligne
    if (parsedValue > max) {
        // Si la colonne n'a pas déja de nombre et que toutes les suivantes sont vides, on peut partir du postulat qu'on est sur la première ligne
        let canGoToFirstLine = true;
        let currentCol = col;
        do {
            if (!isColEmpty(currentCol, grid)) {
                canGoToFirstLine = false;
            }
            currentCol++;
        } while (canGoToFirstLine && currentCol < 9);
        if (canGoToFirstLine) {
            return 0;
        }
        // Si on ne peut pas aller à la première ligne on reste sur l'actuelle
    }

    // Si la colonne de la ligne actuelle est déja remplie, on tente d'aller à la suivante
    if (grid[currentLineNumber][col]) {
        if (currentLineNumber === 0 && !grid[1][col] && !grid[2][col]) {
            return 1;
        }

        if (currentLineNumber === 1 && !grid[2][col]) {
            return 2;
        }

        throw new Error('cannot go to further line');
    }

    return currentLineNumber;
};

const detectCol = (value: string): number => {
    const parsedValue = parseInt(value);
    // Si le nombre est < 10 ou > 89, on prend le premier chiffre de sa dizaine pour le placer
    // Si < 10, c'est la première ligne
    // Sinon c'est la dernière
    if (parsedValue > 10 && parsedValue < 89) {
        return parseInt(value[0]);
    } else if (parsedValue < 10) {
        return 0;
    } else {
        return 8;
    }
};

const valueFitsInCurrentLine = (value: string, line: LotoLine): boolean => {
    return Boolean(line[detectCol(value)]);
};

const setNumberInLine = (value: string, line: LotoLine, max: number): { max: number; prev: number; line: LotoLine } => {
    const parsedValue = parseInt(value);
    // Si le nombre est < 10 ou > 89, on prend le premier chiffre de sa dizaine pour le placer
    // Si < 10, c'est la première ligne
    // Sinon c'est la dernière
    if (parsedValue >= 10 && parsedValue < 89) {
        const col = parseInt(value[0]);
        line[col] = parsedValue;
    } else if (parsedValue < 10) {
        line[0] = parsedValue;
    } else {
        line[8] = parsedValue;
    }

    max = max < parsedValue ? parsedValue : max;

    return {
        line,
        max,
        prev: parsedValue,
    };
};

const isPresentInGrid = (value: string, grid: LotoGrid): boolean => {
    return grid.some((line: LotoLine) => line.some((cell: LotoCell) => cell === parseInt(value)));
};

const digits = content3sanitized.replace(/\D+/g, ' ');
const digitsArray = digits.split(' ');

const onlyNumbersUnsanitized = content3sanitized.split(/\r?\n/).filter((val) => !!val);
console.log(onlyNumbersUnsanitized);
const sanitizedNumbers = onlyNumbersUnsanitized
    //.filter(value => Number(value) > 0 && Number(value) < 91)
    .reduce(
        (acc: ProcessingGrid, value: string) => {
            // Si le nombre existe déja, on le skip
            if (isPresentInGrid(value, acc.grid)) {
                return acc;
            }

            let meta, lineToWrite: LineNumber;

            // Si la valeur est plus longue que 2 chiffres, alors on a affaire à une suite
            // De là on peut facilement placer les chiffres à la suite dans la ligne
            if (isValueAFlushOfNumbers(value)) {
                console.log('flush values: ', value);
                const numbers = getNumbersInFlush(value);
                console.log('numbers in flush: ', numbers);
                console.log('currentLine: ', acc.currentLine);
                lineToWrite = detectLine(numbers[0], acc.grid, acc.currentLine, acc.prev, acc.max);
                numbers.forEach((integer) => {
                    meta = setNumberInLine(integer, acc.grid[lineToWrite], acc.max);
                });
            } else {
                lineToWrite = detectLine(value, acc.grid, acc.currentLine, acc.prev, acc.max);
                meta = setNumberInLine(value, acc.grid[lineToWrite], acc.max);
            }

            const newGrid = [...acc.grid];
            newGrid[lineToWrite] = meta.line;

            return {
                currentLine: lineToWrite,
                prev: parseInt(value),
                max: meta?.max ?? acc.max,
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

console.log(sanitizedNumbers);
