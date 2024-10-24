import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Modal, TextInput, StyleSheet, Alert, Image, ScrollView} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import {format} from 'date-fns';

const AddBusinessLunchModal = ({visible, onClose, restaurantId, onAddBusinessLunch}) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [imageUri, setImageUri] = useState(null);
    const [timeFrom, setTimeFrom] = useState(new Date());
    const [timeTo, setTimeTo] = useState(new Date());
    const [showTimeFromPicker, setShowTimeFromPicker] = useState(false);
    const [showTimeToPicker, setShowTimeToPicker] = useState(false);

    const selectImage = () => {
        launchImageLibrary({mediaType: 'photo'}, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorMessage) {
                console.log('ImagePicker Error: ', response.errorMessage);
            } else if (response.assets && response.assets.length > 0) {
                setImageUri(response.assets[0].uri);
            }
        });
    };

    const formatDate = (date) => {
        return format(date, 'HH:mm');
    };

    const handleAddBusinessLunch = () => {
        if (!title || !description || !price || !imageUri) {
            Alert.alert('Помилка', 'Будь ласка, заповніть всі поля та додайте зображення.');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('price', parseFloat(price));
        formData.append('restaurantId', restaurantId);
        formData.append('timeFrom', timeFrom.toISOString());
        formData.append('timeTo', timeTo.toISOString());

        const imageName = imageUri.split('/').pop();
        const imageExtension = imageName.split('.').pop();
        const imageFile = {
            uri: imageUri,
            type: `image/${imageExtension}`,
            name: imageName,
        };
        formData.append('image', imageFile);

        axios.post('http://localhost:8089/api/special-offers/business-lunch', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then((response) => {
                onAddBusinessLunch(response.data);
                onClose();
            })
            .catch((error) => {
                console.error('Error adding business lunch:', error);
                Alert.alert('Помилка', 'Не вдалося додати бізнес-ланч.');
            });
    };

    return (
        <Modal visible={visible} transparent={true} animationType="slide">
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <ScrollView>
                        <Text style={styles.modalTitle}>Додати Бізнес Ланч</Text>

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

                        <TouchableOpacity onPress={() => setShowTimeFromPicker(true)}>
                            <Text style={styles.dateText}>Від: {formatDate(timeFrom)}</Text>
                        </TouchableOpacity>
                        {showTimeFromPicker && (
                            <DateTimePicker
                                value={timeFrom}
                                mode="time"
                                display="default"
                                onChange={(event, selectedTime) => {
                                    setShowTimeFromPicker(false);
                                    if (selectedTime) {
                                        setTimeFrom(selectedTime);
                                    }
                                }}
                            />
                        )}

                        <TouchableOpacity onPress={() => setShowTimeToPicker(true)}>
                            <Text style={styles.dateText}>До: {formatDate(timeTo)}</Text>
                        </TouchableOpacity>
                        {showTimeToPicker && (
                            <DateTimePicker
                                value={timeTo}
                                mode="time"
                                display="default"
                                onChange={(event, selectedTime) => {
                                    setShowTimeToPicker(false);
                                    if (selectedTime) {
                                        setTimeTo(selectedTime);
                                    }
                                }}
                            />
                        )}

                        {imageUri && (
                            <Image source={{uri: imageUri}} style={styles.imagePreview}/>
                        )}

                        <TouchableOpacity style={styles.selectImageButton} onPress={selectImage}>
                            <Text style={styles.selectImageText}>Вибрати зображення</Text>
                        </TouchableOpacity>

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={styles.addButton}
                                onPress={handleAddBusinessLunch}
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
                    </ScrollView>
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

export default AddBusinessLunchModal;
