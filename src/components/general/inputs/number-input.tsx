import { AutoFocus } from 'expo-camera';
import React from 'react';
import { StyleProp, TextStyle, TextInput } from 'react-native';
import { globalStyles } from '../../../assets/styles/global';

type NumberInputProps = {
    value?: string;
    onChange: (text: string) => void;
    placeholder?: string;
    style?: StyleProp<TextStyle>;
    autoFocus?: boolean;
};

const AppNumberInput = ({ value, onChange, placeholder, style, autoFocus }: NumberInputProps) => (
    <TextInput
        autoFocus={autoFocus}
        maxLength={2}
        inputMode="numeric"
        onChangeText={onChange}
        placeholder={placeholder}
        keyboardType="number-pad"
        style={[
            globalStyles.number,
            style,
            { borderBottomWidth: 2, borderBottomColor: '#999', padding: 16, width: 'auto' },
        ]}
    />
);

export default AppNumberInput;
