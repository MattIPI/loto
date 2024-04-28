import React, { useState } from 'react';
import { View, Button, Image } from 'react-native';
import AppCamera from '../../components/camera/camera';
import { processImageLocally } from '../../helpers/image-processing';
import { CameraCapturedPicture } from 'expo-camera/build/Camera.types';

const LoggedOutScanBoardScreen = () => {
    const [shouldOpenCamera, setShouldOpenCamera] = useState(false);
    const [capturedPictureUrl, setCapturedPictureUrl] = useState<string>();

    const onCapturedPicture = (photo: CameraCapturedPicture) => {
        if (photo.base64) {
            setShouldOpenCamera(false);
            setCapturedPictureUrl(photo.base64);
            console.log('before processing', photo.base64);
            processImageLocally(photo.base64);
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <Button title="Scanner mon carton" onPress={() => setShouldOpenCamera(true)} />
            {shouldOpenCamera && !capturedPictureUrl && <AppCamera onCapturedPicture={onCapturedPicture} />}
            {capturedPictureUrl && <Image source={{ uri: capturedPictureUrl }} width={500} height={500} />}
        </View>
    );
};
export default LoggedOutScanBoardScreen;
