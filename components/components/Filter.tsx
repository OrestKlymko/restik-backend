import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import axios from "axios";

interface FilterComponentProps {
    onApplyFilters: (filters: { kitchenTypes: number[], restaurantTypes: number[], features: number[] }) => void;
    onClearFilters: () => void;
}

interface KitchenType {
    id: number;
    key: string;
    valueUa: string;
}

interface RestaurantType {
    id: number;
    typeRest: string;
    typeRestUa: string;
}

type FeaturesResponse = {
    id: number,
    key: string,
    valueUa: string,
    valueRu: string
}

const FilterComponent: React.FC<FilterComponentProps> = ({
                                                             onApplyFilters,
                                                             onClearFilters,
                                                         }) => {
    const [kitchenType, setKitchenType] = useState<KitchenType[]>([]);
    const [restaurantTypes, setRestaurantTypes] = useState<RestaurantType[]>([]);
    const [features, setFeatures] = useState<FeaturesResponse[]>([]);

    // Створюємо окремі масиви для вибраних фільтрів
    const [selectedKitchenType, setSelectedKitchenType] = useState<number[]>([]);
    const [selectedRestaurantType, setSelectedRestaurantType] = useState<number[]>([]);
    const [selectedFeatures, setSelectedFeatures] = useState<number[]>([]);

    useEffect(() => {
        axios.get('http://localhost:8089/api/restaurants/kitchen-types').then((response) => {
            setKitchenType(response.data);
        });
        axios.get('http://localhost:8089/api/restaurants/types').then((response) => {
            setRestaurantTypes(response.data);
        });
        axios.get('http://localhost:8089/api/restaurants/features').then((response) => {
            setFeatures(response.data);
        });
    }, []);

    // Функція для перемикання вибраних фільтрів
    const toggleFilter = (id: number, type: string) => {
        if (type === 'kitchen') {
            if (selectedKitchenType.includes(id)) {
                setSelectedKitchenType(selectedKitchenType.filter(item => item !== id));
            } else {
                setSelectedKitchenType([...selectedKitchenType, id]);
            }
        } else if (type === 'restaurant') {
            if (selectedRestaurantType.includes(id)) {
                setSelectedRestaurantType(selectedRestaurantType.filter(item => item !== id));
            } else {
                setSelectedRestaurantType([...selectedRestaurantType, id]);
            }
        } else if (type === 'feature') {
            if (selectedFeatures.includes(id)) {
                setSelectedFeatures(selectedFeatures.filter(item => item !== id));
            } else {
                setSelectedFeatures([...selectedFeatures, id]);
            }
        }
    };

    // Функція для передачі вибраних фільтрів наверх
    const handleApplyFilters = () => {
        onApplyFilters({
            kitchenTypes: selectedKitchenType,
            restaurantTypes: selectedRestaurantType,
            features: selectedFeatures,
        });
    };

    // Очищення фільтрів
    const handleClearFilters = () => {
        setSelectedKitchenType([]);
        setSelectedRestaurantType([]);
        setSelectedFeatures([]);
        onClearFilters();
    };

    return (
        <View style={styles.filterContainer}>
            {/* Фільтри для типу закладу */}
            <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Тип закладу</Text>
                <View style={styles.sectionItems}>
                    {restaurantTypes.map(type => (
                        <TouchableOpacity
                            key={type.id}
                            style={[
                                styles.filterItem,
                                selectedRestaurantType.includes(type.id) && styles.filterItemSelected,
                            ]}
                            onPress={() => toggleFilter(type.id, 'restaurant')}
                        >
                            <Text
                                style={[
                                    styles.filterText,
                                    selectedRestaurantType.includes(type.id) && styles.filterTextSelected,
                                ]}
                            >
                                {type.typeRestUa}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Фільтри для кухні */}
            <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Кухня</Text>
                <View style={styles.sectionItems}>
                    {kitchenType.map(type => (
                        <TouchableOpacity
                            key={type.id}
                            style={[
                                styles.filterItem,
                                selectedKitchenType.includes(type.id) && styles.filterItemSelected,
                            ]}
                            onPress={() => toggleFilter(type.id, 'kitchen')}
                        >
                            <Text
                                style={[
                                    styles.filterText,
                                    selectedKitchenType.includes(type.id) && styles.filterTextSelected,
                                ]}
                            >
                                {type.valueUa}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Фільтри для фіч */}
            <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Фічі</Text>
                <View style={styles.sectionItems}>
                    {features.map(feature => (
                        <TouchableOpacity
                            key={feature.id}
                            style={[
                                styles.filterItem,
                                selectedFeatures.includes(feature.id) && styles.filterItemSelected,
                            ]}
                            onPress={() => toggleFilter(feature.id, 'feature')}
                        >
                            <Text
                                style={[
                                    styles.filterText,
                                    selectedFeatures.includes(feature.id) && styles.filterTextSelected,
                                ]}
                            >
                                {feature.valueUa}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Кнопки для застосування та очищення фільтрів */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.button, styles.applyButton]} onPress={handleApplyFilters}>
                    <Text style={styles.applyButtonText}>Застосувати</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.clearButton]} onPress={handleClearFilters}>
                    <Text style={styles.buttonText}>Очистити</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    filterContainer: {
        padding: 20,
    },
    sectionContainer: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    sectionItems: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    filterItem: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        margin: 5,
    },
    filterItemSelected: {
        backgroundColor: '#000',
    },
    filterText: {
        fontSize: 16,
        color: '#333',
    },
    filterTextSelected: {
        color: '#fff',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 100,
    },
    button: {
        flex: 1,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    applyButton: {
        backgroundColor: '#009963',
    },
    clearButton: {
        backgroundColor: '#F5F0E5',
        color: '#000',
    },
    buttonText: {
        fontSize: 16,
    },
    applyButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default FilterComponent;
