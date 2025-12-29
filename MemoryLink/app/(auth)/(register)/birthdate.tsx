import { useState } from 'react';
import { View, Button, Platform, Text, TouchableOpacity, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function BirthDate() {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<{ error?: string }>({});
  const [isDisabled, setIsDisabled] = useState(true);
  const params = useLocalSearchParams();

  const router = useRouter();

  interface DateChangeEvent {
    type: string;
    nativeEvent: any;
  }

  const showDatepicker = () => {
    setShow(true);
  };
  const formattedDate = date
    .toDateString()
    .split(' ')
    .slice(1)
    .join(' ');

  const handleNext = () => {
    if (!errors.error) {
      router.push({
        pathname: '/(auth)/(register)/gender',
        params: { ...params, birthdate: formattedDate }
      })
    } else {
      Alert.alert("Error", errors.error)
    }
  }

  const validateBirthdate = (selectedDate: Date) => {
    const today = new Date();

    // 1. Future Date Check
    if (selectedDate > today) {
      setErrors({ error: "Birthdate cannot be in the future." });
      setIsDisabled(true);
      return;
    }

    // 2. Age Calculation
    let age = today.getFullYear() - selectedDate.getFullYear();
    const monthDiff = today.getMonth() - selectedDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < selectedDate.getDate())) {
      age--;
    }

    if (age < 13) {
      // Standard for COPPA/GDPR-K compliance
      setErrors({ error: "You must be at least 13 years old." });
      setIsDisabled(true);
    } else if (age > 120) {
      setErrors({ error: "Please enter a realistic birth year." });
      setIsDisabled(true);
    } else {
      // Valid Date
      setErrors({});
      setIsDisabled(false);
    }
  };

  const onChange = (event: DateChangeEvent, selectedDate: Date | undefined): void => {
    setShow(false); 
    if (selectedDate) {
      setDate(selectedDate);
      validateBirthdate(selectedDate); 
    }
  };

  return (
    <View className='flex-1 mx-6'>

      <View className='flex-row items-center gap-3  w-full mt-3'>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name='chevron-back-outline' size={24} /></TouchableOpacity>
        <Text className='text-2xl font-semibold'>Create account</Text>
      </View>

      <View className='mt-16'>
        <Text className='text-3xl font-bold'>What's your date of birth?</Text>
      </View>

      <TouchableOpacity onPress={showDatepicker} className='flex-row px-4 py-4 border border-neutral-300 rounded-lg items-center justify-between mt-6'>
        <Text className='text-xl font-bold'>{formattedDate}</Text>
        <TouchableOpacity onPress={showDatepicker} className='p-3 bg-blue-600 rounded-full'><Ionicons name='calendar-outline' size={24} color={'#fff'} /></TouchableOpacity>
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={'date'}
          onChange={onChange}
          maximumDate={new Date()}
        />
      )}

      <View className="min-h-[20px] mt-1">
        {errors.error && (
          <Text className="text-red-600 text-sm">
            {errors.error}
          </Text>
        )}
      </View>

      <View className='mt-1'>
        <TouchableOpacity onPress={handleNext} className={isDisabled ? 'px-6 py-4 h-16 rounded-lg bg-gray-300 items-center' : 'px-6 py-4 rounded-lg bg-blue-600 items-center'} disabled={isDisabled}>
          <Text className='text-white text-xl font-semibold'>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
