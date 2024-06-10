import { Link } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack/lib/typescript/src/types';
import React from 'react';
import { Alert, Button } from 'react-native';
import { SignUpScreen } from './sign-up';
import { Routes } from '../utils/routing';
import { globalStyles } from '../assets/styles/global';
import AppBaseButton from '../components/general/buttons/base-button';
import AppPageContainer from '../components/general/containers/page-container';

type RootStackParamList = {
    Home: JSX.Element;
};

export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

type Props = {
    navigation: HomeScreenProps;
};

export const HomeScreen = ({ navigation }: Props) => {
    const createTwoButtonAlert = () =>
        Alert.alert('Alert Title', 'My Alert Msg', [
            {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            { text: 'OK', onPress: () => console.log('OK Pressed') },
        ]);

    return (
        <AppPageContainer>
            <Link style={globalStyles.text} to={Routes.LOGGED_OUT_RESULTS.path}>
                Creer un compte
            </Link>
            <Link style={globalStyles.text} to={Routes.LOGGED_OUT_SCAN_BOARD.path}>
                Commencer sans compte
            </Link>
            <AppBaseButton text="Click" onPress={() => console.log('clik')} />
            <AppBaseButton text="Go to Jane's profile" onPress={createTwoButtonAlert} />
        </AppPageContainer>
    );
};
