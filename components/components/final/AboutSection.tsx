import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Linking, Alert, Platform, ScrollView, Image} from 'react-native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ImageView from 'react-native-image-viewing';
import {RestaurantFinalType} from "../../types/types.ts"; // Для перегляду фото на весь екран

interface AboutSectionProps {
    restaurant?: RestaurantFinalType | null,
    location?: { latitude: number; longitude: number } | null | undefined
}

export const AboutSection = ({restaurant, location}: AboutSectionProps) => {
    const [isImageViewVisible, setImageViewVisible] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [photos, setPhotos] = useState<{ uri: string }[]>([]);
    const currentTime = new Date();


    useEffect(() => {
        if (restaurant?.imagesRest) {
            setPhotos(restaurant.imagesRest.map(photo => ({uri: photo})));
        }
    }, [restaurant]);

    // Конвертація часу відкриття та закриття у Date об'єкти
    const parseTime = (timeStr: string) => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        const time = new Date();
        time.setHours(hours, minutes, 0);
        return time;
    };

    const openingTime = restaurant?.openFrom ? parseTime(restaurant.openFrom) : null;
    const closingTime = restaurant?.openTo ? parseTime(restaurant.openTo) : null;

    const isOpen = openingTime && closingTime && currentTime >= openingTime && currentTime <= closingTime;


    const getStatusText = () => {
        if (isOpen) {
            return `Відчинено до ${closingTime.getHours()}:${closingTime.getMinutes() === 0 ? '00' : closingTime.getMinutes()}`;
        } else {
            return `Зачинено, відкриється о ${openingTime?.getHours()}:${openingTime?.getMinutes() === 0 ? '00' : openingTime?.getMinutes()}`;
        }
    };


    // Функція для відкриття карти
    const openMap = () => {

        const googleMapsUrl = `comgooglemaps://?daddr=${location?.latitude},${location?.longitude}&directionsmode=driving`;
        const appleMapsUrl = `maps://?daddr=${location?.latitude},${location?.longitude}&dirflg=d`; // URL для Apple Maps

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

    // Функція для дзвінка
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

            <View style={styles.featuresContainer}>
                <View style={styles.featuresList}>
                    {restaurant?.features.map(feature => (
                        <View key={feature} style={styles.featureItem}>
                            <Text style={styles.featureText}>
                                {feature}
                            </Text>
                        </View>
                    ))}
                </View>
            </View>

            {restaurant?.menuLink &&
                <View><TouchableOpacity onPress={() => Linking.openURL(restaurant?.menuLink)}>
                    <Text style={styles.menuLink}>Переглянути меню</Text>
                </TouchableOpacity>
                </View>}

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
