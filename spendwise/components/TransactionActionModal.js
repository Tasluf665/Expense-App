import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const TransactionActionModal = ({ visible, onClose, onEdit, onDelete }) => {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.modalOverlay}>
                    <TouchableWithoutFeedback>
                        <View style={styles.modalContent}>
                            <View style={styles.handleBar} />
                            <Text style={styles.modalTitle}>Transaction Options</Text>

                            <TouchableOpacity style={styles.optionButton} onPress={onEdit}>
                                <View style={[styles.iconContainer, { backgroundColor: '#E0E7FF' }]}>
                                    <FontAwesome name="pencil" size={20} color="#6366F1" />
                                </View>
                                <Text style={styles.optionText}>Edit</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.optionButton} onPress={onDelete}>
                                <View style={[styles.iconContainer, { backgroundColor: '#FEE2E2' }]}>
                                    <FontAwesome name="trash" size={20} color="#EF4444" />
                                </View>
                                <Text style={[styles.optionText, { color: '#EF4444' }]}>Delete</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 20,
        paddingBottom: 40,
    },
    handleBar: {
        width: 48,
        height: 4,
        backgroundColor: '#E5E5E5',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000000',
        marginBottom: 20,
        textAlign: 'center',
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 12,
        borderRadius: 12,
        marginBottom: 12,
        backgroundColor: '#F9F9F9',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    optionText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000000',
    },
    cancelButton: {
        paddingVertical: 16,
        borderRadius: 12,
        marginTop: 8,
        alignItems: 'center',
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#999999',
    },
});

export default TransactionActionModal;
