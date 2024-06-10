import React, { useState } from 'react';
import { View, TextInput, TextInputChangeEventData, NativeSyntheticEvent } from 'react-native';
import { colors, globalStyles } from '../../assets/styles/global';
import AppPageContainer from '../../components/general/containers/page-container';
import AppBaseButton from '../../components/general/buttons/base-button';
import { saveGrid } from '../../helpers/grid-management';
import { Routes } from '../../utils/routing';
import AppLotoGrid from '../../components/general/containers/loto-grid-container';

const ResultsScreen = ({ navigation }) => {
    const grid = JSON.parse(localStorage.getItem('grid') ?? '[]') as LotoGrid;

    const onValidate = () => {
        const gridId = new Date().toISOString();
        // saveGrid(gridId, grid);
        navigation.navigate(Routes.GAME_MENU.name);
    };

    const onInputChange = (
        event: NativeSyntheticEvent<TextInputChangeEventData>,
        lineIndex: number,
        colIndex: number
    ) => {
        grid[lineIndex][colIndex] = parseInt(event.nativeEvent.text);
    };

    return (
        <AppPageContainer>
            {grid && <AppLotoGrid isEditable={true} lotoGrid={grid} onChange={onInputChange} highlightedValues={[]} />}
            <AppBaseButton text="Valider" onPress={onValidate}></AppBaseButton>
        </AppPageContainer>
    );
};
export default ResultsScreen;
