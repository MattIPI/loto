import React from 'react';
import { Modal, Alert, View, Pressable, StyleSheet, Text } from 'react-native';
import GameScreen from '../../../screens/logged-out/game';

const AppModal = ({ content, isOpen, onClose }: { content: JSX.Element; isOpen: boolean; onClose: () => void }) => (
    <Modal
        animationType="slide"
        onDismiss={() => console.log('Modal has been dismissed.')}
        transparent={true}
        visible={isOpen}
        presentationStyle="pageSheet"
        onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            close();
        }}
    >
        <View style={[styles.centeredView, { maxWidth: '90%', alignSelf: 'center' }]}>
            <View style={styles.modalView}>{content}</View>
        </View>
    </Modal>
);
export default AppModal;
const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        maxWidth: '90%',
    },
    modalView: {
        maxWidth: '100%',
        position: 'relative',
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
});
