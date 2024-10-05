import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Restaurant } from '../types/types.ts';

interface RestaurantCardProps {
    restaurant: Restaurant;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
    return (
        <View style={styles.card}>
            <Image source={{ uri: restaurant.imageUrl }} style={styles.image} />

            <View style={styles.details}>
                {/* Назва і відстань в одному рядку */}
                <View style={styles.row}>
                    <Text style={styles.name}>{restaurant.name}</Text>
                    <Text style={styles.dotSeparator}>•</Text>
                    <Text style={styles.distance}>
                        {restaurant.distanceFromUser.toFixed(1)} km away
                    </Text>
                </View>

                {/* Рейтинг, кухня, ціна */}
                <View style={styles.row}>
                    <Text style={styles.infoText}>{restaurant.rating} / 5</Text>
                    <Text style={styles.dotSeparator}>•</Text>
                    <Text style={styles.infoText}>{restaurant.cuisineType}</Text>
                    <Text style={styles.dotSeparator}>•</Text>
                    <Text style={styles.infoText}>${restaurant.averagePrice}</Text>
                </View>

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
        backgroundColor: '#fff',
        borderRadius: 12, // Загальний радіус заокруглення
        overflow: 'hidden',
        elevation: 3,
        marginBottom: 16, // Відстань між картками
        marginHorizontal: 16, // Відстань по сторонах
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 12, // Заокруглення для всіх кутів зображення
    },
    details: {
       paddingTop:16,
        paddingBottom: 16,
        paddingHorizontal: 4, // Відстань від країв до тексту
    },
    row: {
        flexDirection: 'row', // Елементи в ряд
        alignItems: 'center',
        marginBottom: 4, // Зменшена відстань між рядками
    },
    name: {
        fontFamily: 'Plus Jakarta Sans',
        fontSize: 18,
        fontWeight: '700',
        lineHeight: 23,
        color: '#1C170D',
        textAlign: 'left',
    },
    infoText: {
        fontFamily: 'Plus Jakarta Sans',
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 24,
        color: '#A1824A',
    },
    distance: {
        fontFamily: 'Plus Jakarta Sans',
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 24,
        color: '#A1824A',
    },
    dotSeparator: {
        color: '#A1824A',
        marginHorizontal: 4, // Відстань між крапкою та текстом
    },
    featuresContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 4, // Зменшена відстань між фічами та іншими елементами
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
