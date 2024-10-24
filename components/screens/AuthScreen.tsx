import React, {useState, useRef, useEffect} from 'react';
import {View, Text, TextInput, StyleSheet, Animated, TouchableOpacity, Alert, Easing} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const AuthScreen = ({navigation}: any): React.JSX.Element => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'restaurateur' | 'owner'>('restaurateur');
    const [error, setError] = useState(''); // Для зберігання повідомлень про помилки
    const flipAnim = useRef(new Animated.Value(0)).current;

    const rotationY = flipAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'], // Обертання картки на 180 градусів
    });

    const textRotation = flipAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'], // Протилежне обертання тексту
    });

    const toggleAuthMode = () => {
        setError(''); // Очистити помилки перед анімацією
        Animated.timing(flipAnim, {
            toValue: isLogin ? 1 : 0, // Використовуємо стан для перемикання
            duration: 1000, // Тривалість анімації
            easing: Easing.inOut(Easing.ease), // Easing для плавного обертання
            useNativeDriver: true,
        }).start();
    };

    useEffect(() => {
        const listenerId = flipAnim.addListener(({value}) => {
            // Зміна стану на середині (коли value більше 0.5)
            if (value >= 0.5 && isLogin) {
                setIsLogin(false);
            } else if (value < 0.5 && !isLogin) {
                setIsLogin(true);
            }
        });

        return () => {
            flipAnim.removeListener(listenerId);
        };
    }, [flipAnim, isLogin]);

    const handleAuth = () => {
        setError(''); // Очистити помилки перед новою спробою

        if (!email || !password) {
            setError('Всі поля обовязкові.');
            return;
        }

        const user = {email, password, role};
        const login = {email, password}

        if (isLogin) {
            axios.post('http://localhost:8089/login', login)
                .then((response) => {
                    const accessToken = response.data.token;
                    const roleUser = response.data.role;
                    AsyncStorage.setItem('token', accessToken);
                    if (roleUser === 'owner') {
                        navigation.navigate('Мій кабінет');
                    } else if (roleUser === 'restaurateur') {
                        // Якщо роль ресторатор - переходимо до додавання ресторану
                        navigation.navigate('Мої ресторани');
                    }
                })
                .catch((err) => {
                    console.log(err.response);
                    setError('Неправильний логін або пароль.');
                });
        } else {
            axios.post('http://localhost:8089/registration', user)
                .then((response) => {
                    const accessToken = response.data.token;
                    const roleUser = response.data.role;
                    AsyncStorage.setItem('token', accessToken);
                    if (roleUser === 'owner') {
                        navigation.navigate('Мій кабінет');
                    } else if (roleUser === 'restaurateur') {
                        // Якщо роль ресторатор - переходимо до додавання ресторану
                        navigation.navigate('Мої ресторани');
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
            <Animated.View style={[styles.formContainer, {transform: [{rotateY: rotationY}]}]}>
                <Animated.View style={{transform: [{rotateY: textRotation}]}}>
                    <Text style={styles.title}>
                        {isLogin ? 'Логін' : 'Реєстрація'}
                    </Text>

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
                                style={[styles.roleButton, role === 'owner' && styles.activeRoleButton]}
                                onPress={() => setRole('owner')}
                            >
                                <Text style={styles.roleButtonText}>Ресторанний критик</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.roleButton, role === 'restaurateur' && styles.activeRoleButton]}
                                onPress={() => setRole('restaurateur')}
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
                </Animated.View>
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
        shadowOffset: {width: 0, height: 5},
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    innerContainer: {
        backfaceVisibility: 'hidden', // Фіксація тексту щоб не обертався задом наперед
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
