import { Pressable, Text, View } from 'react-native';
import { EColors, colors, globalStyles } from '../../../assets/styles/global';
import React from 'react';

const AppBaseButton = ({ text, onPress, color }: { text: string; color?: EColors; onPress: () => void }) => {
    let bgColor: string;
    switch (color) {
        case EColors.primary:
            bgColor = colors.primary;
            break;
        case EColors.secondary:
            bgColor = colors.secondary;
            break;
        case EColors.flash:
            bgColor = colors.flash;
            break;
        case EColors.tertiary:
            bgColor = colors.tertiary;
            break;
        case EColors.bgLight:
            bgColor = colors.bgLight;
            break;
        default:
            bgColor = colors.primary;
    }

    return (
        <Pressable style={[globalStyles.baseButton, { backgroundColor: bgColor }]} onPress={onPress}>
            <View
                style={{
                    backgroundColor: '#fff2',
                    height: '45%',
                    position: 'absolute',
                    left: '2%',
                    width: '96%',
                    borderTopRightRadius: 200,
                    borderTopLeftRadius: 200,
                    borderBottomRightRadius: 200,
                    borderBottomLeftRadius: 200,
                }}
            />
            <View style={{ paddingHorizontal: 24, paddingVertical: 10 }}>
                <Text style={globalStyles.text}>{text}</Text>
            </View>
        </Pressable>
    );
};

export default AppBaseButton;
