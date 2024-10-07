import React, { useState, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, Animated, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';

const AuthScreen = ({ navigation }: any): React.JSX.Element => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'restaurateur' | 'owner'>('restaurateur');
    const [error, setError] = useState(''); // Для зберігання повідомлень про помилки

    const flipAnim = useRef(new Animated.Value(0)).current;
    const rotationLogin = flipAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });
    const rotationRegister = flipAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['180deg', '360deg'],
    });

    const toggleAuthMode = () => {
        setError(''); // Очистити помилки при зміні форми
        Animated.timing(flipAnim, {
            toValue: isLogin ? 1 : 0,
            duration: 500,
            useNativeDriver: true,
        }).start(() => setIsLogin(prevMode => !prevMode));
    };

    const handleAuth = () => {
        setError(''); // Очистити помилки перед новою спробою

        if (!email || !password) {
            setError('Всі поля обов\'язкові.');
            return;
        }

        const user = { email, password };

        if (isLogin) {
            axios.post('http://localhost:8082/login', user)
                .then((response) => {
                    console.log(response.status);
                    // Логіка успішного логіну
                })
                .catch((err) => {
                    console.log(err.response);
                    setError('Неправильний логін або пароль.');
                });
        } else {
            axios.post('http://localhost:8082/registration', user)
                .then((response) => {
                    console.log('Registered:', response.status);
                    if (role === 'owner') {
                        navigation.navigate('AddRestaurant');
                    } else {
                        Alert.alert('Успішна реєстрація');
                    }
                })
                .catch((err) => {
                    console.log(err.response);
                    setError('Помилка реєстрації. Спробуйте ще раз.');
                });
        }
    };

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.formContainer, { transform: [{ rotateY: isLogin ? rotationLogin : rotationRegister }] }]}>
                <View style={styles.innerContainer}>
                    <Text style={styles.title}>{isLogin ? 'Логін' : 'Реєстрація'}</Text>

                    {error !== '' && <Text style={styles.errorText}>{error}</Text>}

                    <TextInput
                        style={styles.input}
                        placeholder="ivan@mail.com"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        placeholderTextColor="#999"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="********"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        placeholderTextColor="#999"
                    />

                    {!isLogin && (
                        <View style={styles.roleSelection}>
                            <TouchableOpacity
                                style={[styles.roleButton, role === 'restaurateur' && styles.activeRoleButton]}
                                onPress={() => setRole('restaurateur')}
                            >
                                <Text style={styles.roleButtonText}>Ресторанний критик</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.roleButton, role === 'owner' && styles.activeRoleButton]}
                                onPress={() => setRole('owner')}
                            >
                                <Text style={styles.roleButtonText}>Ресторатор</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    <TouchableOpacity style={styles.submitButton} onPress={handleAuth}>
                        <Text style={styles.submitButtonText}>{isLogin ? 'Увійти' : 'Реєстрація'}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.switchButton} onPress={toggleAuthMode}>
                        <Text style={styles.switchButtonText}>
                            {isLogin ? 'Реєстрація' : 'Логін'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#A1824A',
    },
    formContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    innerContainer: {
        transform: [{ rotateY: '0deg' }],
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#A1824A',
    },
    input: {
        borderWidth: 1,
        borderColor: '#A1824A',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
        color: '#1C170D',
    },
    roleSelection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    roleText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 10,
        color: '#fff',
    },
    roleButton: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#A1824A',
        borderRadius: 5,
        backgroundColor: 'transparent',
    },
    activeRoleButton: {
        backgroundColor: '#A1824A',
    },
    roleButtonText: {
        color: '#1C170D',
        fontWeight: '600',
    },
    submitButton: {
        backgroundColor: 'black',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
    switchButton: {
        marginTop: 20,
        alignItems: 'center',
    },
    switchButtonText: {
        color: '#A1824A',
        fontWeight: '500',
    },
    errorText: {
        color: '#ff0000',
        textAlign: 'center',
        marginBottom: 10,
        fontSize: 14,
    },
});

export default AuthScreen;
