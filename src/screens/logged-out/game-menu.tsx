import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import AppPageContainer from '../../components/general/containers/page-container';
import { getGrids } from '../../helpers/grid-management';
import { globalStyles } from '../../assets/styles/global';
import AppBaseText from '../../components/general/texts/base-text';
import { Routes } from '../../utils/routing';
import { Link } from '@react-navigation/native';

const GameMenuScreen = () => {
    const grids = getGrids();

    return (
        <AppPageContainer>
            <ScrollView style={{ width: '80%' }}>
                <GameMenuItem text="Ajouter un carton" />
                <GameMenuItem text="Retirer un carton" />
                <GameMenuItem text="Continuer la partie" />
                <GameMenuItem linkTo={Routes.GAME.path} text="Nouvelle partie" />
                <GameMenuItem hideBorder text="Creer un compte" />
            </ScrollView>
        </AppPageContainer>
    );
};
export default GameMenuScreen;

const GameMenuItem = ({ text, hideBorder, linkTo }: { text: string; linkTo?: string; hideBorder?: boolean }) => (
    <Link
        to={linkTo ?? ''}
        style={{
            borderBottomWidth: hideBorder ? 0 : 2,
            borderBottomColor: '#fff',
            paddingVertical: 20,
            display: 'flex',
        }}
    >
        <AppBaseText text={text} align="center" size="lg"></AppBaseText>
    </Link>
);
