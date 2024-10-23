import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Restaurant } from '../types/types.ts';

interface RestaurantCardProps {
    restaurant: Restaurant | undefined;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
    if (restaurant === undefined) {
        return <Text>Restaurant not found</Text>;
    }

    // Функція для конвертації метри/кілометри
    const formatDistance = (distance: number) => {
        return distance >= 1000
            ? `${(distance / 1000).toFixed(1)} км`
            : `${Math.round(distance)} м`;
    };

    // Функція для формату типів кухонь
    const formatCuisineTypes = (cuisineTypes: string[]) => {
        return cuisineTypes.join(' • ');
    };

    return (
        <View style={styles.card}>
            <Image source={{ uri: restaurant.imageUrl }} style={styles.image} />

            <View style={styles.details}>
                {/* Назва і відстань в одному рядку */}
                <View style={styles.row}>
                    <Text style={styles.name}>{restaurant.name}</Text>
                    {restaurant.distanceFromUser !== undefined && (
                        <Text style={styles.distance}>
                            {formatDistance(restaurant.distanceFromUser)}
                        </Text>
                    )}
                </View>

                {/* Рейтинг */}
                <View style={styles.row}>
                    {restaurant.rating !== undefined && (
                        <Text style={styles.infoText}>Рейтинг відвідувачів: {restaurant.rating} / 5</Text>
                    )}
                </View>

                {/* Кухні в новому рядку */}
                {restaurant.cuisineType.length > 0 && (
                    <View style={styles.row}>
                        <Text style={styles.cuisineTypeText}>{formatCuisineTypes(restaurant.cuisineType)}</Text>
                    </View>
                )}

                {/* Фічі */}
                <View style={styles.featuresContainer}>
                    {restaurant.features.map((feature, index) => (
                        <View key={index} style={styles.featureBadge}>
                            <Text style={styles.featureText}>{feature}</Text>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',  // Фон картки білий
        borderRadius: 12,         // Закруглені кути картки
        overflow: 'hidden',       // При закруглених кутах ховаємо вихідні елементи
        elevation: 8,             // Глибша тінь для Android
        shadowColor: '#000',      // Тінь для iOS
        shadowOffset: { width: 0, height: 16 },  // Глибокий відступ тіні вниз
        shadowOpacity: 0.2,       // Трохи сильніша тінь для iOS
        shadowRadius: 10,         // Більший розмір тіні для більшого розсіювання
        marginBottom: 16,         // Нижній відступ між картками
        marginHorizontal: 16,     // Бокові відступи для карток
        borderWidth: 1,           // Ширина рамки
        borderColor: '#ddd',      // Колір рамки картки (світло-сірий для м'якого ефекту)
        padding: 16,              // Внутрішні відступи для контенту
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 12,
    },
    details: {
        paddingTop: 16,
        paddingBottom: 16,
        paddingHorizontal: 4,
    },
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        marginBottom: 4,
    },
    name: {
        fontFamily: 'PlusJakartaSans-Regular',
        fontSize: 18,
        fontWeight: '700',
        lineHeight: 23,
        color: '#1C170D',
        textAlign: 'left',
        flex: 1,
    },
    infoText: {
        fontFamily: 'PlusJakartaSans-Regular',
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 24,
        color: '#A1824A',
    },
    distance: {
        fontFamily: 'PlusJakartaSans-Regular',
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 24,
        color: '#A1824A',
        marginLeft: 'auto',
    },
    cuisineTypeText: {
        fontFamily: 'PlusJakartaSans-Regular',
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 24,
        color: '#A1824A',
    },
    featuresContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 4,
    },
    featureBadge: {
        backgroundColor: '#f0f0f0',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 20,
        marginRight: 10,
        marginBottom: 10,
    },
    featureText: {
        fontSize: 14,
        color: '#555',
    },
});

export default RestaurantCard;
