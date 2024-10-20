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

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.fieldLabel}>Ім'я</Text>
            <TextInput
                style={styles.input}
                placeholder="Введіть ваше ім'я"
                value={name}
                onChangeText={setName}
            />

            <Text style={styles.fieldLabel}>Номер телефону</Text>
            <TextInput
                style={styles.input}
                placeholder="+380 (XX) XXX-XX-XX"
                value={phoneNumber}
                onChangeText={handlePhoneNumberChange}
                keyboardType="phone-pad"
                maxLength={19}
            />

            <Text style={styles.fieldLabel}>Дата народження</Text>
            <TouchableOpacity
                style={styles.input}
                onPress={() => setShowDatePicker(true)}
            >
                <Text>{birthDate ? birthDate.toLocaleDateString() : 'Оберіть дату'}</Text>
            </TouchableOpacity>

            {showDatePicker && (
                <DateTimePicker
                    value={birthDate || new Date()}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                />
            )}

            <Text style={styles.fieldLabel}>Місто</Text>
            <TextInput
                style={styles.input}
                placeholder="Введіть ваше місто"
                value={city}
                onChangeText={setCity}
            />

            <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                <Text style={styles.registerButtonText}>Зареєструватися</Text>
            </TouchableOpacity>
        </ScrollView>
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
