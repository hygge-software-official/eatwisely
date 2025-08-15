import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ISelectItemListProps {
  items: { label: string; flag?: string }[];
  selectedItem: string | null;
  onSelectItem: (label: string) => void;
  loading?: boolean;
}

const SelectItemList: React.FC<ISelectItemListProps> = ({
  items,
  selectedItem,
  onSelectItem,
  loading,
}) => {
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0C0C19" />
      </View>
    );
  }

  return (
    <FlatList
      data={items}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={[
            styles.item,
            selectedItem === item.label && styles.selectedItem,
          ]}
          activeOpacity={0.6}
          onPress={() => onSelectItem(item.label)}
        >
          {item.flag && <Text style={styles.flag}>{item.flag}</Text>}
          <Text style={styles.itemText}>{item.label}</Text>
          {selectedItem === item.label && (
            <Ionicons
              name="checkmark"
              size={24}
              color="black"
              style={styles.checkmarkIcon}
            />
          )}
        </TouchableOpacity>
      )}
      keyExtractor={(item, index) => `${item.label}-${index}`}
    />
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  selectedItem: {
    backgroundColor: '#FFF2C4',
  },
  flag: {
    fontSize: 20,
    marginRight: 12,
  },
  itemText: {
    fontSize: 17,
    lineHeight: 24,
    fontFamily: 'Nunito-SemiBold',
    color: '#0C0C19',
    flex: 1,
  },
  checkmarkIcon: {
    marginLeft: 12,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SelectItemList;
