import { Foundation } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';

const CameraFlipButton = ({ flip }: { flip: () => void }) => (
    <TouchableOpacity
        style={{
            flex: 0.1,
            alignSelf: 'flex-end',
            alignItems: 'center',
        }}
        onPress={flip}
    >
        <Foundation name="loop" size={30} color="#eee" />
    </TouchableOpacity>
);

export default CameraFlipButton;
