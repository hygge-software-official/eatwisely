import { useState } from 'react';
import { useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';

const isValidName = (name: string, type: 'first' | 'last') => {
  const nameType = type === 'first' ? 'First name' : 'Last name';
  if (name.length < 1) return `${nameType} is required`;
  if (!/^[a-zA-Z0-9\s]+$/.test(name))
    return `${nameType} must contain only Latin letters`;
  if (!/^[a-zA-Z]/.test(name)) return `${nameType} must start with a letter`;
  return '';
};

export const useEditNameScreen = () => {
  const { user } = useUser();
  const router = useRouter();
  const [newFirstName, setNewFirstName] = useState(user?.firstName || '');
  const [newLastName, setNewLastName] = useState(user?.lastName || '');
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');

  const handleFirstNameChange = (name: string) => {
    setNewFirstName(name);
    const error = isValidName(name.trim(), 'first');
    setFirstNameError(error);
  };

  const handleLastNameChange = (name: string) => {
    setNewLastName(name);
    const error = isValidName(name.trim(), 'last');
    setLastNameError(error);
  };

  const handleNameChange = async () => {
    const firstNameValidationError = isValidName(newFirstName.trim(), 'first');
    const lastNameValidationError = isValidName(newLastName.trim(), 'last');

    setFirstNameError(firstNameValidationError);
    setLastNameError(lastNameValidationError);

    if (firstNameValidationError || lastNameValidationError) return;

    try {
      await user!.update({
        firstName: newFirstName.trim(),
        lastName: newLastName.trim(),
      });
      router.replace('/home/profile');
    } catch (error: any) {
      alert('Error updating name: ' + error.errors[0].message);
    }
  };

  return {
    newFirstName,
    handleFirstNameChange,
    newLastName,
    handleLastNameChange,
    handleNameChange,
    firstNameError,
    lastNameError,
  };
};
