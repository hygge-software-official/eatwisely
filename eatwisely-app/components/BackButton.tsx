import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRouter } from 'expo-router';

interface IBackButtonProps {
  link?: string;
  onClick?: () => void;
}

const BackButton: React.FC<IBackButtonProps> = ({
  link,
  onClick,
}: IBackButtonProps) => {
  const router = useRouter();
  const navigation = useNavigation();

  const handleNavigate = () => {
    link ? router.replace(link) : navigation.goBack();
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handleNavigate}>
      <LinearGradient
        colors={['#FF8B59', '#FF5267', '#FAFF00']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        locations={[0, 0.5, 1]}
        style={styles.gradient}
      >
        <Ionicons name="arrow-back" size={24} color="white" />
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    borderRadius: 99,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
});

export default BackButton;
