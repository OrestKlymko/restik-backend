import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";

export const AboutSection = () => {
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
            return `Відкрито до ${closingTime.getHours()}:${closingTime.getMinutes() === 0 ? '00' : closingTime.getMinutes()}`;
        } else {
            return `Закрито, відкриється о ${openingTime.getHours()}:${openingTime.getMinutes() === 0 ? '00' : openingTime.getMinutes()}`;
        }
    };

    const features = ['Wi-Fi', 'Парковка', 'Тераса'];

    return (
        <View style={styles.sectionContainer}>
            {/* Назва секції */}
            <Text style={styles.sectionTitle}>Про заклад</Text>

            {/* Опис */}
            <Text style={styles.description}>
                Тут буде опис ресторану. Він може бути довгим або коротким, залежно від інформації, яку ви хочете надати.
            </Text>

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

            {/* Блок з адресою, годинами роботи та телефоном */}
            <View style={styles.infoContainer}>
                <View style={styles.infoItem}>
                    <View style={styles.iconContainer}>
                        <FontAwesome5Icon name="map-marker" size={24} color="#1C170D" />
                    </View>
                    <Text style={styles.infoText}>вул. Київська, 10</Text>
                </View>

                <View style={styles.infoItem}>
                    <View style={styles.iconContainer}>
                        <FontAwesome5Icon name="clock" size={24} color="#1C170D" />
                    </View>
                    <Text style={[styles.infoText, !isOpen && styles.closedText]}>{getStatusText()}</Text>
                </View>

                <View style={styles.infoItem}>
                    <View style={styles.iconContainer}>
                        <FontAwesome5Icon name="phone" size={24} color="#1C170D" />
                    </View>
                    <Text style={styles.infoText}>+38 (050) 123-45-67</Text>
                </View>
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
        fontFamily: 'Plus Jakarta Sans',
        fontSize: 22,
        fontWeight: '700',
        lineHeight: 28,
        textAlign: 'left',
        color: '#1C170D',
        marginBottom: 8,
    },
    description: {
        fontFamily: 'Plus Jakarta Sans',
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 24,
        textAlign: 'left',
        color: '#1C170D',
        marginBottom: 16,
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
        backgroundColor: 'transparent', // Прозорий фон
    },
    featureText: {
        fontFamily: 'Plus Jakarta Sans',
        fontSize: 16,
        fontWeight: '400',
        color: '#996E4D', // Золотистий колір тексту
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
        backgroundColor: '#F5F0E5', // Фон для іконки
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    infoText: {
        fontFamily: 'Plus Jakarta Sans',
        fontSize: 16,
        fontWeight: '400',
        color: '#1C170D',
    },
    closedText: {
        color: 'red', // Червоний колір для закритого статусу
    },
    reserveButton: {
        width: 358,
        height: 48,
        backgroundColor: '#009963',
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginVertical: 16,
    },
    reserveButtonText: {
        fontFamily: 'Plus Jakarta Sans',
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
    },
});
