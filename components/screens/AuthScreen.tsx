import React, {useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet, Alert} from 'react-native';
import axios from 'axios';


const AuthScreen = ({ navigation }: any): React.JSX.Element => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'restaurateur' | 'owner'>('restaurateur');

    const toggleAuthMode = () => {
        setIsLogin(prevMode => !prevMode);
    };

    const handleAuth = () => {
        if (isLogin) {
            const user = {
                email,
                password,
            };
            axios.post('http://localhost:8082/login', user)
                .then((response) => {
                    console.log(response.status);
                    // Логіка успішного логіну
                })
                .catch(console.log);
        } else {
            const user = {
                email,
                password,
            };
            axios.post('http://localhost:8082/registration', user)
                .then((response) => {
                    console.log('Registered:', response.status);
                    if (role === 'owner') {
                        // Якщо роль власника ресторану, перенаправляємо на форму додавання ресторану
                        navigation.navigate('AddRestaurant');
                    } else {
                        // Логіка для рестораторів (можна додати свій сценарій)
                        Alert.alert('Registration Successful');
                    }
                })
                .catch(console.log);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{isLogin ? 'Login' : 'Register'}</Text>

            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            {!isLogin && (
                <View style={styles.roleSelection}>
                    <Text style={styles.roleText}>I am:</Text>
                    <Button
                        title="Restaurateur"
                        onPress={() => setRole('restaurateur')}
                        color={role === 'restaurateur' ? 'blue' : 'gray'}
                    />
                    <Button
                        title="Owner of the Best Restaurant"
                        onPress={() => setRole('owner')}
                        color={role === 'owner' ? 'blue' : 'gray'}
                    />
                </View>
            )}

            <Button title={isLogin ? 'Login' : 'Register'} onPress={handleAuth}/>
            <Button
                title={`Switch to ${isLogin ? 'Register' : 'Login'}`}
                onPress={toggleAuthMode}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    roleSelection: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    roleText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 10,
    },
});

export default AuthScreen;
