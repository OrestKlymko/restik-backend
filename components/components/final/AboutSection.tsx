import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Linking, Alert, Platform, ScrollView, Image } from 'react-native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ImageView from 'react-native-image-viewing'; // Для перегляду фото на весь екран

export const AboutSection = () => {
    const [isImageViewVisible, setImageViewVisible] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const currentTime = new Date();
    const openingTime = new Date();
    const closingTime = new Date();

    // Встановимо години роботи
    openingTime.setHours(10, 0); // Відкривається о 10:00
    closingTime.setHours(22, 0); // Закривається о 22:00

    // Логіка для перевірки статусу закладу (відкрито чи закрито)
    const isOpen = currentTime >= openingTime && currentTime <= closingTime;

    const getStatusText = () => {
        if (isOpen) {
            return `Відчинено до ${closingTime.getHours()}:${closingTime.getMinutes() === 0 ? '00' : closingTime.getMinutes()}`;
        } else {
            return `Зачинено, відкриється о ${openingTime.getHours()}:${openingTime.getMinutes() === 0 ? '00' : openingTime.getMinutes()}`;
        }
    };

    const features = ['Wi-Fi', 'Парковка', 'Тераса'];

    const photos = [
        { uri: 'https://cdn.vox-cdn.com/thumbor/5d_RtADj8ncnVqh-afV3mU-XQv0=/0x0:1600x1067/1200x900/filters:focal(672x406:928x662)/cdn.vox-cdn.com/uploads/chorus_image/image/57698831/51951042270_78ea1e8590_h.7.jpg' },
        { uri: 'https://cdn.vox-cdn.com/thumbor/5d_RtADj8ncnVqh-afV3mU-XQv0=/0x0:1600x1067/1200x900/filters:focal(672x406:928x662)/cdn.vox-cdn.com/uploads/chorus_image/image/57698831/51951042270_78ea1e8590_h.7.jpg' },
        { uri: 'https://cdn.vox-cdn.com/thumbor/5d_RtADj8ncnVqh-afV3mU-XQv0=/0x0:1600x1067/1200x900/filters:focal(672x406:928x662)/cdn.vox-cdn.com/uploads/chorus_image/image/57698831/51951042270_78ea1e8590_h.7.jpg' },
        { uri: 'https://cdn.vox-cdn.com/thumbor/5d_RtADj8ncnVqh-afV3mU-XQv0=/0x0:1600x1067/1200x900/filters:focal(672x406:928x662)/cdn.vox-cdn.com/uploads/chorus_image/image/57698831/51951042270_78ea1e8590_h.7.jpg' },
        { uri: 'https://cdn.vox-cdn.com/thumbor/5d_RtADj8ncnVqh-afV3mU-XQv0=/0x0:1600x1067/1200x900/filters:focal(672x406:928x662)/cdn.vox-cdn.com/uploads/chorus_image/image/57698831/51951042270_78ea1e8590_h.7.jpg' },
    ];

    // Функція для відкриття карти
    const openMap = () => {
        const latitude = 50.4501; // Ваші координати
        const longitude = 30.5234;

        const googleMapsUrl = `comgooglemaps://?daddr=${latitude},${longitude}&directionsmode=driving`; // URL для Google Maps
        const appleMapsUrl = `maps://?daddr=${latitude},${longitude}&dirflg=d`; // URL для Apple Maps

        if (Platform.OS === 'ios') {
            Linking.canOpenURL(appleMapsUrl)
                .then(supported => {
                    if (supported) {
                        return Linking.openURL(appleMapsUrl);
                    } else {
                        return Linking.openURL(`https://maps.apple.com/?daddr=${latitude},${longitude}`);
                    }
                })
                .catch(err => Alert.alert('Помилка', 'Не вдалося відкрити карти.'));
        } else {
            Linking.canOpenURL(googleMapsUrl)
                .then(supported => {
                    if (supported) {
                        return Linking.openURL(googleMapsUrl);
                    } else {
                        return Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`);
                    }
                })
                .catch(err => Alert.alert('Помилка', 'Не вдалося відкрити карти.'));
        }
    };

    // Функція для дзвінка
    const makeCall = () => {
        const phoneNumber = 'tel:+380501234567';
        Linking.canOpenURL(phoneNumber)
            .then(supported => {
                if (supported) {
                    Linking.openURL(phoneNumber);
                } else {
                    Alert.alert('Помилка', 'Не вдалося здійснити дзвінок');
                }
            });
    };

    return (
        <View style={styles.sectionContainer}>
            {/* Назва секції */}
            <Text style={styles.sectionTitle}>Про заклад</Text>

            {/* Опис */}
            <Text style={styles.description}>
                Тут буде опис ресторану. Він може бути довгим або коротким, залежно від інформації, яку ви хочете надати.
            </Text>

            {/* Фотографії закладу */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photoContainer}>
                {photos.map((photo, index) => (
                    <TouchableOpacity key={index} onPress={() => { setCurrentImageIndex(index); setImageViewVisible(true); }}>
                        <Image source={{ uri: photo.uri }} style={styles.photo} />
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Відкриття перегляду фото */}
            <ImageView
                images={photos}
                imageIndex={currentImageIndex}
                visible={isImageViewVisible}
                onRequestClose={() => setImageViewVisible(false)}
            />

            {/* Фічі та тип кухні */}
            <View style={styles.featuresContainer}>
                <View style={styles.featuresList}>
                    {features.map(feature => (
                        <View key={feature} style={styles.featureItem}>
                            <Text style={styles.featureText}>
                                {feature}
                            </Text>
                        </View>
                    ))}
                </View>
            </View>

            <View><TouchableOpacity onPress={() => Linking.openURL('http://your-menu-link.com')}>
                <Text style={styles.menuLink}>Переглянути меню</Text>
            </TouchableOpacity>
            </View>
            {/* Блок з адресою, годинами роботи та телефоном */}
            <View style={styles.infoContainer}>
                <TouchableOpacity onPress={openMap} style={styles.infoItem}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="map" size={24} color="#1C170D" />
                    </View>
                    <Text style={styles.infoText}>вул. Київська, 10</Text>
                </TouchableOpacity>

                <View style={styles.infoItem}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="time" size={24} color="#1C170D" />
                    </View>
                    <Text style={[styles.infoText, !isOpen && styles.closedText]}>{getStatusText()}</Text>
                </View>

                <TouchableOpacity onPress={makeCall} style={styles.infoItem}>
                    <View style={styles.iconContainer}>
                        <FontAwesome5Icon name="phone" size={24} color="#1C170D" />
                    </View>
                    <Text style={styles.infoText}>+38 (050) 123-45-67</Text>
                </TouchableOpacity>
            </View>

            {/* Кнопка "Резервувати стіл" */}
            <View style={styles.reserveButton}>
                <Text style={styles.reserveButtonText}>Резервувати стіл</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    sectionContainer: {
        padding: 16,
    },
    sectionTitle: {
        fontFamily: 'PlusJakartaSans-Regular',
        fontSize: 22,
        fontWeight: '700',
        lineHeight: 28,
        textAlign: 'left',
        color: '#1C170D',
        marginBottom: 8,
    },
    description: {
        fontFamily: 'PlusJakartaSans-Regular',
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 24,
        textAlign: 'left',
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
    featuresContainer: {
        marginBottom: 16,
    },
    featuresList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    featureItem: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#1C170D',
        borderRadius: 10,
        marginRight: 8,
        marginBottom: 8,
        backgroundColor: 'transparent',
    },
    featureText: {
        fontFamily: 'PlusJakartaSans-Regular',
        fontSize: 16,
        fontWeight: '400',
        color: '#996E4D',
    },
    infoContainer: {
        marginBottom: 16,
    },
    menuLink: {
        fontFamily: 'PlusJakartaSans-Regular',
        fontSize: 16,
        fontWeight: '400',
        color: '#A1824A',
        textDecorationLine: 'underline',
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
        fontFamily: 'PlusJakartaSans-Regular',
        fontSize: 16,
        fontWeight: '400',
        color: '#1C170D',
    },
    closedText: {
        color: 'red',
    },
    reserveButton: {
        width: 358,
        height: 48,
        backgroundColor: '#009963',
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: 76,
    },
    reserveButtonText: {
        fontFamily: 'PlusJakartaSans-Regular',
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
    },
});
