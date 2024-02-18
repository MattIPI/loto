import { NavigationContainer } from "@react-navigation/native";
import { HomeScreen } from "../screens/home";
import { SignUpScreen } from "../screens/sign-up";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import LoggedOutScanBoardScreen from "../screens/logged-out/scan-board";

const Stack = createNativeStackNavigator();

export interface IRoute {
    name: string,
    path: string,
    component: React.FC<any>,
}

export interface IRoutes {
    [key: string]: IRoute
}

export const Routes: IRoutes = Object.freeze({
    HOME: {
        name: "Home",
        path: "/Home",
        component: HomeScreen,
    },
    SIGN_UP: {
        name: "SignUp",
        path: "/SignUp",
        component: SignUpScreen,
    },
    LOGGED_OUT_SCAN_BOARD: {
        name: "LoggedOutScanBoard",
        path: "/LoggedOutScanBoard",
        component: LoggedOutScanBoardScreen,
    }
})

export const Routing = () => (
    <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen name={Routes.HOME.name} component={Routes.HOME.component} />
            <Stack.Screen name={Routes.SIGN_UP.name} component={Routes.SIGN_UP.component} />
            <Stack.Screen name={Routes.LOGGED_OUT_SCAN_BOARD.name} component={Routes.LOGGED_OUT_SCAN_BOARD.component} />
        </Stack.Navigator>
    </NavigationContainer>
);