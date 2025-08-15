import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface IInputWithLabelProps {
  label: string;
  value?: string[];
  placeholder: string;
  onClick?: () => void;
  removeSelectedItem?: (item: string) => void;
}

const MultiselectInputWithLabel: React.FC<IInputWithLabelProps> = ({
  label,
  value,
  placeholder,
  onClick,
  removeSelectedItem,
}: IInputWithLabelProps) => {
  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const hasSelectedItems = Array.isArray(value) && value.length > 0;

  return (
    <TouchableWithoutFeedback onPress={onClick}>
      <View style={[styles.container, styles.multiselectContainer]}>
        <View style={styles.labelWrapper}>
          <Text style={styles.label} numberOfLines={1} ellipsizeMode="tail">
            {label}
          </Text>
          <View
            style={[
              styles.selectedItemsContainer,
              !hasSelectedItems && styles.emptyContainer,
            ]}
          >
            {hasSelectedItems ? (
              value.map((item: string) => (
                <View key={item} style={styles.selectedItem}>
                  <Text style={styles.selectedItemText}>
                    {capitalizeFirstLetter(item)}
                  </Text>
                  {removeSelectedItem && (
                    <TouchableOpacity onPress={() => removeSelectedItem(item)}>
                      <Ionicons
                        name="close"
                        size={20}
                        color="#B6C0CA"
                        style={styles.closeIcon}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              ))
            ) : (
              <Text style={styles.placeholderText}>{placeholder}</Text>
            )}
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: '#F0F4F7',
    borderRadius: 12,
  },
  multiselectContainer: {
    paddingVertical: 10,
  },
  labelWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  label: {
    fontFamily: 'Nunito-Regular',
    fontSize: 17,
    lineHeight: 24,
    color: '#7C8D9D',
    width: 92,
    marginRight: 8,
  },
  placeholderText: {
    fontFamily: 'Nunito-Semibold',
    fontSize: 17,
    lineHeight: 24,
    color: '#B6C0CA',
  },
  selectedItemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  emptyContainer: {
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  selectedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 8,
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
});

export default MultiselectInputWithLabel;
