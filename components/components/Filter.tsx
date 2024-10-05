import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

interface FilterComponentProps {
    availableFilters: string[];
    selectedFilters: string[];
    toggleFilter: (filter: string) => void;
}

const FilterComponent: React.FC<FilterComponentProps> = ({
                                                             availableFilters,
                                                             selectedFilters,
                                                             toggleFilter,
                                                         }) => {
    return (
        <View style={styles.filterContainer}>
            <Text style={styles.filterTitle}>Filter by Features</Text>
            {availableFilters.map(filter => (
                <TouchableOpacity
                    key={filter}
                    style={[
                        styles.filterItem,
                        selectedFilters.includes(filter) && styles.filterItemSelected
                    ]}
                    onPress={() => toggleFilter(filter)}
                >
                    <Text
                        style={[
                            styles.filterText,
                            selectedFilters.includes(filter) && styles.filterTextSelected
                        ]}
                    >
                        {filter}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    filterContainer: {
        padding: 20,
    },
    filterTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    filterItem: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        marginVertical: 5,
    },
    filterItemSelected: {
        backgroundColor: '#3498db',
    },
    filterText: {
        fontSize: 16,
        color: '#333',
    },
    filterTextSelected: {
        color: '#fff',
    },
});

export default FilterComponent;
