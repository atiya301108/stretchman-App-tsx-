import React, { useState, useCallback } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Switch,
    Alert,
    Modal,
    TextInput,
} from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNav from './components/BottomNav';

export default function SettingsScreen() {
    const router = useRouter();
    const [name, setName] = useState('Atiya');
    const [level, setLevel] = useState(1);
    const [xp, setXp] = useState(0);

    const [notifications, setNotifications] = useState(true);
    const [streakReminder, setStreakReminder] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [sound, setSound] = useState(true);

    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [tempName, setTempName] = useState('Atiya');

    // โหลดการตั้งค่าและข้อมูลผู้ใช้จาก AsyncStorage
    const loadSettings = async () => {
        try {
            const storedName = await AsyncStorage.getItem('stretchmanName');
            if (storedName) setName(storedName);

            const notif = await AsyncStorage.getItem('stretchmanNotifications');
            if (notif !== null) setNotifications(notif !== 'false');

            const streak = await AsyncStorage.getItem('stretchmanStreakReminder');
            if (streak !== null) setStreakReminder(streak !== 'false');

            const dark = await AsyncStorage.getItem('stretchmanDarkMode');
            if (dark !== null) setDarkMode(dark === 'true');

            const snd = await AsyncStorage.getItem('stretchmanSound');
            if (snd !== null) setSound(snd !== 'false');

            const userData = await AsyncStorage.getItem('stretchmanUserData');
            if (userData) {
                const parsed = JSON.parse(userData);
                setLevel(parsed.level || 1);
                setXp(parsed.xp || 0);
            }
        } catch (error) {
            console.log('Failed to load settings', error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadSettings();
        }, [])
    );

    // ฟังก์ชันอัปเดตสถานะสวิตช์และบันทึกลงหน่วยความจำ
    const handleToggleNotifications = async (val: boolean) => {
        setNotifications(val);
        await AsyncStorage.setItem('stretchmanNotifications', val.toString());
    };

    const handleToggleStreak = async (val: boolean) => {
        setStreakReminder(val);
        await AsyncStorage.setItem('stretchmanStreakReminder', val.toString());
    };

    const handleToggleDarkMode = async (val: boolean) => {
        setDarkMode(val);
        await AsyncStorage.setItem('stretchmanDarkMode', val.toString());
    };

    const handleToggleSound = async (val: boolean) => {
        setSound(val);
        await AsyncStorage.setItem('stretchmanSound', val.toString());
    };

    // บันทึกชื่อผู้ใช้ใหม่
    const handleSaveName = async () => {
        if (tempName.trim()) {
            setName(tempName.trim());
            await AsyncStorage.setItem('stretchmanName', tempName.trim());
            setIsEditModalVisible(false);
        }
    };

    // รีเซ็ตข้อมูลทั้งหมด
    const handleResetData = () => {
        Alert.alert(
            'รีเซ็ตข้อมูลทั้งหมด',
            'ต้องการรีเซ็ตข้อมูลทั้งหมดหรือไม่?\n\nXP, Coins, Streak และประวัติทั้งหมดจะถูกลบ',
            [
                { text: 'ยกเลิก', style: 'cancel' },
                {
                    text: 'รีเซ็ต',
                    style: 'destructive',
                    onPress: async () => {
                        await AsyncStorage.clear();
                        Alert.alert('สำเร็จ', 'รีเซ็ตข้อมูลเรียบร้อยแล้ว');
                        loadSettings();
                    },
                },
            ]
        );
    };

    // ข้อมูลเกี่ยวกับแอป
    const handleAbout = () => {
        Alert.alert(
            'เกี่ยวกับ Stretchman',
            'แอปช่วยแนะนำการยืดกล้ามเนื้อ\nพร้อมระบบ XP, Coins และ Streak\n\nVersion 1.0.0'
        );
    };

    const currentLevelXP = xp % 100;

    return (
        <View style={[styles.container, darkMode && styles.darkContainer]}>
            <ScrollView contentContainerStyle={styles.settingsPage} showsVerticalScrollIndicator={false}>
                
                {/* =========================
                    HEADER
                ========================= */}
                <View style={styles.settingsHeader}>
                    <Text style={[styles.headerTitle, darkMode && styles.darkText]}>Settings</Text>
                    <Text style={styles.headerSubtitle}>ตั้งค่าการใช้งาน Stretchman</Text>
                </View>

                {/* =========================
                    PROFILE
                ========================= */}
                <View style={[styles.settingsProfile, darkMode && styles.darkCard]}>
                    <View style={styles.profileAvatar}>
                        <Text style={{ fontSize: 28 }}>👤</Text>
                    </View>

                    <View style={styles.profileInfo}>
                        <Text style={[styles.profileNameText, darkMode && styles.darkText]}>{name}</Text>
                        <Text style={styles.profileLevelText}>Level {level}</Text>

                        <View style={styles.profileXpContainer}>
                            <View style={styles.xpBar}>
                                <View style={[styles.xpProgress, { width: `${currentLevelXP}%` }]} />
                            </View>
                            <Text style={styles.xpText}>{xp} XP</Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[styles.editProfileBtn, darkMode && styles.darkEditBtn]}
                        onPress={() => {
                            setTempName(name);
                            setIsEditModalVisible(true);
                        }}
                    >
                        <FontAwesome6 name="pen" size={14} color="#43a5ff" />
                    </TouchableOpacity>
                </View>

                {/* =========================
                    ACCOUNT
                ========================= */}
                <View style={styles.settingsSection}>
                    <Text style={[styles.sectionHeading, darkMode && styles.darkText]}>บัญชี</Text>
                    <TouchableOpacity
                        style={[styles.settingItem, darkMode && styles.darkCard]}
                        onPress={() => Alert.alert('โปรไฟล์', `จัดการข้อมูลผู้ใช้งาน: ${name}`)}
                    >
                        <View style={[styles.settingIcon, styles.blueBg]}>
                            <FontAwesome6 name="user" size={18} color="#43a5ff" />
                        </View>
                        <View style={styles.settingContent}>
                            <Text style={[styles.settingTitle, darkMode && styles.darkText]}>โปรไฟล์</Text>
                            <Text style={styles.settingSubtitle}>จัดการข้อมูลผู้ใช้งาน</Text>
                        </View>
                        <FontAwesome6 name="chevron-right" size={13} color="#aaa" />
                    </TouchableOpacity>
                </View>

                {/* =========================
                    NOTIFICATION
                ========================= */}
                <View style={styles.settingsSection}>
                    <Text style={[styles.sectionHeading, darkMode && styles.darkText]}>การแจ้งเตือน</Text>
                    
                    <View style={[styles.settingItem, darkMode && styles.darkCard]}>
                        <View style={[styles.settingIcon, styles.orangeBg]}>
                            <FontAwesome6 name="bell" size={18} color="#ff9800" />
                        </View>
                        <View style={styles.settingContent}>
                            <Text style={[styles.settingTitle, darkMode && styles.darkText]}>การแจ้งเตือน</Text>
                            <Text style={styles.settingSubtitle}>แจ้งเตือนเมื่อถึงเวลายืด</Text>
                        </View>
                        <Switch
                            value={notifications}
                            onValueChange={handleToggleNotifications}
                            trackColor={{ false: '#d7dce2', true: '#43a5ff' }}
                            thumbColor="#ffffff"
                        />
                    </View>

                    <View style={[styles.settingItem, darkMode && styles.darkCard]}>
                        <View style={[styles.settingIcon, styles.redBg]}>
                            <Text style={{ fontSize: 18 }}>🔥</Text>
                        </View>
                        <View style={styles.settingContent}>
                            <Text style={[styles.settingTitle, darkMode && styles.darkText]}>Streak Reminder</Text>
                            <Text style={styles.settingSubtitle}>เตือนเมื่อยังไม่ได้ยืดวันนี้</Text>
                        </View>
                        <Switch
                            value={streakReminder}
                            onValueChange={handleToggleStreak}
                            trackColor={{ false: '#d7dce2', true: '#43a5ff' }}
                            thumbColor="#ffffff"
                        />
                    </View>
                </View>

                {/* =========================
                    APP
                ========================= */}
                <View style={styles.settingsSection}>
                    <Text style={[styles.sectionHeading, darkMode && styles.darkText]}>แอปพลิเคชัน</Text>
                    
                    <View style={[styles.settingItem, darkMode && styles.darkCard]}>
                        <View style={[styles.settingIcon, styles.purpleBg]}>
                            <FontAwesome6 name="moon" size={18} color="#9c27b0" />
                        </View>
                        <View style={styles.settingContent}>
                            <Text style={[styles.settingTitle, darkMode && styles.darkText]}>Dark Mode</Text>
                            <Text style={styles.settingSubtitle}>เปลี่ยนธีมของแอป</Text>
                        </View>
                        <Switch
                            value={darkMode}
                            onValueChange={handleToggleDarkMode}
                            trackColor={{ false: '#d7dce2', true: '#43a5ff' }}
                            thumbColor="#ffffff"
                        />
                    </View>

                    <View style={[styles.settingItem, darkMode && styles.darkCard]}>
                        <View style={[styles.settingIcon, styles.greenBg]}>
                            <FontAwesome6 name="volume-high" size={18} color="#4caf50" />
                        </View>
                        <View style={styles.settingContent}>
                            <Text style={[styles.settingTitle, darkMode && styles.darkText]}>เสียง</Text>
                            <Text style={styles.settingSubtitle}>เสียงภายในแอป</Text>
                        </View>
                        <Switch
                            value={sound}
                            onValueChange={handleToggleSound}
                            trackColor={{ false: '#d7dce2', true: '#43a5ff' }}
                            thumbColor="#ffffff"
                        />
                    </View>
                </View>

                {/* =========================
                    PROGRESS
                ========================= */}
                <View style={styles.settingsSection}>
                    <Text style={[styles.sectionHeading, darkMode && styles.darkText]}>ความคืบหน้า</Text>
                    
                    <TouchableOpacity
                        style={[styles.settingItem, darkMode && styles.darkCard]}
                        onPress={() => router.push('/leaderboard' as any)}
                    >
                        <View style={[styles.settingIcon, styles.goldBg]}>
                            <Text style={{ fontSize: 18 }}>🏆</Text>
                        </View>
                        <View style={styles.settingContent}>
                            <Text style={[styles.settingTitle, darkMode && styles.darkText]}>Leaderboard</Text>
                            <Text style={styles.settingSubtitle}>ดูอันดับของคุณและเพื่อน</Text>
                        </View>
                        <FontAwesome6 name="chevron-right" size={13} color="#aaa" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.settingItem, darkMode && styles.darkCard]}
                        onPress={() => router.push('/streak-history' as any)}
                    >
                        <View style={[styles.settingIcon, styles.redBg]}>
                            <Text style={{ fontSize: 18 }}>🔥</Text>
                        </View>
                        <View style={styles.settingContent}>
                            <Text style={[styles.settingTitle, darkMode && styles.darkText]}>Streak History</Text>
                            <Text style={styles.settingSubtitle}>ดูประวัติการยืดของคุณ</Text>
                        </View>
                        <FontAwesome6 name="chevron-right" size={13} color="#aaa" />
                    </TouchableOpacity>
                </View>

                {/* =========================
                    ABOUT
                ========================= */}
                <View style={styles.settingsSection}>
                    <Text style={[styles.sectionHeading, darkMode && styles.darkText]}>เกี่ยวกับ</Text>
                    <TouchableOpacity
                        style={[styles.settingItem, darkMode && styles.darkCard]}
                        onPress={handleAbout}
                    >
                        <View style={[styles.settingIcon, styles.grayBg]}>
                            <FontAwesome6 name="circle-info" size={18} color="#777" />
                        </View>
                        <View style={styles.settingContent}>
                            <Text style={[styles.settingTitle, darkMode && styles.darkText]}>เกี่ยวกับ Stretchman</Text>
                            <Text style={styles.settingSubtitle}>ข้อมูลเกี่ยวกับแอป</Text>
                        </View>
                        <FontAwesome6 name="chevron-right" size={13} color="#aaa" />
                    </TouchableOpacity>
                </View>

                {/* =========================
                    RESET
                ========================= */}
                <View style={styles.dangerSection}>
                    <TouchableOpacity style={styles.resetButton} onPress={handleResetData}>
                        <FontAwesome6 name="trash" size={14} color="#e74c3c" style={{ marginRight: 7 }} />
                        <Text style={styles.resetButtonText}>รีเซ็ตข้อมูลทั้งหมด</Text>
                    </TouchableOpacity>
                </View>

                {/* =========================
                    VERSION
                ========================= */}
                <View style={styles.appVersion}>
                    <Text style={styles.appVersionText}>Stretchman{'\n'}Version 1.0.0</Text>
                </View>

            </ScrollView>

            {/* EDIT PROFILE MODAL */}
            <Modal visible={isEditModalVisible} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>แก้ไขชื่อผู้ใช้</Text>
                        <TextInput
                            style={styles.modalInput}
                            value={tempName}
                            onChangeText={setTempName}
                            placeholder="ใส่ชื่อของคุณ"
                            placeholderTextColor="#aaa"
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalBtn, styles.cancelBtn]}
                                onPress={() => setIsEditModalVisible(false)}
                            >
                                <Text style={styles.cancelBtnText}>ยกเลิก</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalBtn, styles.saveBtn]}
                                onPress={handleSaveName}
                            >
                                <Text style={styles.saveBtnText}>บันทึก</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* =========================
                BOTTOM NAV
            ========================= */}
            <BottomNav activeTab="setting" />
        </View>
    );
}

// ======================================================
// STYLES
// ======================================================
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    darkContainer: {
        backgroundColor: '#121212',
    },
    settingsPage: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 110,
    },
    settingsHeader: {
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 26,
        fontWeight: '700',
        color: '#1e293b',
    },
    headerSubtitle: {
        fontSize: 13,
        color: '#777777',
        marginTop: 5,
    },
    darkText: {
        color: '#ffffff',
    },
    settingsProfile: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        padding: 18,
        backgroundColor: '#ffffff',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.07,
        shadowRadius: 25,
        elevation: 3,
        marginBottom: 25,
    },
    darkCard: {
        backgroundColor: '#1e1e1e',
    },
    profileAvatar: {
        width: 55,
        height: 55,
        borderRadius: 27.5,
        backgroundColor: '#eaf5ff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileInfo: {
        flex: 1,
    },
    profileNameText: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#1e293b',
    },
    profileLevelText: {
        fontSize: 12,
        color: '#777777',
        marginTop: 2,
    },
    profileXpContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 7,
    },
    xpBar: {
        width: 100,
        height: 6,
        backgroundColor: '#e8edf3',
        borderRadius: 10,
        overflow: 'hidden',
    },
    xpProgress: {
        height: '100%',
        backgroundColor: '#43a5ff',
        borderRadius: 10,
    },
    xpText: {
        fontSize: 10,
        color: '#777777',
    },
    editProfileBtn: {
        width: 38,
        height: 38,
        borderRadius: 12,
        backgroundColor: '#f2f7ff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    darkEditBtn: {
        backgroundColor: '#2a2a2a',
    },
    settingsSection: {
        marginBottom: 24,
    },
    sectionHeading: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: 10,
        marginLeft: 5,
    },
    settingItem: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 13,
        padding: 14,
        marginBottom: 8,
        borderRadius: 16,
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.05,
        shadowRadius: 18,
        elevation: 2,
    },
    settingIcon: {
        width: 42,
        height: 42,
        borderRadius: 13,
        justifyContent: 'center',
        alignItems: 'center',
    },
    blueBg: { backgroundColor: '#e6f3ff' },
    orangeBg: { backgroundColor: '#fff0dc' },
    redBg: { backgroundColor: '#ffe8e8' },
    purpleBg: { backgroundColor: '#eee8ff' },
    greenBg: { backgroundColor: '#e4f8ed' },
    goldBg: { backgroundColor: '#fff4d6' },
    grayBg: { backgroundColor: '#eeeeee' },
    settingContent: {
        flex: 1,
    },
    settingTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#222222',
    },
    settingSubtitle: {
        fontSize: 11,
        color: '#888888',
        marginTop: 3,
    },
    dangerSection: {
        marginTop: 15,
    },
    resetButton: {
        width: '100%',
        padding: 14,
        borderRadius: 15,
        backgroundColor: '#fff0f0',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    resetButtonText: {
        color: '#e74c3c',
        fontSize: 13,
        fontWeight: '600',
    },
    appVersion: {
        alignItems: 'center',
        marginTop: 25,
    },
    appVersionText: {
        textAlign: 'center',
        color: '#aaaaaa',
        fontSize: 11,
        lineHeight: 16,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '85%',
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#1e293b',
    },
    modalInput: {
        width: '100%',
        backgroundColor: '#f2f5fb',
        borderRadius: 12,
        padding: 12,
        fontSize: 14,
        color: '#1e293b',
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 10,
        width: '100%',
    },
    modalBtn: {
        flex: 1,
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
    },
    cancelBtn: {
        backgroundColor: '#edf1f7',
    },
    cancelBtnText: {
        color: '#555555',
        fontWeight: '600',
    },
    saveBtn: {
        backgroundColor: '#43a5ff',
    },
    saveBtnText: {
        color: '#ffffff',
        fontWeight: '600',
    },
});