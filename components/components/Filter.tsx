import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ScrollView} from 'react-native';

interface FilterComponentProps {
    selectedFilters: string[];
    toggleFilter: (filter: string) => void;
    applyFilters: () => void;
    clearFilters: () => void;
}

const FilterComponent: React.FC<FilterComponentProps> = ({
                                                             selectedFilters,
                                                             toggleFilter,
                                                             applyFilters,
                                                             clearFilters,
                                                         }) => {
    const filters: Record<string, string[]> = {
        'Відчинено зараз': ['Відчинено зараз'],
        'Тип закладу': ['Кафе', 'Ресторан', 'Бар', 'Паб', 'Кав\'ярня', 'Фастфуд'],
        'Кухня': ['Азійська', 'Українська', 'Китайська', 'Італійська', 'Мексиканська', 'Французька', 'Індійська'],
        'Спеціально для тебе': [
            'Є кальян',
            'Можна курити',
            'Можна з тваринами',
            'З терасою',
            'Є Wi-Fi',
        ],
        'Атмосфера': [
            'Жива музика',
            'Тихе місце',
            'Лише у цьому місті',
            'Для компанії',
            'Для побачення',
        ],
        // Можете додати інші секції тут
    };

    return (
        <ScrollView style={styles.filterContainer}>
            {Object.keys(filters).map(section => (
                <View key={section} style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>{section}</Text>
                    <View style={styles.sectionItems}>
                        {filters[section].map(filter => (
                            <TouchableOpacity
                                key={filter}
                                style={[
                                    styles.filterItem,
                                    selectedFilters.includes(filter) && styles.filterItemSelected,
                                ]}
                                onPress={() => toggleFilter(filter)}
                            >
                                <Text
                                    style={[
                                        styles.filterText,
                                        selectedFilters.includes(filter) && styles.filterTextSelected,
                                    ]}
                                >
                                    {filter}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            ))}
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.button, styles.applyButton]} onPress={applyFilters}>
                    <Text style={styles.applyButtonText}>Застосувати</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.clearButton]} onPress={clearFilters}>
                    <Text style={styles.buttonText}>Очистити</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
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
