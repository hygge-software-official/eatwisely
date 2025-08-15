import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SelectedItemsInputProps {
  placeholder?: string;
  selectedItems: string[];
  search: string;
  setSearch: (text: string) => void;
  removeSelectedItem: (item: string) => void;
  addSelectedItem: (item: string) => void;
  allItems: string[];
}

const SelectedItemsInput: React.FC<SelectedItemsInputProps> = ({
  placeholder = '',
  selectedItems,
  search,
  setSearch,
  removeSelectedItem,
  addSelectedItem,
  allItems,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [selectedItems]);

  const handleInputChange = (text: string) => {
    if (text.endsWith(' ')) {
      const trimmedItem = text.trim();
      const matchedItem = allItems.find(
        (item) => item.toLowerCase() === trimmedItem.toLowerCase(),
      );
      if (matchedItem && !selectedItems.includes(matchedItem)) {
        addSelectedItem(matchedItem);
        setSearch('');
      } else {
        setSearch(text);
      }
    } else {
      setSearch(text);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleContainerPress = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <TouchableWithoutFeedback onPress={handleContainerPress}>
      <View style={[styles.container, isFocused && styles.containerFocused]}>
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollViewContent}
        >
          {selectedItems?.map((item) => (
            <View key={item} style={styles.selectedItem}>
              <Text style={styles.selectedItemText}>
                {capitalizeFirstLetter(item)}
              </Text>
              <TouchableOpacity onPress={() => removeSelectedItem(item)}>
                <Ionicons
                  name="close"
                  size={20}
                  color="#B6C0CA"
                  style={styles.closeIcon}
                />
              </TouchableOpacity>
            </View>
          ))}
          <TextInput
            ref={inputRef}
            style={styles.input}
            value={search}
            placeholder={!selectedItems?.length ? placeholder : ''}
            placeholderTextColor={'#B6C0CA'}
            onChangeText={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            blurOnSubmit={false}
            autoFocus
            onLayout={() =>
              scrollViewRef.current?.scrollToEnd({ animated: true })
            }
          />
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    padding: 8,
    marginHorizontal: 16,
    maxHeight: Dimensions.get('window').height * 0.48,
    minHeight: 56,
  },
  containerFocused: {
    maxHeight: Dimensions.get('window').height * 0.22,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  selectedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginRight: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  selectedItemText: {
    fontSize: 17,
    lineHeight: 24,
    fontFamily: 'Nunito-SemiBold',
    color: '#0C0C19',
  },
  closeIcon: {
    marginLeft: 4,
  },
  input: {
    minWidth: 100,
    flex: 1,
    padding: 8,
    fontFamily: 'Nunito-Semibold',
    fontSize: 17,
    lineHeight: 24,
    color: '#0C0C19',
  },
});

export default SelectedItemsInput;
