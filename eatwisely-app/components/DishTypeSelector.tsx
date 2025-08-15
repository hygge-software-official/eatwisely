import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  ImageSourcePropType,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { useAppContext } from '../providers/AppContext';

const { width: screenWidth } = Dimensions.get('window');

type ItemType = {
  title: string;
  image: ImageSourcePropType;
};

type DishTypeSelectorProps = {
  data: ItemType[];
};

const DishTypeSelector: React.FC<DishTypeSelectorProps> = ({ data }) => {
  const { requestState, setRequestState } = useAppContext();
  const carouselRef = useRef<any>(null);

  const renderItem = ({ item }: { item: ItemType }) => {
    const isSelected = item.title === requestState.type;

    return (
      <TouchableOpacity
        onPress={() => setRequestState({ type: item.title })}
        activeOpacity={0.9}
        style={styles.itemContainer}
      >
        <View
          style={[
            styles.cardContainer,
            isSelected && styles.selectedCardContainer,
          ]}
        >
          <View style={[styles.card, isSelected && styles.selectedCard]}>
            <Image source={item.image} style={styles.image} />
          </View>
          <Text style={[styles.title, isSelected && styles.selectedItem]}>
            {item.title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    if (carouselRef.current && requestState.type) {
      const selectedIndex = data.findIndex(
        (item) => item.title === requestState.type,
      );
      if (selectedIndex >= 0 && selectedIndex < data.length) {
        if (selectedIndex === data.length - 1) {
          carouselRef.current.scrollTo({
            index: selectedIndex - 1.45,
            animated: true,
          });
        } else if (selectedIndex === data.length - 2) {
          carouselRef.current.scrollTo({
            index: selectedIndex - 0.45,
            animated: true,
          });
        } else {
          carouselRef.current.scrollTo({
            index: selectedIndex,
            animated: true,
          });
        }
      }
    }
  }, [requestState.type]);

  return (
    <View style={styles.container}>
      <Carousel<ItemType>
        ref={carouselRef}
        data={data}
        renderItem={renderItem}
        width={screenWidth * 0.4}
        height={screenWidth}
        style={styles.carousel}
        loop={false}
        overscrollEnabled={false}
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: 50,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    minHeight: 260,
    backgroundColor: '#fff',
  },
  carousel: {
    position: 'absolute',
    display: 'flex',
    left: '-50%',
    top: 18,
    minWidth: '100%',
  },
  itemContainer: {
    marginHorizontal: 6,
  },
  cardContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingTop: 8,
    paddingHorizontal: 8,
    paddingBottom: 12,
  },
  card: {
    borderRadius: 12,
    width: '100%',
  },
  selectedCardContainer: {
    backgroundColor: '#F94145',
  },
  selectedCard: {
    backgroundColor: '#F94145',
    shadowColor: '#FAFF00',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 10,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 12,
  },
  title: {
    fontSize: 17,
    lineHeight: 24,
    fontFamily: 'Nunito-SemiBold',
    color: '#0C0C19',
    textAlign: 'center',
    paddingTop: 8,
  },
  selectedItem: {
    color: '#fff',
  },
});

export default DishTypeSelector;
