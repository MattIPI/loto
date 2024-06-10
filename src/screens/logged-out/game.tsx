import React, { useCallback, useState, useRef, useEffect } from 'react';
import { FlatList, ScrollView, Text, View } from 'react-native';
import AppPageContainer from '../../components/general/containers/page-container';
import { getGrids } from '../../helpers/grid-management';
import { EColors, globalStyles } from '../../assets/styles/global';
import AppBaseText from '../../components/general/texts/base-text';
import { Routes } from '../../utils/routing';
import AppBaseButton from '../../components/general/buttons/base-button';
import AppModal from '../../components/general/containers/modal-container';
import AppNumberInput from '../../components/general/inputs/number-input';
import AppCustomButton from '../../components/general/buttons/advanced-button';
import { Entypo } from '@expo/vector-icons';
import AppLotoGrid, { LotoGame } from '../../components/general/containers/loto-grid-container';

const GameScreen = () => {
    const [numberFlush, setNumberFlush] = useState<number[]>([12, 14, 34, 1, 3, 99, 87, 67, 51, 99, 87, 67, 55]);
    const [modalVisible, setModalVisible] = useState(false);
    const grids = getGrids();
    let flatListRef = useRef<FlatList>(null);

    const onValidate = useCallback((number?: number) => {
        // TODO perfrom validation
        if (!number) {
            return;
        }
        numberFlush.push(number);
        setNumberFlush([...numberFlush]);
        setModalVisible(false);
    }, []);
    const onCancel = useCallback(() => {
        setModalVisible(false);
    }, []);

    return (
        <View
            style={[
                globalStyles.pageContainer,
                {
                    justifyContent: 'flex-end',
                    flexDirection: 'column',
                    paddingBottom: 20,
                },
            ]}
        >
            {/* <View style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 1000 }}>
                <AppBaseText text="Bravo !" size="xl" color="secondary" />
                <AppBaseText text="Vous avez deux cartons gagnants !" size="xl" color="secondary" />
            </View> */}
            <AppModal
                isOpen={modalVisible}
                onClose={onCancel}
                content={<NumberModalContent onCancel={onCancel} onValidate={onValidate} />}
            />

            <ScrollView
                style={{
                    paddingHorizontal: 20,
                    paddingVertical: 20,
                    height: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 20,
                    width: '100%',
                    marginBottom: 20,
                }}
            >
                {grids.map((grid, index) => (
                    <View key={index} style={{ marginBottom: 20 }}>
                        <AppLotoGrid
                            highlightedValues={numberFlush}
                            isEditable={false}
                            lotoGrid={grid}
                            onChange={() => {}}
                            onGameWon={() => {
                                console.log('won');
                            }}
                            stake={LotoGame.DOUBLE_QUINE}
                        />
                    </View>
                ))}
            </ScrollView>

            <View style={{ width: '100%', marginBottom: 20 }}>
                <FlatList
                    ref={flatListRef}
                    onContentSizeChange={() => flatListRef.current?.scrollToOffset({ offset: 30 * numberFlush.length })}
                    style={{ paddingRight: '50%', paddingLeft: 20 }}
                    data={numberFlush}
                    horizontal={true}
                    bounces={true}
                    ItemSeparatorComponent={() => <AppBaseText text="" inputStyle={{ width: 20 }} size="lg" />}
                    renderItem={(value) => (
                        <AppBaseText
                            text={value.item.toString()}
                            size={value.index == numberFlush.length - 1 ? 'xl' : 'lg'}
                        />
                    )}
                ></FlatList>
            </View>
            <AppBaseButton text="Nouveau tirage" onPress={() => setModalVisible(true)} />
        </View>
    );
};
export default GameScreen;

const NumberModalContent = ({
    onValidate,
    onCancel,
}: {
    onValidate: (value?: number) => void;
    onCancel: () => void;
}) => {
    const [number, setNumber] = useState<number | undefined>(undefined);

    const onNumberChanged = (text: string) => {
        setNumber(parseInt(text));
    };

    return (
        <View style={{ maxWidth: '100%' }}>
            <View style={{ display: 'flex', gap: 24 }}>
                <AppBaseText size="lg" text="Tirage" />
                <AppNumberInput style={{ fontSize: 46, textAlign: 'center' }} onChange={onNumberChanged} />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <AppCustomButton
                        customStyles={{ paddingHorizontal: 8 }}
                        color={EColors.red}
                        content={<Entypo name="cross" size={24} color="white" />}
                        onPress={onCancel}
                    />
                    <AppCustomButton
                        customStyles={{ paddingHorizontal: 8 }}
                        color={EColors.secondary}
                        content={<Entypo name="check" size={24} color="white" />}
                        onPress={() => onValidate(number)}
                    />
                </View>
            </View>
        </View>
    );
};
