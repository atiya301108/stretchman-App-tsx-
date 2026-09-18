import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ActivityIndicator, 
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { registerApi } from '../services/api';

// ย้าย InputField ออกมาไว้ข้างนอก เพื่อไม่ให้ React สร้างใหม่ทุกครั้งที่พิมพ์
const InputField = ({ label, icon, placeholder, value, onChangeText, secureTextEntry = false, keyboardType = 'default', style = {} }: any) => (
  <View style={[styles.inputGroup, style]}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.inputContainer}>
      <FontAwesome5 name={icon} size={16} color="#9CA3AF" style={styles.inputIcon} />
      <TextInput 
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize="none"
      />
    </View>
  </View>
);

export default function RegisterScreen() {
  const router = useRouter();
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [dob, setDob] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('ไม่ระบุ');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!fullName || !email || !mobile || !weight || !height || !dob || !age || !password || !confirmPassword) {
      Alert.alert('ข้อมูลไม่ครบถ้วน', 'กรุณากรอกข้อมูลให้ครบทุกช่องครับ');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('รหัสผ่านไม่ตรงกัน', 'กรุณากรอกรหัสผ่านทั้งสองช่องให้ตรงกันครับ');
      return;
    }
    if (!agreeTerms) {
      Alert.alert('เงื่อนไขการใช้งาน', 'กรุณากดยอมรับ Terms of Service และ Privacy Policy ก่อนสมัครสมาชิกครับ');
      return;
    }

    setIsLoading(true);
    try {
      // ส่งข้อมูลโปรไฟล์ทั้งหมดเป็นก้อน Object ไปยัง API
      await registerApi({
        fullName,
        email,
        mobile,
        weight,
        height,
        dob,
        age,
        gender,
        password
      });
      
      // เมื่อสมัครสำเร็จและได้ Token แล้ว จะเปลี่ยนหน้าไป HomeScreen อัตโนมัติ
      router.replace('/homescreen');
    } catch (error: any) {
      Alert.alert('สมัครสมาชิกไม่สำเร็จ', error.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <FontAwesome5 name="bolt" size={24} color="#ffffff" style={styles.logoIcon} />
          </View>
          <Text style={styles.title}>StretchMan</Text>
          <Text style={styles.subtitle}>Initialize your high-performance profile.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Create Account</Text>

          <InputField label="Full Name" icon="user" placeholder="Jane Doe" value={fullName} onChangeText={setFullName} />
          <InputField label="Email Address" icon="envelope" placeholder="jane@example.com" value={email} onChangeText={setEmail} keyboardType="email-address" />
          <InputField label="Mobile Number" icon="phone-alt" placeholder="0812345678" value={mobile} onChangeText={setMobile} keyboardType="phone-pad" />

          <View style={styles.row}>
            <InputField label="Weight (kg)" icon="weight" placeholder="60" value={weight} onChangeText={setWeight} keyboardType="numeric" style={styles.halfInput} />
            <InputField label="Height (cm)" icon="ruler-vertical" placeholder="170" value={height} onChangeText={setHeight} keyboardType="numeric" style={styles.halfInput} />
          </View>

          <View style={styles.row}>
            <InputField label="Date of Birth" icon="calendar-alt" placeholder="DD/MM/YYYY" value={dob} onChangeText={setDob} style={styles.halfInput} />
            <InputField label="Age" icon="user-clock" placeholder="20" value={age} onChangeText={setAge} keyboardType="numeric" style={styles.halfInput} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Gender</Text>
            <View style={styles.genderRow}>
              {['ชาย', 'หญิง', 'ไม่ระบุ'].map((item) => (
                <TouchableOpacity 
                  key={item} 
                  style={[styles.genderButton, gender === item && styles.genderButtonActive]}
                  onPress={() => setGender(item)}
                >
                  <Text style={[styles.genderText, gender === item && styles.genderTextActive]}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <InputField label="Password" icon="lock" placeholder="••••••••" value={password} onChangeText={setPassword} secureTextEntry />
          <InputField label="Confirm Password" icon="undo-alt" placeholder="••••••••" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />

          <TouchableOpacity style={styles.checkboxContainer} onPress={() => setAgreeTerms(!agreeTerms)} activeOpacity={0.7}>
            <FontAwesome5 name={agreeTerms ? "check-square" : "square"} size={18} color={agreeTerms ? "#3B82F6" : "#64748B"} />
            <Text style={styles.checkboxText}>
              I agree to the <Text style={styles.linkText}>Terms of Service</Text> and <Text style={styles.linkText}>Privacy Policy</Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.signUpButton} 
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.signUpButtonText}>CREATE ACCOUNT</Text>}
          </TouchableOpacity>

          {/* เพิ่มปุ่ม ข้ามไปหน้า Home (Dev Mode) */}
          <TouchableOpacity 
            style={styles.devBypassButton} 
            onPress={() => router.replace('/homescreen' as any)}
          >
            <Text style={styles.devBypassText}>[Dev Mode] ข้ามไปหน้า Home</Text>
          </TouchableOpacity>

        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/login')}>
            <Text style={styles.loginText}>Sign In</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  logoContainer: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  logoIcon: {
    overflow: 'hidden',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
  },
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 24,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  label: {
    color: '#E2E8F0',
    marginBottom: 8,
    fontSize: 13,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    height: 48,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#1E293B',
    fontSize: 14,
  },
  genderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genderButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#475569',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginHorizontal: 4,
    backgroundColor: 'transparent',
  },
  genderButtonActive: {
    borderColor: '#3B82F6',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  genderText: {
    color: '#94A3B8',
    fontWeight: '600',
    fontSize: 14,
  },
  genderTextActive: {
    color: '#3B82F6',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  checkboxText: {
    color: '#94A3B8',
    fontSize: 12,
    marginLeft: 10,
    flex: 1,
  },
  linkText: {
    color: '#3B82F6',
  },
  signUpButton: {
    backgroundColor: '#3B82F6',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  signUpButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
    letterSpacing: 0.5,
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    color: '#94A3B8',
  },
  loginText: {
    color: '#3B82F6',
    fontWeight: 'bold',
  }
});