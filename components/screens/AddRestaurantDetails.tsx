import React, {useEffect, useState} from 'react';
import {
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    View,
    Alert,
    Image,
    ScrollView,
    Modal,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";

const MAX_DESCRIPTION_LENGTH = 250;

type FeaturesResponse = {
    id: number,
    key: string,
    valueUa: string,
    valueRu: string
}

const daysOfWeek = [
    {day: 'Понеділок', key: 'MONDAY'},
    {day: 'Вівторок', key: 'TUESDAY'},
    {day: 'Середа', key: 'WEDNESDAY'},
    {day: 'Четвер', key: 'THURSDAY'},
    {day: 'П’ятниця', key: 'FRIDAY'},
    {day: 'Субота', key: 'SATURDAY'},
    {day: 'Неділя', key: 'SUNDAY'},
];

export const AddRestaurantDetails = ({route, navigation}: any) => {
    const {restaurantId} = route.params || {}; // Отримуємо restaurantId з параметрів, якщо він є
    const [description, setDescription] = useState('');
    const {newRestaurantData} = route.params;
    const [phoneNumber, setPhoneNumber] = useState('+380 ');
    const [menuLink, setMenuLink] = useState('');
    const [selectedImages, setSelectedImages] = useState<any[]>([]);
    const [selectedMainImage, setSelectedMainImage] = useState<string | null>(null);
    const [selectedFeatures, setSelectedFeatures] = useState<number[]>([]); // Тепер зберігаємо ID фіч
    const [features, setFeatures] = useState<FeaturesResponse[]>([])
    const [workSchedule, setWorkSchedule] = useState<{
        [key: string]: { open: string; close: string; enabled: boolean };
    }>({});
    const [isWorkScheduleModalVisible, setWorkScheduleModalVisible] = useState(false);
    const [removedImages, setRemovedImages] = useState<any[]>([]);
    const [removedFeatures, setRemovedFeatures] = useState<number[]>([]);
    const [updatedWorkSchedule, setUpdatedWorkSchedule] = useState<{
        [key: string]: { open: string; close: string; enabled: boolean };
    }>({});
    const [bucket, setBucket] = useState<string | null>(null);

    useEffect(() => {
        axios.get('http://localhost:8089/api/restaurants/features').then((response) => {
            setFeatures(response.data);
        });

        if (restaurantId) {
            axios.get(`http://localhost:8089/api/restaurants/${restaurantId}`)
                .then((response) => {
                    setBucket(response.data.images[0].bucketName)
                    setMenuLink(response.data.menuLink)
                    setPhoneNumber(response.data.phoneNumber)
                    setDescription(response.data.description)
                    setSelectedMainImage(response.data.mainPhoto)
                    setSelectedFeatures(response.data.features)
                    const formattedImages = response.data.images.map((img, index) => ({
                        uri: img.image,
                        id: index, // Додаємо унікальний ідентифікатор
                        bucketName: img.bucketName,
                    }));
                    setSelectedImages(formattedImages);
                    const workDaysDatas = {};
                    response.data.workDays.forEach((day: { day: string, openFrom: string, openTo: string }) => {
                        workDaysDatas[day.day] = {
                            open: day.openFrom.slice(0, 5),
                            close: day.openTo.slice(0, 5),
                            enabled: true, // Встановлюємо, що день активний
                        };
                    });
                    setWorkSchedule(workDaysDatas); // Встановлюємо робочий графік
                    setUpdatedWorkSchedule(workDaysDatas);
                })
                .catch((error) => {
                    console.log('Помилка під час отримання даних ресторану:', error);
                    Alert.alert('Помилка', 'Не вдалося завантажити дані ресторану');
                    navigation.navigate('Мої ресторани')
                });
        }
    }, []);

    const handlePhoneNumberChange = (text: string) => {
        const cleanedText = text.replace(/[^0-9]/g, '');
        let formattedText = '+380 ';
        if (cleanedText.length > 3) {
            formattedText += `(${cleanedText.slice(3, 5)}) `;
        }
        if (cleanedText.length > 5) {
            formattedText += `${cleanedText.slice(5, 8)}-`;
        }
        if (cleanedText.length > 8) {
            formattedText += `${cleanedText.slice(8, 10)}-`;
        }
        if (cleanedText.length > 10) {
            formattedText += cleanedText.slice(10, 12);
        }
        setPhoneNumber(cleanedText.length < 3 ? '+380 ' : formattedText);
    };

    const handleSelectMainImage = (uri: string) => {
        setSelectedMainImage(uri);
    };

    // const handleRemoveImage = (uri: string) => {
    //     setSelectedImages(selectedImages.filter(image => image.uri !== uri));
    //     if (selectedMainImage === uri) {
    //         setSelectedMainImage(null);
    //     }
    // };

    const handleToggleFeature = (featureId: number) => {
        if (selectedFeatures.includes(featureId)) {
            setRemovedFeatures([...removedFeatures, featureId]);
            setSelectedFeatures(selectedFeatures.filter(f => f !== featureId));
        } else {
            setSelectedFeatures([...selectedFeatures, featureId]);
            setRemovedFeatures(removedFeatures.filter(f => f !== featureId)); // Видаляємо з видалених, якщо додаємо
        }
    };

    const handleAddImage = () => {
        launchImageLibrary(
            {
                mediaType: 'photo',
                quality: 1,
                selectionLimit: 0,
            },
            (response) => {
                if (response.didCancel) {
                    console.log('Користувач скасував вибір зображення');
                } else if (response.errorCode) {
                    console.log('Помилка ImagePicker: ', response.errorMessage);
                } else if (response.assets) {
                    const newImages = response.assets.map(asset => ({
                        uri: asset.uri,
                        type: asset.type,
                        name: asset.fileName,
                    }));
                    setSelectedImages([...selectedImages, ...newImages]);
                }
            }
        );
    };
    const handleRemoveImage = (uri: string) => {
        const imageToRemove = selectedImages.find(image => image.uri === uri);
        console.log(uri)
        if (imageToRemove && imageToRemove.bucketName) {
            setRemovedImages([...removedImages, imageToRemove]);
        }
        setSelectedImages(selectedImages.filter(image => image.uri !== uri));
        if (selectedMainImage === uri) {
            setSelectedMainImage(null);
        }
    };
    const handleSaveRestaurant = async () => {
        if (description.trim() === '' || phoneNumber.trim() === '' || selectedImages.length === 0 || !workSchedule) {
            Alert.alert('Помилка', "Заповніть всі обов'язкові поля та додайте хоча б одну фотографію.");
            return;
        }

        const token = await AsyncStorage.getItem('token');

        try {
            if (restaurantId) {
                const formData = new FormData();
                formData.append('description', description);
                formData.append('phoneNumber', phoneNumber);
                formData.append('menuLink', menuLink || '');
                formData.append('selectedFeatures', JSON.stringify(selectedFeatures));
                formData.append('workSchedule', JSON.stringify(updatedWorkSchedule));

                selectedImages
                    .filter(image => !image.bucketName)
                    .forEach((image, index) => {
                        formData.append('selectedImages', {
                            uri: image.uri,
                            type: image.type || 'image/jpeg',
                            name: image.name || `image_${index}.jpg`,
                        });
                    });

                if (selectedMainImage) {
                    const mainImage = selectedImages.find(image => image.uri === selectedMainImage);
                    if (mainImage) {
                        formData.append('selectedMainImage', {
                            uri: mainImage.uri,
                            type: mainImage.type || 'image/jpeg',
                            name: mainImage.name || 'main_image.jpg',
                        });
                    }
                }
                // Додаємо видалені зображення
                if (removedImages.length > 0) {
                    formData.append('removedImages', JSON.stringify(removedImages.map(img => img.uri)));
                }

                // Додаємо видалені фічі
                if (removedFeatures.length > 0) {
                    formData.append('removedFeatures', JSON.stringify(removedFeatures));
                }
                formData.append('bucket', bucket);

                await axios.post(`http://localhost:8089/api/restaurants/${restaurantId}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`,
                    },
                });
            } else {
                const formData = new FormData();
                formData.append('description', description);
                formData.append('phoneNumber', phoneNumber);
                formData.append('street', newRestaurantData.street);
                formData.append('buildingNumber', newRestaurantData.buildingNumber);
                formData.append('city', newRestaurantData.city);
                formData.append('latitude', newRestaurantData.latitude);
                formData.append('longitude', newRestaurantData.longitude);
                formData.append('name', newRestaurantData.name);
                if (newRestaurantData.isNewRestaurant) {
                    formData.append('restaurantType', newRestaurantData.restaurantType);
                    formData.append('kitchenType', newRestaurantData.kitchenType);
                }
                formData.append('menuLink', menuLink || '');
                formData.append('selectedFeatures', JSON.stringify(selectedFeatures));
                formData.append('workSchedule', JSON.stringify(updatedWorkSchedule));

                // Додаємо нові зображення
                selectedImages
                    .filter(image => !image.bucketName)
                    .forEach((image, index) => {
                        formData.append('selectedImages', {
                            uri: image.uri,
                            type: image.type || 'image/jpeg',
                            name: image.name || `image_${index}.jpg`,
                        });
                    });

                // Додаємо головне зображення
                if (selectedMainImage) {
                    const mainImage = selectedImages.find(image => image.uri === selectedMainImage);
                    if (mainImage) {
                        formData.append('selectedMainImage', {
                            uri: mainImage.uri,
                            type: mainImage.type || 'image/jpeg',
                            name: mainImage.name || 'main_image.jpg',
                        });
                    }
                }

                await axios.post('http://localhost:8089/api/restaurants', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`,
                    },
                });
            }

            navigation.navigate('Мої ресторани');
        } catch (error) {
            console.error(error);
            Alert.alert('Помилка', 'Не вдалося зберегти ресторан');
        }
    };

    const handleWorkScheduleChange = (
        dayKey: string,
        field: 'open' | 'close',
        value: string
    ) => {
        setWorkSchedule({
            ...workSchedule,
            [dayKey]: {
                ...workSchedule[dayKey],
                [field]: value,
            },
        });

        // Оновлюємо графік, що відправимо на сервер
        setUpdatedWorkSchedule({
            ...updatedWorkSchedule,
            [dayKey]: {
                ...updatedWorkSchedule[dayKey],
                [field]: value,
            },
        });
    };

    const toggleDay = (dayKey: string) => {
        setWorkSchedule({
            ...workSchedule,
            [dayKey]: {
                ...workSchedule[dayKey],
                enabled: !workSchedule[dayKey]?.enabled,
            },
        });
    };


    const formatTimeInput = (value: string) => {
        const numericValue = value.replace(/[^0-9]/g, '');
        if (numericValue.length >= 1 && parseInt(numericValue.slice(0, 2)) > 24) {
            return '23';
        }
        if (numericValue.length >= 3 && parseInt(numericValue.slice(2, 4)) > 59) {
            return `${numericValue.slice(0, 2)}:59`;
        }
        if (numericValue.length >= 3) {
            return `${numericValue.slice(0, 2)}:${numericValue.slice(2, 4)}`;
        } else if (numericValue.length >= 1) {
            return `${numericValue.slice(0, 2)}`;
        }
        return '';
    };

    const renderWorkScheduleModal = () => (
        <Modal
            visible={isWorkScheduleModalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setWorkScheduleModalVisible(false)}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Налаштувати графік роботи</Text>
                    <ScrollView style={styles.modalScrollView}>
                        {daysOfWeek.map((day) => (
                            <View key={day.key} style={styles.scheduleRow}>
                                <TouchableOpacity
                                    style={[
                                        styles.dayButton,
                                        workSchedule[day.key]?.enabled && styles.dayButtonSelected,
                                    ]}
                                    onPress={() => toggleDay(day.key)}
                                >
                                    <Text
                                        style={[
                                            styles.dayButtonText,
                                            workSchedule[day.key]?.enabled &&
                                            styles.dayButtonTextSelected,
                                        ]}
                                    >
                                        {day.day}
                                    </Text>
                                </TouchableOpacity>

                                {workSchedule[day.key]?.enabled && (
                                    <View style={styles.timePickerRow}>
                                        <TextInput
                                            style={styles.timePickerInput}
                                            placeholder="00:00"
                                            value={workSchedule[day.key]?.open || ''}
                                            onChangeText={(text) =>
                                                handleWorkScheduleChange(
                                                    day.key,
                                                    'open',
                                                    formatTimeInput(text)
                                                )
                                            }
                                            keyboardType="numeric"
                                        />
                                        <Text style={styles.dash}> - </Text>
                                        <TextInput
                                            style={styles.timePickerInput}
                                            placeholder="00:00"
                                            value={workSchedule[day.key]?.close || ''}
                                            onChangeText={(text) =>
                                                handleWorkScheduleChange(
                                                    day.key,
                                                    'close',
                                                    formatTimeInput(text)
                                                )
                                            }
                                            keyboardType="numeric"
                                        />
                                    </View>
                                )}
                            </View>
                        ))}
                    </ScrollView>
                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={() => setWorkScheduleModalVisible(false)}
                    >
                        <Text style={styles.saveButtonText}>Зберегти графік</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.fieldLabel}>Короткий опис</Text>
            <TextInput
                style={styles.input}
                placeholder="Опишіть ваш заклад до 250 символів"
                value={description}
                onChangeText={setDescription}
                maxLength={MAX_DESCRIPTION_LENGTH}
                multiline
            />
            <Text style={styles.characterCount}>
                {description.length}/{MAX_DESCRIPTION_LENGTH}
            </Text>

            <Text style={styles.fieldLabel}>Номер телефону</Text>
            <TextInput
                style={styles.input}
                placeholder="+380 (XX) XXX-XX-XX"
                value={phoneNumber}
                onChangeText={handlePhoneNumberChange}
                keyboardType="phone-pad"
                maxLength={19}
            />

            <Text style={styles.fieldLabel}>Посилання на меню (необов'язково)</Text>
            <TextInput
                style={styles.input}
                placeholder="Введіть посилання на меню"
                value={menuLink}
                onChangeText={setMenuLink}
                keyboardType="url"
            />

            <Text style={styles.fieldLabel}>Фічі ресторану</Text>
            <View style={styles.featuresContainer}>
                {features.map((feature) => (
                    <TouchableOpacity
                        key={feature.id}
                        style={[
                            styles.featureButton,
                            selectedFeatures.includes(feature.id) && styles.featureButtonSelected,
                        ]}
                        onPress={() => handleToggleFeature(feature.id)}
                    >
                        <Text
                            style={[
                                styles.featureButtonText,
                                selectedFeatures.includes(feature.id) && styles.featureButtonTextSelected,
                            ]}
                        >
                            {feature.valueUa}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.buttonsRow}>
                <TouchableOpacity
                    style={styles.addButtonSmall}
                    onPress={() => setWorkScheduleModalVisible(true)}
                >
                    <Text style={styles.addButtonText}>Графік роботи</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.addButtonSmall} onPress={handleAddImage}>
                    <Text style={styles.addButtonText}>Додати фото</Text>
                </TouchableOpacity>
            </View>

            {renderWorkScheduleModal()}

            {selectedImages.length > 0 && <Text style={styles.fieldLabel}>Фото ресторану</Text>}
            <ScrollView horizontal style={styles.imagesContainer}>
                {selectedImages.map((image, index) => (
                    <View key={index} style={styles.imageWrapper}>
                        <TouchableOpacity onPress={() => handleSelectMainImage(image.uri)}>
                            <Image
                                source={{uri: image.uri}}
                                style={[
                                    styles.image,
                                    selectedMainImage === image.uri && styles.selectedImage,
                                ]}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.removeImageButton}
                            onPress={() => handleRemoveImage(image.uri)}
                        >
                            <Text style={styles.removeImageButtonText}>✕</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>

            {selectedImages.length > 0 && (
                <Text style={styles.selectedMainImageText}>
                    Головне фото:{' '}
                    {selectedMainImage
                        ? 'Вибрано'
                        : 'Не вибрано (натисніть на зображення, щоб вибрати головне)'}
                </Text>
            )}

            <TouchableOpacity style={styles.saveButton} onPress={handleSaveRestaurant}>
                <Text style={styles.saveButtonText}>Зберегти ресторан</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    // Ваші стилі залишаються без змін
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    fieldLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#996E4D',
        marginBottom: 4,
    },
    input: {
        borderColor: '#996E4D',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        marginBottom: 8,
        backgroundColor: '#f9f9f9',
        fontSize: 16,
        color: '#000000',
    },
    characterCount: {
        textAlign: 'right',
        fontSize: 12,
        color: '#666',
    },
    buttonsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    addButtonSmall: {
        backgroundColor: '#000',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        flex: 0.48,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    imagesContainer: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    imageWrapper: {
        position: 'relative',
        marginRight: 10,
    },
    image: {
        width: 120,
        height: 120,
        borderRadius: 10,
        borderColor: '#996E4D',
        borderWidth: 2,
    },
    selectedImage: {
        borderColor: '#000',
        borderWidth: 4,
    },
    removeImageButton: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: '#ff0000',
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    removeImageButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
    },
    selectedMainImageText: {
        fontSize: 14,
        color: '#009963',
        marginBottom: 8,
    },
    featuresContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 16,
    },
    featureButton: {
        padding: 10,
        borderRadius: 10,
        margin: 4,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#996E4D',
    },
    featureButtonSelected: {
        backgroundColor: '#000',
        borderColor: '#000',
    },
    featureButtonText: {
        fontSize: 14,
        color: '#996E4D',
    },
    featureButtonTextSelected: {
        color: '#fff',
    },
    saveButton: {
        backgroundColor: '#996E4D',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 40,
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#ffffff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#000000',
    },
    modalScrollView: {
        width: '100%',
        maxHeight: 300,
    },
    scheduleRow: {
        flexDirection: 'column',
        marginBottom: 10,
    },
    dayButton: {
        padding: 10,
        borderRadius: 10,
        marginVertical: 5,
        borderWidth: 1,
        borderColor: '#996E4D',
        backgroundColor: '#fff',
    },
    dayButtonSelected: {
        backgroundColor: '#000',
        borderColor: '#000',
    },
    dayButtonText: {
        fontSize: 14,
        color: '#996E4D',
    },
    dayButtonTextSelected: {
        color: '#fff',
    },
    timePickerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    timePickerInput: {
        flex: 1,
        padding: 10,
        borderColor: '#996E4D',
        borderWidth: 1,
        borderRadius: 10,
        textAlign: 'center',
        marginRight: 5,
    },
    dash: {
        fontSize: 20,
        color: '#996E4D',
        alignSelf: 'center',
        marginHorizontal: 5,
    },
});
