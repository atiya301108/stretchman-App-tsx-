import React, { useEffect, useRef, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { FontAwesome6 } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import BottomNav from './components/BottomNav';

export default function StretchMotionTracking() {
    const params = useLocalSearchParams();

    // รับชื่อท่าและเวลาจากหน้าก่อนหน้า
    const exerciseName =
        typeof params.name === 'string' ? params.name : 'ท่ายืดกล้ามเนื้อ';

    const exerciseTime =
        typeof params.time === 'string' ? parseInt(params.time, 10) || 5 : 5;

    // Camera Permission & State
    const [permission, requestPermission] = useCameraPermissions();
    const [cameraType, setCameraType] = useState<CameraType>('front');
    const [cameraRunning, setCameraRunning] = useState(false);

    // Timer State
    const [remainingSeconds, setRemainingSeconds] = useState(exerciseTime);
    const [timerRunning, setTimerRunning] = useState(false);

    // Tracking Message State
    const [trackingMessage, setTrackingMessage] = useState('กำลังเตรียมเปิดกล้อง...');

    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // ==========================================
    // Auto-Start Camera when permission granted
    // ==========================================
    useEffect(() => {
        if (permission?.granted && !cameraRunning) {
            handleStartCamera();
        }
    }, [permission?.granted]);

    // ==========================================
    // Timer Effect (นับถอยหลัง & เปลี่ยนหน้าอัตโนมัติเมื่อหมดเวลา)
    // ==========================================
    useEffect(() => {
        if (!timerRunning) return;

        timerRef.current = setInterval(() => {
            setRemainingSeconds((prev) => {
                if (prev <= 1) {
                    if (timerRef.current) {
                        clearInterval(timerRef.current);
                        timerRef.current = null;
                    }
                    setTimerRunning(false);
                    setCameraRunning(false);

                    // 🚀 เปลี่ยนหน้าไปหน้า Complete อัตโนมัติเมื่อเวลาหมด
                    router.replace('/complete' as any);

                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [timerRunning]);

    // ==========================================
    // Camera Controls
    // ==========================================
    const handleStartCamera = async () => {
        if (!permission?.granted) {
            const result = await requestPermission();
            if (!result.granted) {
                Alert.alert(
                    'ไม่สามารถใช้กล้องได้',
                    'กรุณาอนุญาตให้ Stretchman ใช้กล้องในการตรวจท่าทาง'
                );
                return;
            }
        }

        setCameraRunning(true);
        setTrackingMessage('กำลังค้นหาตำแหน่งร่างกาย...');

        // จำลองการตรวจจับเจอแล้วเริ่มจับเวลา
        setTimeout(() => {
            setTrackingMessage('✓ กำลังยืดกล้ามเนื้อ...');
            setTimerRunning(true);
        }, 1200);
    };

    const handleStopCamera = () => {
        setCameraRunning(false);
        setTimerRunning(false);
        setTrackingMessage('กดเปิดกล้องเพื่อเริ่ม');

        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    };

    const handleToggleCamera = () => {
        if (cameraRunning) {
            handleStopCamera();
        } else {
            handleStartCamera();
        }
    };

    const handleReset = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
        setTimerRunning(false);
        setRemainingSeconds(exerciseTime);
        setTrackingMessage('พร้อมเริ่ม');
    };

    const handleFlipCamera = () => {
        setCameraType((current) => (current === 'front' ? 'back' : 'front'));
    };

    const handleSkip = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
        setTimerRunning(false);
        setCameraRunning(false);
        router.back();
    };

    const handleBack = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
        setTimerRunning(false);
        setCameraRunning(false);
        router.replace('/exercise' as any);
    };

    // ==========================================
    // Permission Loading / Not Granted Views
    // ==========================================
    if (!permission) {
        return (
            <View style={styles.permissionContainer}>
                <ActivityIndicator size="large" color="white" />
                <Text style={styles.permissionText}>กำลังตรวจสอบสิทธิ์กล้อง...</Text>
            </View>
        );
    }

    if (!permission.granted) {
        return (
            <View style={styles.permissionContainer}>
                <View style={styles.permissionIcon}>
                    <FontAwesome6 name="camera" size={36} color="white" />
                </View>
                <Text style={styles.permissionTitle}>ต้องการใช้กล้อง</Text>
                <Text style={styles.permissionDescription}>
                    Stretchman ต้องใช้กล้องเพื่อช่วยตรวจสอบท่าทางขณะยืดกล้ามเนื้อ
                </Text>
                <TouchableOpacity
                    style={styles.permissionButton}
                    onPress={requestPermission}
                >
                    <Text style={styles.permissionButtonText}>อนุญาตให้ใช้กล้อง</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.permissionBackButton}
                    onPress={handleBack}
                >
                    <Text style={styles.permissionBackText}>กลับ</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // ==========================================
    // Main Screen
    // ==========================================
    return (
        <View style={styles.container}>
            {/* CAMERA AREA */}
            <View style={styles.cameraArea}>
                {cameraRunning ? (
                    <CameraView
                        style={StyleSheet.absoluteFill}
                        facing={cameraType}
                    />
                ) : (
                    <View style={styles.cameraPlaceholder}>
                        <FontAwesome6
                            name="camera"
                            size={45}
                            color="rgba(255,255,255,0.7)"
                        />
                        <Text style={styles.cameraPlaceholderText}>กำลังเปิดกล้อง...</Text>
                    </View>
                )}

                {/* TOP BAR */}
                <View style={styles.topBar}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={handleBack}
                    >
                        <FontAwesome6 name="arrow-left" size={18} color="#2148C0" />
                    </TouchableOpacity>

                    <View style={styles.titleArea}>
                        <Text
                            style={styles.exerciseTitle}
                            numberOfLines={1}
                        >
                            {exerciseName}
                        </Text>
                        <Text style={styles.exerciseSubtitle}>Motion Tracking</Text>
                    </View>

                    <View
                        style={[
                            styles.aiStatus,
                            cameraRunning && styles.aiStatusReady,
                        ]}
                    >
                        <View
                            style={[
                                styles.statusDot,
                                cameraRunning && styles.statusDotReady,
                            ]}
                        />
                        <Text style={styles.aiText}>AI</Text>
                    </View>
                </View>

                {/* SKELETON AREA */}
                <View style={styles.trackingArea}>
                    {cameraRunning && (
                        <View style={styles.skeletonCircle}>
                            <FontAwesome6
                                name="person"
                                size={110}
                                color="rgba(255,255,255,0.18)"
                            />
                            <View style={[styles.joint, styles.jointHead]} />
                            <View style={[styles.joint, styles.jointLeftShoulder]} />
                            <View style={[styles.joint, styles.jointRightShoulder]} />
                            <View style={[styles.joint, styles.jointLeftHip]} />
                            <View style={[styles.joint, styles.jointRightHip]} />
                        </View>
                    )}
                </View>

                {/* TRACKING MESSAGE */}
                <View style={styles.trackingMessage}>
                    <FontAwesome6
                        name={cameraRunning ? 'person' : 'circle-info'}
                        size={15}
                        color="white"
                    />
                    <Text style={styles.trackingMessageText}>{trackingMessage}</Text>
                </View>

                {/* TIMER */}
                <View style={styles.timerBox}>
                    <Text style={styles.timerNumber}>{remainingSeconds}</Text>
                    <Text style={styles.timerUnit}>วินาที</Text>
                </View>
            </View>

            {/* CONTROLS */}
            <View style={styles.controls}>
                <TouchableOpacity
                    style={styles.controlButton}
                    onPress={handleReset}
                >
                    <FontAwesome6 name="rotate-left" size={19} color="white" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.startButton}
                    onPress={handleToggleCamera}
                >
                    <FontAwesome6
                        name={cameraRunning ? 'pause' : 'camera'}
                        size={18}
                        color="white"
                    />
                    <Text style={styles.startButtonText}>
                        {cameraRunning ? 'หยุด' : 'เปิดกล้อง'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.controlButton}
                    onPress={handleFlipCamera}
                >
                    <FontAwesome6 name="camera-rotate" size={19} color="white" />
                </TouchableOpacity>
            </View>

            {/* SKIP BUTTON (ปรับให้ใหญ่และเด่นชัดขึ้นแทนที่ปุ่มเดิม) */}
            <TouchableOpacity
                style={styles.skipButton}
                onPress={handleSkip}
            >
                <Text style={styles.skipText}>ข้ามท่านี้</Text>
                <FontAwesome6 name="forward" size={14} color="white" />
            </TouchableOpacity>

            {/* BOTTOM NAV */}
            <BottomNav activeTab="home" />
        </View>
    );
}

// ======================================================
// STYLES
// ======================================================
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1638AE',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 15,
    },
    permissionContainer: {
        flex: 1,
        backgroundColor: '#1638AE',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
    },
    permissionIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255,255,255,0.12)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    permissionTitle: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    permissionDescription: {
        color: 'rgba(255,255,255,0.75)',
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 25,
    },
    permissionText: {
        color: 'white',
        marginTop: 15,
        fontSize: 15,
    },
    permissionButton: {
        width: '100%',
        height: 52,
        borderRadius: 26,
        backgroundColor: '#237FFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    permissionButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    permissionBackButton: {
        marginTop: 15,
        padding: 10,
    },
    permissionBackText: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 14,
    },
    cameraArea: {
        flex: 1,
        borderRadius: 25,
        overflow: 'hidden',
        backgroundColor: '#0B237A',
        position: 'relative',
        marginBottom: 12,
    },
    cameraPlaceholder: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0B237A',
    },
    cameraPlaceholderText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 15,
    },
    topBar: {
        position: 'absolute',
        top: 15,
        left: 15,
        right: 15,
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 10,
        elevation: 10,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleArea: {
        flex: 1,
        marginLeft: 12,
    },
    exerciseTitle: {
        color: 'white',
        fontSize: 17,
        fontWeight: 'bold',
    },
    exerciseSubtitle: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 12,
        marginTop: 2,
    },
    aiStatus: {
        height: 32,
        paddingHorizontal: 11,
        borderRadius: 16,
        backgroundColor: 'rgba(0,0,0,0.35)',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    aiStatusReady: {
        backgroundColor: 'rgba(35,127,255,0.8)',
    },
    statusDot: {
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: '#999',
    },
    statusDotReady: {
        backgroundColor: '#4ade80',
    },
    aiText: {
        color: 'white',
        fontSize: 11,
        fontWeight: 'bold',
    },
    trackingArea: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    skeletonCircle: {
        width: 220,
        height: 220,
        borderRadius: 110,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.35)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    joint: {
        position: 'absolute',
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#43a5ff',
        borderWidth: 2,
        borderColor: 'white',
    },
    jointHead: { top: 45, left: 104 },
    jointLeftShoulder: { top: 80, left: 60 },
    jointRightShoulder: { top: 80, right: 60 },
    jointLeftHip: { bottom: 55, left: 75 },
    jointRightHip: { bottom: 55, right: 75 },
    trackingMessage: {
        position: 'absolute',
        bottom: 75,
        left: 20,
        right: 20,
        minHeight: 42,
        borderRadius: 21,
        backgroundColor: 'rgba(0,0,0,0.55)',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingHorizontal: 15,
    },
    trackingMessageText: {
        color: 'white',
        fontSize: 13,
        fontWeight: '500',
    },
    timerBox: {
        position: 'absolute',
        bottom: 15,
        alignSelf: 'center',
        width: 90,
        height: 65,
        borderRadius: 18,
        backgroundColor: 'rgba(0,0,0,0.55)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    timerNumber: {
        color: 'white',
        fontSize: 27,
        fontWeight: 'bold',
        lineHeight: 30,
    },
    timerUnit: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 10,
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 15,
        marginBottom: 10,
    },
    controlButton: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: 'rgba(255,255,255,0.14)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
    },
    startButton: {
        height: 52,
        minWidth: 145,
        borderRadius: 26,
        backgroundColor: '#237FFF',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 9,
    },
    startButtonText: {
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold',
    },
    skipButton: {
        width: '100%',
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255,255,255,0.15)',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        marginBottom: 5,
    },
    skipText: {
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold',
    },
});