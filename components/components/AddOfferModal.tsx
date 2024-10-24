import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Modal, TextInput, StyleSheet, Alert, Image} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker'; // Бібліотека для вибору зображень
import DateTimePicker from '@react-native-community/datetimepicker'; // Бібліотека для вибору дати
import axios from 'axios'; // Бібліотека для HTTP запитів
import {format} from 'date-fns'; // Бібліотека для форматування дат

const AddOfferModal = ({visible, onClose, restaurantId, onAddOffer}) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [imageUri, setImageUri] = useState(null); // Для URI зображення
    const [timeFrom, setTimeFrom] = useState(new Date());
    const [timeTo, setTimeTo] = useState(new Date());
    const [showFromPicker, setShowFromPicker] = useState(false); // Контроль відображення вибору дати
    const [showToPicker, setShowToPicker] = useState(false); // Контроль відображення вибору дати

    // Вибір зображення з галереї
    const selectImage = () => {
        launchImageLibrary(
            {mediaType: 'photo'},
            (response) => {
                if (response.didCancel) {
                    console.log('User cancelled image picker');
                } else if (response.errorMessage) {
                    console.log('ImagePicker Error: ', response.errorMessage);
                } else if (response.assets && response.assets.length > 0) {
                    setImageUri(response.assets[0].uri); // Зберігаємо URI вибраного зображення
                }
            }
        );
    };

    // Встановлення часу на 00:00 для вибраної дати
    const setMidnight = (date) => {
        const newDate = new Date(date);
        newDate.setHours(0, 0, 0, 0); // Встановлюємо час на 00:00
        return newDate;
    };
    const setEndDate = (date) => {
        const newDate = new Date(date)
        newDate.setHours(23, 59, 59, 59);
        return newDate;
    }

    // Форматування дати у бажаному форматі
    const formatDate = (date) => {
        return format(date, 'dd.MM.yyyy'); // Відображаємо дату у форматі "день.місяць.рік"
    };

    // Обробка додавання пропозиції
    const handleAddOffer = () => {
        if (!title || !description  || !imageUri) {
            Alert.alert('Помилка', 'Будь ласка, заповніть всі поля та додайте зображення.');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('restaurantId', restaurantId);
        formData.append('timeFrom', setMidnight(timeFrom).toISOString()); // Встановлюємо час на 00:00
        formData.append('timeTo', setEndDate(timeTo).toISOString()); // Встановлюємо час на 00:00

        // Додаємо зображення у форматі FormData
        const imageName = imageUri.split('/').pop();
        const imageExtension = imageName.split('.').pop();
        const imageFile = {
            uri: imageUri,
            type: `image/${imageExtension}`,
            name: imageName,
        };
        formData.append('image', imageFile); // Ключ 'image' має відповідати серверному API

        // Відправляємо дані на сервер
        axios.post('http://localhost:8089/api/special-offers', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then((response) => {
                onAddOffer(response.data); // Додаємо нову пропозицію до списку
                onClose(); // Закриваємо модальне вікно після успішного додавання
            })
            .catch((error) => {
                console.error('Error adding offer:', error);
                Alert.alert('Помилка', 'Не вдалося додати пропозицію.');
            });
    };

    return (
        <Modal visible={visible} transparent={true} animationType="slide">
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Додати нову пропозицію</Text>

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


                    {/* Вибір дати початку */}
                    <TouchableOpacity onPress={() => setShowFromPicker(true)}>
                        <Text style={styles.dateText}>Дата початку: {formatDate(timeFrom)}</Text>
                    </TouchableOpacity>
                    {showFromPicker && (
                        <DateTimePicker
                            value={timeFrom}
                            mode="date" // Вибір тільки дати
                            display="default"
                            onChange={(event, selectedDate) => {
                                setShowFromPicker(false);
                                if (selectedDate) {
                                    setTimeFrom(selectedDate);
                                }
                            }}
                        />
                    )}

                    {/* Вибір дати завершення */}
                    <TouchableOpacity onPress={() => setShowToPicker(true)}>
                        <Text style={styles.dateText}>Дата закінчення: {formatDate(timeTo)}</Text>
                    </TouchableOpacity>
                    {showToPicker && (
                        <DateTimePicker
                            value={timeTo}
                            mode="date" // Вибір тільки дати
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
                        <Image source={{uri: imageUri}} style={styles.imagePreview}/>
                    )}
                    {/* Кнопка для вибору зображення */}
                    <TouchableOpacity style={styles.selectImageButton} onPress={selectImage}>
                        <Text style={styles.selectImageText}>Вибрати зображення</Text>
                    </TouchableOpacity>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={handleAddOffer}
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

export default AddOfferModal;
