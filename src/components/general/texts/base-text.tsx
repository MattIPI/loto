import { StyleProp, Text, TextStyle, View } from 'react-native';
import { colors, globalStyles } from '../../../assets/styles/global';
import React from 'react';

type Props = {
    color?: 'primary' | 'secondary';
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    align?: 'center' | 'right' | 'left';
    text: string;
    inputStyle?: { [key: string]: string | number };
};

const AppBaseText = ({ color = 'primary', size = 'md', align = 'center', text, inputStyle = {} }: Props) => {
    let style: StyleProp<TextStyle> = {};
    style.textAlign = align;

    switch (color) {
        case 'secondary':
            style.color = colors.secondary;
            break;
        default:
            style.color = colors.primary;
            break;
    }

    switch (size) {
        case 'xs':
            style.fontSize = 14;
            break;
        case 'sm':
            style.fontSize = 18;
            break;
        case 'lg':
            style.fontSize = 26;
            break;
        case 'xl':
            style.fontSize = 36;
            break;
        default:
            style.fontSize = 20;
            break;
    }

    style = { ...style, ...inputStyle };
    return <Text style={[globalStyles.text, style]}>{text}</Text>;
};

export default AppBaseText;
