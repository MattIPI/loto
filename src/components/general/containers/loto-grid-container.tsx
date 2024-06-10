import React, { useCallback, useEffect } from 'react';
import { View, TextInput, NativeSyntheticEvent, TextInputChangeEventData } from 'react-native';
import { globalStyles, colors } from '../../../assets/styles/global';
import AppBaseText from '../texts/base-text';
import SvgStar from '../../../assets/svg/star';

const GridInputCell = ({
    value,
    colIndex,
    lineIndex,
    onChange,
}: {
    value: LotoCell;
    colIndex: number;
    lineIndex: number;
    onChange: (e: NativeSyntheticEvent<TextInputChangeEventData>, lineIndex: number, colIndex: number) => void;
}) => (
    <TextInput
        defaultValue={value?.toString() ?? ''}
        maxLength={2}
        inputMode="numeric"
        keyboardType="number-pad"
        style={[
            globalStyles.number,
            lineIndex === 0 ? { borderTopWidth: 4 } : {},
            lineIndex === 2 ? { borderBottomWidth: 4 } : {},
            colIndex === 0 ? { borderLeftWidth: 4 } : {},
            colIndex === 8 ? { borderRightWidth: 4 } : {},
            {
                borderWidth: 2,
                borderColor: colors.flash,
                width: 80,
                height: 60,
                textAlign: 'center',
                color: colors.primary,
            },
        ]}
        onChange={(e) => onChange(e, lineIndex, colIndex)}
    />
);

export enum LotoGame {
    QUINE,
    DOUBLE_QUINE,
    CARTON,
}

const AppLotoGrid = ({
    lotoGrid,
    isEditable,
    highlightedValues,
    onChange,
    onGameWon,
    stake,
}: {
    onChange: (e: NativeSyntheticEvent<TextInputChangeEventData>, lineIndex: number, colIndex: number) => void;
    onGameWon: () => void;
    lotoGrid: LotoGrid;
    isEditable: boolean;
    highlightedValues: number[];
    stake?: LotoGame;
}) => {
    const isHighlighted = (value: number) => highlightedValues.includes(value);

    const hasWonQuine = (grid: LotoGrid, toss: number[]) => {
        console.log('calculating quine');
        grid.forEach((row) => {
            if (row.every((cell) => toss.includes(Number(cell)))) {
                onGameWon();
            }
        });
    };

    const hasWonDoubleQuine = (grid: LotoGrid, toss: number[]) => {
        let quineFound = 0;
        grid.forEach((row) => {
            if (
                row
                    .filter((cell) => !!cell)
                    .every((cell) => {
                        return toss.includes(cell as number);
                    })
            ) {
                quineFound++;
            }
        });

        if (quineFound >= 2) {
            onGameWon();
        }
    };

    const hasWonCarton = (grid: LotoGrid, toss: number[]) => {
        if (grid.every((row) => row.every((cell) => toss.includes(Number(cell))))) {
            onGameWon();
        }
    };

    useEffect(() => {
        if (stake === LotoGame.QUINE) {
            hasWonQuine(lotoGrid, highlightedValues);
        }
        if (stake === LotoGame.DOUBLE_QUINE) {
            hasWonDoubleQuine(lotoGrid, highlightedValues);
        }
        if (stake === LotoGame.CARTON) {
            hasWonCarton(lotoGrid, highlightedValues);
        }
    }, [highlightedValues, lotoGrid, stake]);

    return (
        <View style={{ borderRadius: 6 }}>
            {lotoGrid.map((row, lineIndex) => (
                <View
                    key={lineIndex}
                    style={{ flexDirection: 'row', justifyContent: 'center', zIndex: 1, position: 'relative' }}
                >
                    {row.map((number, colIndex) => (
                        <>
                            {isEditable && (
                                <GridInputCell
                                    colIndex={colIndex}
                                    lineIndex={lineIndex}
                                    key={colIndex}
                                    onChange={onChange}
                                    value={number}
                                />
                            )}
                            {!isEditable && (!number || !isHighlighted(number)) && (
                                <View
                                    key={colIndex}
                                    style={{
                                        position: 'relative',
                                        zIndex: 1,
                                    }}
                                >
                                    <AppBaseText
                                        inputStyle={{
                                            position: 'relative',
                                            zIndex: 1,
                                            borderWidth: 2,
                                            borderColor: colors.flash,
                                            width: 40,
                                            height: 30,
                                            textAlign: 'center',
                                            color: colors.primary,
                                        }}
                                        text={number?.toString() ?? ''}
                                    />
                                </View>
                            )}
                            {!isEditable && number && isHighlighted(number) && (
                                <View
                                    key={colIndex}
                                    style={{
                                        borderWidth: 2,
                                        zIndex: 1000,
                                        position: 'relative',
                                        borderColor: colors.flash,
                                        width: 40,
                                        height: 30,
                                        overflow: 'visible',
                                    }}
                                >
                                    <View
                                        style={{
                                            overflow: 'visible',
                                            zIndex: 10,
                                        }}
                                    >
                                        <View style={{ position: 'absolute', top: -15, left: -3 }}>
                                            <SvgStar opacity={0.9} size={60} />
                                        </View>
                                    </View>
                                    <AppBaseText
                                        inputStyle={{
                                            position: 'relative',
                                            zIndex: 100,
                                            width: 40,
                                            height: 30,
                                            textAlign: 'center',
                                            color: colors.red,
                                        }}
                                        text={number?.toString() ?? ''}
                                    />
                                </View>
                            )}
                        </>
                    ))}
                </View>
            ))}
        </View>
    );
};
export default AppLotoGrid;
