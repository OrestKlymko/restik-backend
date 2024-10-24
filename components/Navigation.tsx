import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import AuthScreen from './screens/AuthScreen';
import SearchScreen from './screens/SearchScreen';
import FavoriteScreen from './screens/FavoriteScreen.tsx';
import BenefitsScreen from './screens/BenefitsScreen.tsx';
import {RestaurantStep} from "./screens/RestaurantStep.tsx";
import {AddRestaurantDetails} from "./screens/AddRestaurantDetails.tsx";
import {UserRegistration} from "./screens/UserRegistration.tsx";
import {RestaurantManagementScreen} from "./screens/RestaurantManagementScreen.tsx";
import {RestaurantDetailScreen} from "./screens/RestaurantDetailScreen.tsx"; // Імпорт екрану для додавання ресторану

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Функція для створення табів
const TabNavigator = () => {
    return (
        <Tab.Navigator
            initialRouteName="Search"
            screenOptions={({route}) => ({
                tabBarIcon: ({focused, color, size}) => {
                    let iconName;
                    color = focused ? 'black' : '#996E4D';
                    switch (route.name) {
                        case 'Пошук':
                            iconName = focused ? 'search' : 'search';
                            break;
                        case 'Улюблене':
                            iconName = focused ? 'star-outline' : 'star-outline';
                            break;
                        case 'Вигоди':
                            iconName = focused ? 'bulb-outline' : 'bulb-outline';
                            break;
                        case 'Профіль':
                            iconName = focused ? 'person-outline' : 'person-outline';
                            break;
                        default:
                            iconName = 'accessibility-sharp';
                    }
                    return <Ionicons name={iconName} size={size} color={color}/>;
                },
                tabBarActiveTintColor: 'black',
                tabBarInactiveTintColor: '#996E4D',
                tabBarLabelStyle: {
                    fontFamily: 'PlusJakartaSans-Regular',
                    fontSize: 12,
                    lineHeight: 18,
                    textAlign: 'center',
                },
                tabBarStyle: {
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 60,
                    backgroundColor: 'white',
                },
                headerShown: false,
            })}
        >
            <Tab.Screen name="Пошук" component={SearchScreen}/>
            <Tab.Screen name="Улюблене" component={FavoriteScreen}/>
            <Tab.Screen name="Вигоди" component={BenefitsScreen}/>
            <Tab.Screen name="Профіль" component={AuthScreen}/>
        </Tab.Navigator>
    );
};

// Головна навігація з табами і стековою навігацією
const Navigation = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                {/* Основні таби */}
                <Stack.Screen name="Головна" component={TabNavigator} options={{headerShown: false}}/>
                {/* Екран додавання ресторану (поза табами) */}
                <Stack.Screen name="Реєстрація закладу" component={RestaurantStep} />
                <Stack.Screen name="Деталі закладу" component={AddRestaurantDetails}/>
                <Stack.Screen name="Мій кабінет" component={UserRegistration}/>
                <Stack.Screen name="Мої ресторани" component={RestaurantManagementScreen}/>
                <Stack.Screen name="Керування рестораном" component={RestaurantDetailScreen}/>
                <Stack.Screen name="Пошук" component={SearchScreen} options={{headerShown:false}}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default Navigation;
