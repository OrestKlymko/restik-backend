import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

// Екрани для трьох можливостей
const EditRestaurantScreen = () => (
    <View style={styles.screenContainer}>
        <Text>Редагування оголошення</Text>
    </View>
);

const OffersScreen = () => (
    <View style={styles.screenContainer}>
        <Text>Пропозиції ресторану</Text>
    </View>
);

const BookingScreen = () => (
    <View style={styles.screenContainer}>
        <Text>Бронювання столиків</Text>
    </View>
);

export const RestaurantDetailScreen = ({ route }: any) => {
    const { restaurantId } = route.params; // Отримуємо ID ресторану
    const [selectedScreen, setSelectedScreen] = useState('edit'); // Стан для вибору екрану

    // Змінна, яка визначає, який екран відображати
    const renderScreen = () => {
        switch (selectedScreen) {
            case 'edit':
                return <EditRestaurantScreen />;
            case 'offers':
                return <OffersScreen />;
            case 'booking':
                return <BookingScreen />;
            default:
                return <EditRestaurantScreen />;
        }
    };

    return (
        <View style={styles.container}>
            {/* Випадаючий список для вибору екрану */}
            <RNPickerSelect
                onValueChange={(value) => setSelectedScreen(value)}
                items={[
                    { label: 'Редагування оголошення', value: 'edit' },
                    { label: 'Пропозиції ресторану', value: 'offers' },
                    { label: 'Бронювання столиків', value: 'booking' },
                ]}
                style={pickerSelectStyles}
                placeholder={{
                    label: 'Оберіть дію...',
                    value: null,
                }}
            />

            {/* Відображення вибраного екрану */}
            <View style={styles.content}>
                {renderScreen()}
            </View>
        </View>
    );
};

// Стилі для екрану
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f9f9f9',
    },
    screenContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
        marginTop: 20,
    },
});

// Стилі для Picker
const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30, // Додаткове місце для іконки
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 0.5,
        borderColor: 'gray',
        borderRadius: 8,
        color: 'black',
        paddingRight: 30, // Додаткове місце для іконки
    },
});
