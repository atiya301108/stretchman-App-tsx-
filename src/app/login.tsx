import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ImageBackground, Image, Alert } from 'react-native';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

const API_URL = 'http://localhost:5000/api';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      
      if (response.ok) {
        router.replace('/stretch' as any);
      } else {
        Alert.alert('เข้าสู่ระบบไม่สำเร็จ', data.message || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง');
      }
    } catch (error) {
      Alert.alert('เกิดข้อผิดพลาด', 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
    }
  };

  return (
    <ImageBackground 
      source={require('../../assets/images/background.png')} 
      style={styles.background}
    >
      <View style={styles.container}>
        
        {/* ส่วนโลโก้และชื่อแอป */}
        <View style={styles.logoContainer}>
          <Image source={require('../../assets/images/avatar.png')} style={styles.logoIcon} />
          <Text style={styles.logoText}>Stretchman</Text>
        </View>

        {/* หัวข้อต้อนรับ */}
        <Text style={styles.welcomeText}>Welcome!</Text>
        
        {/* ช่องกรอก Email */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="name@domain.com"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        {/* ช่องกรอก Password */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="**********"
            placeholderTextColor="#999"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {/* ปุ่ม Social Login (Google & Facebook) */}
        <View style={styles.socialContainer}>
          <TouchableOpacity style={styles.socialButton}>
            <FontAwesome name="google" size={20} color="#DB4437" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <FontAwesome name="facebook" size={20} color="#4267B2" />
          </TouchableOpacity>
        </View>

        {/* ปุ่ม Login หลัก */}
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        {/* ลืมรหัสผ่าน */}
        <TouchableOpacity onPress={() => Alert.alert('แจ้งเตือน', 'ไปหน้ากู้คืนรหัสผ่าน')}>
          <Text style={styles.forgotText}>ลืมรหัสผ่าน?</Text>
        </TouchableOpacity>

      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  logoIcon: {
    width: 55,
    height: 55,
    resizeMode: 'contain',
  },
  logoText: {
    fontSize: 14,
    color: '#378AFF',
    fontWeight: 'bold',
    marginTop: 2,
  },
  welcomeText: {
    fontSize: 28,
    color: '#378AFF',
    fontWeight: 'bold',
    marginBottom: 24,
  },
  inputGroup: {
    width: '100%',
    marginBottom: 14,
  },
  label: {
    color: '#378AFF',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
    marginLeft: 6,
  },
  input: {
    width: '100%',
    height: 48,
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: 20,
    fontSize: 14,
    color: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  socialContainer: {
    flexDirection: 'row',
    gap: 16,
    marginVertical: 10,
  },
  socialButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loginButton: {
    width: '100%',
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#fff',
    backgroundColor: 'rgba(55, 138, 255, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  forgotText: {
    color: '#378AFF',
    fontSize: 13,
    fontWeight: '500',
  },
});