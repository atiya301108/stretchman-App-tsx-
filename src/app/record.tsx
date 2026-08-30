import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import BottomNav from './components/BottomNav';
import CustomHeader from './components/CustomHeader'; // ดึง CustomHeader มาใช้งาน

const painPositions: Record<
    string,
    { top: `${number}%`; left: `${number}%` }
> = {
    'คอ': { top: '17%', left: '50%' },
    'ไหล่ซ้าย': { top: '22%', left: '40%' },
    'ไหล่ขวา': { top: '22%', left: '60%' },
    'หลังส่วนบน': { top: '30%', left: '50%' },
    'หลังส่วนล่าง': { top: '40%', left: '50%' },
    'เอว': { top: '47%', left: '50%' },
    'เข่าซ้าย': { top: '72%', left: '44%' },
    'เข่าขวา': { top: '72%', left: '56%' },
};

const symptoms = [
    { id: 'tight', label: 'ตึง', icon: 'person' },
    { id: 'pain', label: 'ปวด', icon: 'burst' },
    { id: 'numb', label: 'ชา/เจ็บ', icon: 'bolt' },
    { id: 'burn', label: 'แสบร้อน', icon: 'fire' },
];

export default function RecordScreen() {
    const params = useLocalSearchParams();
    const area = typeof params.area === 'string' ? params.area : 'ยังไม่ได้เลือก';

    const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
    const [selectedSymptom, setSelectedSymptom] = useState<string | null>(null);

    const position = painPositions[area] || { top: '50%', left: '50%' };

    const getLevelColor = (level: number) => {
        switch (level) {
            case 1: return '#22c55e';
            case 2: return '#84cc16';
            case 3: return '#eab308';
            case 4: return '#f97316';
            case 5: return '#ef4444';
            default: return '#123B91';
        }
    };

    const handleBack = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.push('/pain' as any);
        }
    };

    const handleSave = () => {
        if (!selectedLevel) {
            Alert.alert('ยังไม่ได้เลือกระดับความปวด', 'กรุณาเลือกระดับความปวดก่อนครับ');
            return;
        }

        if (!selectedSymptom) {
            Alert.alert('ยังไม่ได้เลือกประเภทอาการ', 'กรุณาเลือกประเภทอาการก่อนครับ');
            return;
        }

        router.push({
            pathname: '/exercise',
            params: {
                area: area,
                level: selectedLevel,
                type: selectedSymptom,
            },
        } as any);
    };

    return (
        <View style={styles.container}>
            {/* เรียกใช้ CustomHeader พร้อมปุ่ม Info ทางขวา */}
            <CustomHeader
                title={area}
                subtitle="บันทึกอาการของคุณ"
                onBack={handleBack}
                rightComponent={
                    <TouchableOpacity
                        style={styles.infoButton}
                        onPress={() => {
                            Alert.alert(
                                'บันทึกอาการ',
                                'เลือกระดับความปวดและประเภทอาการ เพื่อให้ Stretchman สามารถแนะนำท่ายืดที่เหมาะสมได้'
                            );
                        }}
                    >
                        <FontAwesome6 name="circle-info" size={18} color="white" />
                    </TouchableOpacity>
                }
            />

            {/* Body Image */}
            <View style={styles.bodySection}>
                <View style={styles.bodyCircle}>
                    <Image
                        source={require('../../assets/images/back.png')}
                        style={styles.bodyImage}
                        resizeMode="contain"
                    />
                    <View
                        style={[
                            styles.painPoint,
                            { top: position.top, left: position.left },
                        ]}
                    />
                </View>
            </View>

            {/* Pain Level */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>ระดับความปวด</Text>
                <View style={styles.painScale}>
                    {[1, 2, 3, 4, 5].map((level, index) => {
                        const levelColor = getLevelColor(level);
                        const isSelected = selectedLevel === level;
                        return (
                            <React.Fragment key={level}>
                                <TouchableOpacity
                                    style={[
                                        styles.painButton,
                                        { backgroundColor: isSelected ? 'white' : levelColor, borderColor: levelColor },
                                        isSelected && styles.painButtonSelected,
                                    ]}
                                    onPress={() => setSelectedLevel(level)}
                                >
                                    <Text
                                        style={[
                                            styles.painNumber,
                                            { color: isSelected ? levelColor : 'white' },
                                            isSelected && styles.painNumberSelected,
                                        ]}
                                    >
                                        {level}
                                    </Text>
                                </TouchableOpacity>
                                {index < 4 && (
                                    <View style={[styles.scaleSegment, { backgroundColor: levelColor }]} />
                                )}
                            </React.Fragment>
                        );
                    })}
                </View>
                <View style={styles.scaleLabels}>
                    <Text style={styles.scaleText}>ปวดน้อย</Text>
                    <Text style={styles.scaleText}>ปวดมาก</Text>
                </View>
            </View>

            {/* Symptom */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>เลือกประเภทอาการ</Text>
                <View style={styles.symptomGrid}>
                    {symptoms.map((symptom) => (
                        <TouchableOpacity
                            key={symptom.id}
                            style={[
                                styles.symptomButton,
                                selectedSymptom === symptom.label && styles.symptomSelected,
                            ]}
                            onPress={() => setSelectedSymptom(symptom.label)}
                        >
                            <FontAwesome6 name={symptom.icon as any} size={18} color="white" />
                            <Text style={styles.symptomText}>{symptom.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Save Button */}
            <TouchableOpacity style={styles.saveButtonWrap} onPress={handleSave}>
                <LinearGradient
                    colors={['#237FFF', '#A8CCFF']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.saveButton}
                >
                    <Text style={styles.saveText}>บันทึกอาการ</Text>
                </LinearGradient>
            </TouchableOpacity>

            <BottomNav activeTab="home" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1638AE',
        paddingHorizontal: 20,
        paddingTop: 10,
        justifyContent: 'space-between',
        paddingBottom: 15,
    },
    infoButton: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bodySection: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 190,
    },
    bodyCircle: {
        width: 185,
        height: 185,
        borderRadius: 100,
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#2146A0',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.5)',
    },
    bodyImage: {
        width: '100%',
        height: '100%',
    },
    painPoint: {
        position: 'absolute',
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: 'rgba(255,55,55,0.35)',
        borderWidth: 3,
        borderColor: '#FF4646',
        marginLeft: -15,
        marginTop: -15,
        shadowColor: '#FF3333',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.9,
        shadowRadius: 10,
        elevation: 8,
    },
    section: {
        marginBottom: 12,
    },
    sectionTitle: {
        color: 'white',
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 9,
    },
    painScale: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 42,
        paddingHorizontal: 8,
    },
    scaleSegment: {
        flex: 1,
        height: 6,
        marginHorizontal: 4,
        borderRadius: 3,
    },
    painButton: {
        width: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    painButtonSelected: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: 'white',
        borderColor: 'white',
    },
    painNumber: {
        fontSize: 11,
        fontWeight: '500',
    },
    painNumberSelected: {
        fontWeight: 'bold',
    },
    scaleLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 3,
        marginTop: 4,
    },
    scaleText: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 10,
    },
    symptomGrid: {
        flexDirection: 'row',
        gap: 8,
    },
    symptomButton: {
        flex: 1,
        height: 70,
        borderRadius: 13,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.18)',
        backgroundColor: 'rgba(10,35,110,0.45)',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 7,
    },
    symptomSelected: {
        backgroundColor: '#2360E8',
        borderColor: '#7CA7FF',
    },
    symptomText: {
        color: 'white',
        fontSize: 10,
    },
    saveButtonWrap: {
        width: '100%',
        marginTop: 3,
        marginBottom: 12,
    },
    saveButton: {
        height: 52,
        borderRadius: 27,
        justifyContent: 'center',
        alignItems: 'center',
    },
    saveText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});