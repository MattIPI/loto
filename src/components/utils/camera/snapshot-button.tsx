import React from 'react';
import { TouchableOpacity, View } from 'react-native';

const CameraSnapshotButton = ({ takeSnapshot }: { takeSnapshot: () => void }) => (
    <TouchableOpacity
        style={{
            display: 'flex',
            width: '100%',
            height: 80,
            justifyContent: 'center',
            alignItems: 'center',
        }}
        onPress={async () => {
            takeSnapshot();
        }}
    >
        <View
            style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: '#eee',
                opacity: 0.2,
            }}
        />
        <View
            style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: '#eee',
                opacity: 0.5,
                position: 'absolute',
            }}
        />
    </TouchableOpacity>
);

export default CameraSnapshotButton;
