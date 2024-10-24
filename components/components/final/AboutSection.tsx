import React, {useEffect, useState} from 'react';
import {
    StyleSheet, Text, View, TouchableOpacity, Linking, Alert, Platform, ScrollView, Image, Modal, TextInput
} from 'react-native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import ImageView from 'react-native-image-viewing';
import {RestaurantFinalType} from "../../types/types.ts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

interface AboutSectionProps {
    restaurant?: RestaurantFinalType | null,
    location?: { latitude: number; longitude: number } | null | undefined,
    addressId?: number | undefined
}

export const AboutSection = ({restaurant, location, addressId}: AboutSectionProps) => {
    const [isImageViewVisible, setImageViewVisible] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [photos, setPhotos] = useState<{ uri: string }[]>([]);
    const [reserveModalVisible, setReserveModalVisible] = useState(false);
    const [guestCount, setGuestCount] = useState('');
    const [comment, setComment] = useState('');
    const [reservationDate, setReservationDate] = useState<Date | null>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [reservationTime, setReservationTime] = useState<Date | null>(null);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        AsyncStorage.getItem('token').then(setToken);
    }, []);

    // Заповнення фото
    useEffect(() => {
        if (restaurant?.imagesRest) {
            setPhotos(restaurant.imagesRest.map(photo => ({uri: photo})));
        }
    }, [restaurant]);

    const parseTime = (timeStr: string) => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        const time = new Date();
        time.setHours(hours, minutes, 0);
        return time;
    };

    const openingTime = restaurant?.openFrom ? parseTime(restaurant.openFrom) : null;
    const closingTime = restaurant?.openTo ? parseTime(restaurant.openTo) : null;
    const isOpen = openingTime && closingTime && new Date() >= openingTime && new Date() <= closingTime;

    const getStatusText = () => {
        if (isOpen) {
            return `Відчинено до ${closingTime?.getHours()}:${closingTime?.getMinutes() === 0 ? '00' : closingTime?.getMinutes()}`;
        } else {
            return `Зачинено, відкриється о ${openingTime?.getHours()}:${openingTime?.getMinutes() === 0 ? '00' : openingTime?.getMinutes()}`;
        }
    };

    const openMap = () => {
        const googleMapsUrl = `comgooglemaps://?daddr=${location?.latitude},${location?.longitude}&directionsmode=driving`;
        const appleMapsUrl = `maps://?daddr=${location?.latitude},${location?.longitude}&dirflg=d`;

        if (Platform.OS === 'ios') {
            Linking.canOpenURL(appleMapsUrl)
                .then(supported => {
                    if (supported) {
                        return Linking.openURL(appleMapsUrl);
                    } else {
                        return Linking.openURL(`https://maps.apple.com/?daddr=${location?.latitude},${location?.longitude}`);
                    }
                })
                .catch(err => Alert.alert('Помилка', 'Не вдалося відкрити карти.'));
        } else {
            Linking.canOpenURL(googleMapsUrl)
                .then(supported => {
                    if (supported) {
                        return Linking.openURL(googleMapsUrl);
                    } else {
                        return Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${location?.latitude},${location?.longitude}`);
                    }
                })
                .catch(err => Alert.alert('Помилка', 'Не вдалося відкрити карти.'));
        }
    };

    const makeCall = () => {
        const phoneNumber = `tel:${restaurant?.phoneNumber}`;
        Linking.canOpenURL(phoneNumber)
            .then(supported => {
                if (supported) {
                    Linking.openURL(phoneNumber);
                } else {
                    Alert.alert('Помилка', 'Не вдалося здійснити дзвінок');
                }
            });
    };

    // Об'єднання дати та часу в LocalDateTime формат
    const combineDateAndTime = (date: Date, time: Date) => {
        const combined = new Date(date);
        combined.setHours(time.getHours(), time.getMinutes());
        return combined;
    };

    const handleReserve = () => {
        if (!guestCount || !reservationDate || !reservationTime) {
            Alert.alert('Помилка', 'Будь ласка, заповніть усі поля');
            return;
        }

        const reservationDetails = {
            addressId: addressId, // ID ресторану
            reservationTime: combineDateAndTime(reservationDate!, reservationTime!), // Поєднання дати та часу
            guest: parseInt(guestCount),
            comment
        };
        console.log(token)
        axios.post('http://localhost:8089/api/reservation', reservationDetails, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
            .then(() => {
                Alert.alert('Успішно', 'Ваша резервація прийнята');
                setReserveModalVisible(false);
            }).catch(error => {
            console.log(error)
            Alert.alert('Помилка', 'Щось пішло не так');
        });
    };

    return (
        <View style={styles.sectionContainer}>
            <Text style={styles.description}>
                {restaurant?.description}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photoContainer}>
                {photos.map((photo, index) => (
                    <TouchableOpacity key={index} onPress={() => {
                        setCurrentImageIndex(index);
                        setImageViewVisible(true);
                    }}>
                        <Image source={{uri: photo.uri}} style={styles.photo}/>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <ImageView
                images={photos}
                imageIndex={currentImageIndex}
                visible={isImageViewVisible}
                onRequestClose={() => setImageViewVisible(false)}
            />

            <View style={styles.infoContainer}>
                <TouchableOpacity onPress={openMap} style={styles.infoItem}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="map" size={24} color="#1C170D"/>
                    </View>
                    <Text style={styles.infoText}>{restaurant?.address}</Text>
                </TouchableOpacity>

                <View style={styles.infoItem}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="time" size={24} color="#1C170D"/>
                    </View>
                    <Text style={[styles.infoText, !isOpen && styles.closedText]}>{getStatusText()}</Text>
                </View>

                <TouchableOpacity onPress={makeCall} style={styles.infoItem}>
                    <View style={styles.iconContainer}>
                        <FontAwesome5Icon name="phone" size={24} color="#1C170D"/>
                    </View>
                    <Text style={styles.infoText}>{restaurant?.phoneNumber}</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={styles.reserveButton}
                onPress={() => setReserveModalVisible(true)}
            >
                <Text style={styles.reserveButtonText}>Резервувати стіл</Text>
            </TouchableOpacity>

            {/* Модальне вікно для резервування */}
            <Modal visible={reserveModalVisible} transparent={true} animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Резервація столу</Text>

                        <Text style={styles.fieldLabel}>Дата</Text>
                        <TouchableOpacity
                            style={styles.input}
                            onPress={() => setShowDatePicker(true)}
                        >
                            <Text>{reservationDate ? reservationDate.toLocaleDateString() : 'Оберіть дату'}</Text>
                        </TouchableOpacity>
                        {showDatePicker && (
                            <DateTimePicker
                                value={reservationDate || new Date()}
                                mode="date"
                                display="default"
                                onChange={(event, selectedDate) => {
                                    setShowDatePicker(false);
                                    setReservationDate(selectedDate || reservationDate);
                                }}
                            />
                        )}

                        <Text style={styles.fieldLabel}>Час</Text>
                        <TouchableOpacity
                            style={styles.input}
                            onPress={() => setShowTimePicker(true)}
                        >
                            <Text>{reservationTime ? reservationTime.toLocaleTimeString() : 'Оберіть час'}</Text>
                        </TouchableOpacity>
                        {showTimePicker && (
                            <DateTimePicker
                                value={reservationTime || new Date()}
                                mode="time"
                                display="default"
                                onChange={(event, selectedTime) => {
                                    setShowTimePicker(false);
                                    setReservationTime(selectedTime || reservationTime);
                                }}
                            />
                        )}

                        <Text style={styles.fieldLabel}>Кількість гостей</Text>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            placeholder="Введіть кількість гостей"
                            value={guestCount}
                            onChangeText={setGuestCount}
                        />

                        <Text style={styles.fieldLabel}>Коментар</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Додатковий коментар (необов'язково)"
                            value={comment}
                            onChangeText={setComment}
                        />

                        <TouchableOpacity
                            style={styles.submitButton}
                            onPress={handleReserve}
                        >
                            <Text style={styles.submitButtonText}>Підтвердити резервацію</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={() => setReserveModalVisible(false)}
                        >
                            <Text style={styles.cancelButtonText}>Закрити</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    sectionContainer: {
        padding: 16,
    },
    description: {
        fontSize: 16,
        color: '#1C170D',
        marginBottom: 16,
    },
    photoContainer: {
        marginBottom: 16,
    },
    photo: {
        width: 160,
        height: 160,
        marginRight: 12,
        borderRadius: 10,
    },
    infoContainer: {
        marginBottom: 16,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#F5F0E5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    infoText: {
        fontSize: 16,
        color: '#1C170D',
    },
    closedText: {
        color: 'red',
    },
    reserveButton: {
        backgroundColor: '#009963',
        padding: 12,
        borderRadius: 10,
        marginBottom: 75,
        alignItems: 'center',
    },
    reserveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 16,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    fieldLabel: {
        fontSize: 16,
        marginBottom: 4,
    },
    input: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        marginBottom: 12,
    },
    submitButton: {
        backgroundColor: '#009963',
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 12,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    cancelButton: {
        backgroundColor: '#FF3B30',
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
