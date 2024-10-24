import React, { useState } from 'react';
import {
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    View,
    Alert,
    ScrollView
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import ProfileScreen from "../components/ProfileScreen.tsx";
import MyBookingsScreen from "../components/MyBookingsScreen.tsx";
import SettingsScreen from "../components/SettingsScreen.tsx";
import Icon from "react-native-vector-icons/MaterialIcons";

export const UserRegistration = () => {
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('+380 ');
    const [birthDate, setBirthDate] = useState<Date | null>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [city, setCity] = useState('');

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

    const handleDateChange = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || birthDate;
        setShowDatePicker(false);
        setBirthDate(currentDate);
    };

    const handleRegister = () => {
        if (!name || !phoneNumber || !birthDate || !city) {
            Alert.alert('Помилка', 'Заповніть усі поля!');
            return;
        }

        const userData = {
            name,
            phoneNumber,
            birthDate: birthDate.toLocaleDateString(),
            city
        };

        console.log('Зареєстровано користувача:', userData);
        Alert.alert('Успішно', 'Реєстрація завершена');
    };
    const Tab = createBottomTabNavigator();

    return (
        <Tab.Navigator
            initialRouteName="Profile"
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName;
                    if (route.name === 'Profile') {
                        iconName = 'person';
                    } else if (route.name === 'MyBookings') {
                        iconName = 'book';
                    } else if (route.name === 'Settings') {
                        iconName = 'settings';
                    }
                    return <Icon name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#996E4D',
                tabBarInactiveTintColor: 'gray',
                headerShown: false,
            })}
        >
            <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Профіль' }} />
            <Tab.Screen name="MyBookings" component={MyBookingsScreen} options={{ title: 'Мої бронювання' }} />
            <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: 'Налаштування' }} />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
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
        marginBottom: 12,
        backgroundColor: '#f9f9f9',
        fontSize: 16,
    },
    registerButton: {
        backgroundColor: '#996E4D',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 16,
    },
    registerButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
    },
});
