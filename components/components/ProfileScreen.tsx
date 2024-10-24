import React, { useState } from 'react';
import {
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    View,
    ScrollView,
    Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';

const ProfileScreen = () => {
    const [name, setName] = useState('John Doe');
    const [phoneNumber, setPhoneNumber] = useState('+380 (XX) XXX-XX-XX');
    const [birthDate, setBirthDate] = useState<Date | null>(new Date('1990-01-01'));
    const [city, setCity] = useState('Київ');
    const [isEditing, setIsEditing] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleEditToggle = () => setIsEditing(!isEditing);

    const handleDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setBirthDate(selectedDate);
        }
    };

    const handleSave = () => {
        setIsEditing(false);
        Alert.alert('Успішно', 'Ваш профіль оновлено');
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Особисті дані</Text>
                <TouchableOpacity onPress={handleEditToggle}>
                    <Icon name={isEditing ? 'check' : 'edit'} size={24} color="#996E4D" />
                </TouchableOpacity>
            </View>

            <Text style={styles.fieldLabel}>Ім'я</Text>
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                editable={isEditing}
            />

            <Text style={styles.fieldLabel}>Номер телефону</Text>
            <TextInput
                style={styles.input}
                value={phoneNumber}
                editable={isEditing}
                keyboardType="phone-pad"
            />

            <Text style={styles.fieldLabel}>Дата народження</Text>
            <TouchableOpacity
                style={styles.input}
                onPress={() => isEditing && setShowDatePicker(true)}
            >
                <Text>{birthDate?.toLocaleDateString() || 'Оберіть дату'}</Text>
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
                value={city}
                onChangeText={setCity}
                editable={isEditing}
            />

            {isEditing && (
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>Зберегти</Text>
                </TouchableOpacity>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#996E4D',
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
    saveButton: {
        backgroundColor: '#996E4D',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 16,
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
    },
});

export default ProfileScreen;
