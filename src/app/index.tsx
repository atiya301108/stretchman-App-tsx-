import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

export default function Index() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await SecureStore.getItemAsync('userToken');
        if (token) {
          router.replace('/HomeScreen');
        } else {
          router.replace('/login');
        }
      } catch (error) {
        router.replace('/login');
      } finally {
        setIsChecking(false);
      }
    };
    checkToken();
  }, []);

  if (isChecking) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0F172A' }}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }
  return null;
}