import '@expo/metro-runtime';
import React from 'react';
import { registerRootComponent } from 'expo';
import { Routing } from './utils/routing';
import { useFonts } from 'expo-font/build/FontHooks';

export default function App() {
    const [fontsLoaded] = useFonts({
        CoffeCake: require('./assets/fonts/CoffeCake.otf'),
        Nicolast: require('./assets/fonts/Nicolast.otf'),
    });

    return (
        <>
            <Routing />
        </>
    );
}

registerRootComponent(App);
