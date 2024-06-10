import { StyleSheet } from 'react-native';

export enum EFonts {
    CoffeCake,
    Nicolast,
}

export enum EColors {
    bgLight,
    secondary,
    flash,
    tertiary,
    primary,
    red,
}

export const colors = {
    bgLight: '#ffc470ff',
    secondary: '#419d78ff',
    // flash: '#ffb7c3ff',
    tertiary: '#bfd7eaff',
    primary: '#456990ff',
    red: '#b42929',
    flash: '#61C9A8',
    // primary: '#F3A712',
};

export const globalStyles = StyleSheet.create({
    text: {
        fontFamily: 'CoffeCake',
        fontSize: 20,
    },
    textH1: {
        fontFamily: 'CoffeCake',
        fontSize: 36,
    },
    number: {
        fontFamily: 'Nicolast',
        fontSize: 20,
    },
    pageContainer: {
        flex: 1,
        backgroundColor: colors.bgLight,
        alignItems: 'center',
        justifyContent: 'center',
    },
    baseButton: {
        borderColor: '#fff',
        borderWidth: 2,
        borderRadius: 24,
        overflow: 'hidden',
    },
});
