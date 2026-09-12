import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// ดึง URL จาก .env หรือใช้ IP สำรอง (ปรับพอร์ตเป็น 5555 ให้ตรงกับเซิร์ฟเวอร์ Express ของโชค)
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://172.20.10.4:5555/api';

// ------------------------------------------------
// ฟังก์ชันตัวช่วยจัดการ Token (รองรับทั้ง Web และ Mobile)
// ------------------------------------------------
const saveToken = async (token: string) => {
  if (Platform.OS === 'web') {
    localStorage.setItem('userToken', token);
  } else {
    await SecureStore.setItemAsync('userToken', token);
  }
};

const getToken = async () => {
  if (Platform.OS === 'web') {
    return localStorage.getItem('userToken');
  }
  return await SecureStore.getItemAsync('userToken');
};

// ------------------------------------------------
// ระบบ Authentication (เข้าสู่ระบบ / สมัครสมาชิก)
// ------------------------------------------------

export const loginApi = async (email: string, password: string) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'ล็อกอินไม่สำเร็จ');
  
  if (data.token) {
    await saveToken(data.token);
  }
  return data;
};

export const registerApi = async (userData: any) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'สมัครสมาชิกไม่สำเร็จ');
  
  if (data.token) {
    await saveToken(data.token);
  }
  return data;
};

// ------------------------------------------------
// ระบบจัดการภารกิจ (Quest)
// ------------------------------------------------

export const getTasksApi = async () => {
  const token = await getToken();
  
  const response = await fetch(`${API_URL}/tasks`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'ไม่สามารถดึงข้อมูลภารกิจได้');
  return data.tasks;
};

export const createTaskApi = async (title: string, description: string) => {
  const token = await getToken();

  const response = await fetch(`${API_URL}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ title, description }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'สร้างภารกิจไม่สำเร็จ');
  return data.task;
};

export const updateTaskApi = async (taskId: number, completed: boolean, title?: string, description?: string) => {
  const token = await getToken();

  const response = await fetch(`${API_URL}/tasks/${taskId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    // ส่งเฉพาะข้อมูลที่มีการอัปเดตไปที่ Backend
    body: JSON.stringify({ completed, title, description }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'อัปเดตภารกิจไม่สำเร็จ');
  return data.task;
};

export const deleteTaskApi = async (taskId: number) => {
  const token = await getToken();

  const response = await fetch(`${API_URL}/tasks/${taskId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'ลบภารกิจไม่สำเร็จ');
  return data;
};