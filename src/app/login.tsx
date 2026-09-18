import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import * as Google from 'expo-auth-session/providers/google';
import { FontAwesome5 } from '@expo/vector-icons';
import { loginApi } from '../services/api'; 

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // เพิ่ม State สำหรับเก็บข้อความ Error สีแดง
  const [errorMessage, setErrorMessage] = useState('');

  // ตั้งค่า Google Login
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: '300181200716-ql4asoqlr5c6kr07bevq8qnnbhjqfom1.apps.googleusercontent.com',
    iosClientId: '933536605930-44ahqm2narutrvdfcamej8rbeg09mtv3.apps.googleusercontent.com', 
    // androidClientId: 'ใส่_ANDROID_CLIENT_ID_ของคุณที่นี่', ได้แล้วมาใส่ด้วยนะ
  });

  // รอรับ Token กลับมาจาก Google
  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      console.log('ได้ Token จาก Google แล้ว:', authentication?.accessToken);
      // TODO: ส่ง accessToken นี้ไปให้ Backend ยืนยันในอนาคต
    }
  }, [response]);

  const handleLogin = async () => {
    setErrorMessage(''); // เคลียร์ Error ก่อนกดล็อกอินทุกครั้ง

    // 1. ดักจับการไม่กรอกข้อมูลหรือพิมพ์แค่สเปซบาร์
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Email or Password incorrect'); 
      return;
    }

    setIsLoading(true);
    try {
      await loginApi(email, password);
      router.replace('/homescreen');

    } catch (error: any) {
      const errMsg = error.message.toLowerCase();
      
      // 2. ดักจับกรณีไม่พบผู้ใช้ หรือ รหัสผ่านผิด แล้วแสดงข้อความสีแดงใต้ช่องพิมพ์
      if (errMsg.includes('ไม่พบ') || errMsg.includes('not found') || errMsg.includes('ไม่ถูกต้อง') || errMsg.includes('อีเมลหรือรหัสผ่าน')) {
        setErrorMessage('Email or Password incorrect');
      } else {
        // Error อื่นๆ เช่น เน็ตหลุด ค่อยใช้ Alert
        Alert.alert('เข้าสู่ระบบไม่สำเร็จ', error.message || 'เกิดข้อผิดพลาดบางอย่าง');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <FontAwesome5 name="bolt" size={32} color="#ffffff" style={styles.logoIcon} />
      </View>
      <Text style={styles.title}>StretchMan</Text>
      <Text style={styles.subtitle}>Command your performance.</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput 
          style={[styles.input, errorMessage ? styles.inputError : null]} 
          placeholder="agent@stretchman.com" 
          placeholderTextColor="#6b7280"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setErrorMessage(''); // ลบแจ้งเตือนเมื่อเริ่มพิมพ์ใหม่
          }}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
        <View style={styles.passwordHeader}>
          <Text style={styles.label}>Password</Text>
          <TouchableOpacity>
            <Text style={styles.forgotPassword}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
        <TextInput 
          style={[styles.input, errorMessage ? styles.inputError : null]} 
          placeholder="••••••••" 
          placeholderTextColor="#6b7280"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setErrorMessage(''); // ลบแจ้งเตือนเมื่อเริ่มพิมพ์ใหม่
          }}
          secureTextEntry
        />
        
        {/* ส่วนแสดงข้อความแจ้งเตือนสีแดง */}
        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}
      </View>

      <TouchableOpacity 
        style={styles.signInButton} 
        onPress={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.signInText}>Sign In ➔</Text>
        )}
      </TouchableOpacity>

      {/* เพิ่มปุ่ม ข้ามไปหน้า Home (Dev Mode) */}
      <TouchableOpacity 
        style={styles.devBypassButton} 
        onPress={() => router.replace('/homescreen' as any)}
      >
        <Text style={styles.devBypassText}>[Dev Mode] ข้ามไปหน้า Home</Text>
      </TouchableOpacity>

      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
        <Text style={styles.dividerText}>OR</Text>
        <View style={styles.divider} />
      </View>

      <TouchableOpacity 
        style={styles.googleButton} 
        onPress={() => promptAsync()}
        disabled={!request}
      >
        <FontAwesome5 name="google" size={18} color="#EA4335" />
        <Text style={styles.googleButtonText}>Sign in with Google</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/register')}>
          <Text style={styles.signUpText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    padding: 24,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logoIcon: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 20,
  },
  passwordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  forgotPassword: {
    color: '#3B82F6',
    fontSize: 12,
  },
  label: {
    color: '#cbd5e1',
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    padding: 14,
    color: '#ffffff',
  },
  inputError: {
    borderColor: '#EF4444', 
  },
  errorText: {
    color: '#EF4444', 
    fontSize: 12,
    marginTop: 8,
    fontWeight: '500',
  },
  signInButton: {
    backgroundColor: '#3B82F6',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  signInText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  devBypassButton: {
    backgroundColor: '#475569',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  devBypassText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#334155',
  },
  dividerText: {
    color: '#64748b',
    paddingHorizontal: 12,
    fontSize: 12,
  },
  googleButton: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  googleButtonText: {
    color: '#1e293b',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerText: {
    color: '#94a3b8',
  },
  signUpText: {
    color: '#3B82F6',
    fontWeight: 'bold',
  }
});