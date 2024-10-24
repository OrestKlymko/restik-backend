import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {View, Text, StyleSheet, Button} from 'react-native';
import {AddRestaurantDetails} from "./AddRestaurantDetails.tsx";
import BenefitsScreen from "./BenefitsScreen.tsx";
import RestaurantBookingsScreen from "../components/RestaurantBookingsScreen.tsx";




// Drawer Navigator
const Drawer = createDrawerNavigator();

interface RestaurantDrawerNavigatorProps {
    id: number
}

const RestaurantDrawerNavigator = ({id}: RestaurantDrawerNavigatorProps) => {
    return (
        <Drawer.Navigator initialRouteName="Редагування оголошення">
            <Drawer.Screen name="Редагування оголошення" component={AddRestaurantDetails}
                           initialParams={{restaurantId: id}}/>
            <Drawer.Screen name="Пропозиції ресторану" component={BenefitsScreen} initialParams={{restaurantId: id}}/>
            <Drawer.Screen name="Бронювання столиків" component={RestaurantBookingsScreen} initialParams={{restaurantId: id}}/>
        </Drawer.Navigator>
    );
};

export const RestaurantDetailScreen = ({route}) => {
    const {restaurantId} = route.params; // Отримуємо ID ресторану для майбутнього використання

    return (
        <RestaurantDrawerNavigator id={restaurantId}/>
    );
};

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
});
