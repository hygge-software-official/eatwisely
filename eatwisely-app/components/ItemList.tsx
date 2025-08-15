import React from 'react';
import {
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';

interface ItemListProps {
  data: string[];
  addSelectedItem: (item: string) => void;
  loading?: boolean;
}

const ItemList: React.FC<ItemListProps> = ({
  data,
  addSelectedItem,
  loading = false,
}) => {
  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const renderItem = ({ item, index }: { item: string; index: number }) => (
    <TouchableOpacity onPress={() => addSelectedItem(item)} activeOpacity={0.8}>
      <Text style={styles.itemText}>{capitalizeFirstLetter(item)}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0C0C19" />
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item, index) => `${item}-${index}`}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="always"
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  itemText: {
    paddingVertical: 16,
    fontFamily: 'Nunito-Regular',
    fontSize: 17,
    lineHeight: 24,
    color: '#0C0C19',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ItemList;
