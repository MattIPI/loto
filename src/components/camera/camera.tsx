import { Camera, CameraCapturedPicture, CameraPictureOptions, CameraType, PermissionStatus } from 'expo-camera';
import React, { useCallback, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';

const AppCamera = (): JSX.Element => {
    const [camera, setCamera] = useState({
        hasCameraPermission: null,
        type: CameraType.back,
    });
    const [cameraRef, setCameraRef] = useState<Camera | null>(null);
    const [cameraStatus, requestPermission] = Camera.useCameraPermissions();
    const [isCameraReady, setIsCameraReady] = useState<boolean>(false);
    const cameraOptions: CameraPictureOptions = {
        quality: 1,
        base64: true,
        exif: true,
    };

    const setCameraReady = useCallback(() => {
        setIsCameraReady(true);
    }, []);

    //   const openExpoCamera = async () => {
    //     if (!cameraStatus?.granted) {
    //       await requestPermission();
    //     }
    //     setShouldOpenCamera(true);
    //   };

    const takeSnapshot = useCallback(async () => {
        if (cameraRef !== null && isCameraReady) {
            const photo: CameraCapturedPicture = await cameraRef.takePictureAsync(cameraOptions);
            await cameraRef.pausePreview();
            // todo: use tesseract to read the text from the photo in base 64
            // https://github.com/naptha/tesseract.js/blob/master/docs/image-format.md
            // https://github.com/naptha/tesseract.js/blob/master/docs/workers_vs_schedulers.md#option-1-using-workers-directly
        }
    }, [isCameraReady, cameraRef]);

    if (cameraStatus?.status === PermissionStatus.DENIED) {
        return <Text>No access to camera</Text>;
    }

    return (
        <Camera
            style={{ flex: 1 }}
            type={camera.type}
            onCameraReady={setCameraReady}
            ref={(ref) => {
                setCameraRef(ref);
            }}
        >
            <View
                style={{
                    flex: 1,
                    backgroundColor: 'transparent',
                    flexDirection: 'row',
                }}
            >
                <TouchableOpacity
                    style={{
                        flex: 0.1,
                        alignSelf: 'flex-end',
                        alignItems: 'center',
                    }}
                    onPress={() => {
                        setCamera({
                            type: CameraType.back,
                            hasCameraPermission: camera.hasCameraPermission,
                        });
                    }}
                >
                    <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}> Flip </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{
                        display: isCameraReady ? 'flex' : 'none',
                        flex: 0.1,
                        alignSelf: 'flex-end',
                        alignItems: 'center',
                    }}
                    onPress={async () => {
                        takeSnapshot();
                    }}
                >
                    <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}>Take snapshot</Text>
                </TouchableOpacity>
            </View>
        </Camera>
    );
};

export default AppCamera;

const styles = StyleSheet.create({
    cameraContainer: {
        flex: 1,
        flexDirection: 'row',
    },
    fixedRatio: {
        flex: 1,
        aspectRatio: 1,
    },
});
