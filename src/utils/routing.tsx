import { NavigationContainer } from '@react-navigation/native';
import { HomeScreen } from '../screens/home';
import { SignUpScreen } from '../screens/sign-up';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import LoggedOutScanBoardScreen from '../screens/logged-out/scan-board';
import ResultsScreen from '../screens/logged-out/results';
import GameMenuScreen from '../screens/logged-out/game-menu';
import GameScreen from '../screens/logged-out/game';

const Stack = createNativeStackNavigator();

export interface IRoute {
    name: string;
    path: string;
    component: React.FC<any>;
}

export interface IRoutes {
    [key: string]: IRoute;
}

export const Routes: IRoutes = Object.freeze({
    HOME: {
        name: 'Home',
        path: '/Home',
        component: HomeScreen,
    },
    SIGN_UP: {
        name: 'SignUp',
        path: '/SignUp',
        component: SignUpScreen,
    },
    LOGGED_OUT_SCAN_BOARD: {
        name: 'LoggedOutScanBoard',
        path: '/LoggedOutScanBoard',
        component: LoggedOutScanBoardScreen,
    },
    LOGGED_OUT_RESULTS: {
        name: 'LoggedOutResults',
        path: '/LoggedOutResults',
        component: ResultsScreen,
    },
    GAME_MENU: {
        name: 'GameMenu',
        path: '/GameMenu',
        component: GameMenuScreen,
    },
    GAME: {
        name: 'Game',
        path: '/Game',
        component: GameScreen,
    },
});

export const Routing = () => (
    <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen name={Routes.HOME.name} component={Routes.HOME.component} />
            <Stack.Screen name={Routes.SIGN_UP.name} component={Routes.SIGN_UP.component} />
            <Stack.Screen name={Routes.LOGGED_OUT_SCAN_BOARD.name} component={Routes.LOGGED_OUT_SCAN_BOARD.component} />
            <Stack.Screen name={Routes.LOGGED_OUT_RESULTS.name} component={Routes.LOGGED_OUT_RESULTS.component} />
            <Stack.Screen name={Routes.GAME_MENU.name} component={Routes.GAME_MENU.component} />
            <Stack.Screen name={Routes.GAME.name} component={Routes.GAME.component} />
        </Stack.Navigator>
    </NavigationContainer>
);
