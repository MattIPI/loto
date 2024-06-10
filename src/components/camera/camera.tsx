import { Camera, CameraCapturedPicture, CameraPictureOptions, CameraType, PermissionStatus } from 'expo-camera';
import React, { useCallback, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import CameraSnapshotButton from '../utils/camera/snapshot-button';
import CameraFlipButton from '../utils/camera/flip-button';

const AppCamera = ({
    onCapturedPicture,
}: {
    onCapturedPicture: (photo: CameraCapturedPicture) => void;
}): JSX.Element => {
    const [camera, setCamera] = useState({
        hasCameraPermission: null,
        type: CameraType.back,
    });
    const [cameraRef, setCameraRef] = useState<Camera | null>(null);
    const [cameraStatus, requestPermission] = Camera.useCameraPermissions();
    const [isCameraReady, setIsCameraReady] = useState<boolean>(false);
    const [isCameraPaused, setIsCameraPaused] = useState<boolean>(false);
    const cameraOptions: CameraPictureOptions = {
        quality: 0.5,
        base64: true,
        exif: true,
        isImageMirror: false,
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
            setIsCameraPaused(true);
            onCapturedPicture(photo);
        }
    }, [isCameraReady, cameraRef]);

    if (cameraStatus?.status === PermissionStatus.DENIED) {
        return <Text>No access to camera</Text>;
    }

    return (
        <Camera
            style={{ flex: 1, width: '100%' }}
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
                    alignItems: 'flex-end',
                    paddingBottom: 20,
                }}
            >
                {isCameraReady && !isCameraPaused && (
                    <>
                        <View style={{ position: 'absolute', right: 20, top: 20 }}>
                            <CameraFlipButton
                                flip={() =>
                                    setCamera({
                                        ...camera,
                                        type: camera.type === CameraType.back ? CameraType.front : CameraType.back,
                                    })
                                }
                            />
                        </View>
                        <CameraSnapshotButton takeSnapshot={takeSnapshot} />
                    </>
                )}
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
