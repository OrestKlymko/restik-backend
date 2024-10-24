import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, StyleSheet, Alert, Image } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import { format } from 'date-fns';

const AddLastChanceModal = ({ visible, onClose, restaurantId, onAddLastChance }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [oldPrice, setOldPrice] = useState('');
    const [imageUri, setImageUri] = useState(null);
    const [timeTo, setTimeTo] = useState(new Date());
    const [showToPicker, setShowToPicker] = useState(false);

    const selectImage = () => {
        launchImageLibrary({ mediaType: 'photo' }, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorMessage) {
                console.log('ImagePicker Error: ', response.errorMessage);
            } else if (response.assets && response.assets.length > 0) {
                setImageUri(response.assets[0].uri);
            }
        });
    };

    const setEndDate = (date) => {
        const newDate = new Date(date);
        newDate.setHours(23, 59, 59, 59);
        return newDate;
    };

    const formatDate = (date) => {
        return format(date, 'dd.MM.yyyy');
    };

    const handleAddLastChance = () => {
        if (!title || !description || !price || !oldPrice || !imageUri) {
            Alert.alert('Помилка', 'Будь ласка, заповніть всі поля та додайте зображення.');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('price', parseFloat(price));
        formData.append('oldPrice', parseFloat(oldPrice));
        formData.append('restaurantId', restaurantId);
        formData.append('timeTo', setEndDate(timeTo).toISOString());

        const imageName = imageUri.split('/').pop();
        const imageExtension = imageName.split('.').pop();
        const imageFile = {
            uri: imageUri,
            type: `image/${imageExtension}`,
            name: imageName,
        };
        formData.append('image', imageFile);

        axios.post('http://localhost:8089/api/special-offers/last-chance', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then((response) => {
                onAddLastChance(response.data);
                onClose();
            })
            .catch((error) => {
                console.error('Error adding last chance:', error);
                Alert.alert('Помилка', 'Не вдалося додати останній шанс.');
            });
    };

    return (
        <Modal visible={visible} transparent={true} animationType="slide">
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Додати Останній Шанс</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Назва"
                        value={title}
                        onChangeText={setTitle}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Опис"
                        value={description}
                        onChangeText={setDescription}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Ціна"
                        value={price}
                        keyboardType="numeric"
                        onChangeText={setPrice}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Стара ціна"
                        value={oldPrice}
                        keyboardType="numeric"
                        onChangeText={setOldPrice}
                    />

                    <TouchableOpacity onPress={() => setShowToPicker(true)}>
                        <Text style={styles.dateText}>Дата закінчення: {formatDate(timeTo)}</Text>
                    </TouchableOpacity>
                    {showToPicker && (
                        <DateTimePicker
                            value={timeTo}
                            mode="date"
                            display="default"
                            onChange={(event, selectedDate) => {
                                setShowToPicker(false);
                                if (selectedDate) {
                                    setTimeTo(selectedDate);
                                }
                            }}
                        />
                    )}

                    {imageUri && (
                        <Image source={{ uri: imageUri }} style={styles.imagePreview} />
                    )}

                    <TouchableOpacity style={styles.selectImageButton} onPress={selectImage}>
                        <Text style={styles.selectImageText}>Вибрати зображення</Text>
                    </TouchableOpacity>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={handleAddLastChance}
                        >
                            <Text style={styles.addButtonText}>Додати</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={onClose}
                        >
                            <Text style={styles.cancelButtonText}>Скасувати</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        marginHorizontal: 20,
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1C170D',
        marginBottom: 10,
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginVertical: 5,
    },
    selectImageButton: {
        backgroundColor: '#000',
        padding: 10,
        borderRadius: 10,
        marginTop: 10,
        alignItems: 'center',
        width: '100%',
    },
    selectImageText: {
        color: '#fff',
        fontWeight: '600',
    },
    imagePreview: {
        width: 100,
        height: 100,
        borderRadius: 10,
        marginVertical: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        width: '100%',
    },
    addButton: {
        backgroundColor: '#A1824A',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        flex: 1,
        marginRight: 10,
    },
    cancelButton: {
        backgroundColor: '#ccc',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        flex: 1,
    },
    addButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
    cancelButtonText: {
        color: '#333',
        fontWeight: '600',
    },
    dateText: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: '600',
    },
});

export default AddLastChanceModal;
