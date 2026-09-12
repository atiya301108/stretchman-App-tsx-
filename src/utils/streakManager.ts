import AsyncStorage from '@react-native-async-storage/async-storage';

// ฟังก์ชันหาวันที่ปัจจุบันในรูปแบบ YYYY-MM-DD (ใช้เวลา Local ของเครื่อง)
const getTodayString = () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
};

export const updateStreak = async () => {
    try {
        const today = getTodayString();
        const lastDate = await AsyncStorage.getItem('lastStretchDate');
        const currentStreakStr = await AsyncStorage.getItem('streakCount');
        
        let streak = currentStreakStr ? parseInt(currentStreakStr, 10) : 0;

        if (lastDate === today) {
            // ถ้าวันนี้ทำไปแล้ว ไม่ต้องบวกเพิ่ม
            return streak;
        }

        if (lastDate) {
            const lastDateObj = new Date(lastDate);
            const todayObj = new Date(today);
            
            // คำนวณความห่างของวัน
            const diffTime = Math.abs(todayObj.getTime() - lastDateObj.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                // ทำต่อเนื่องจากเมื่อวาน
                streak += 1;
            } else {
                // ขาดช่วง (ลืมทำ) เริ่มนับ 1 ใหม่
                streak = 1;
            }
        } else {
            // เพิ่งเคยทำครั้งแรก
            streak = 1;
        }

        // เซฟวันที่ทำล่าสุด และจำนวน Streak กลับลงไป
        await AsyncStorage.setItem('lastStretchDate', today);
        await AsyncStorage.setItem('streakCount', streak.toString());

        return streak;
    } catch (error) {
        console.error("เกิดข้อผิดพลาดในการคำนวณ Streak:", error);
        return 0;
    }
};

// ฟังก์ชันสำหรับดึงค่า Streak ปัจจุบันไปแสดงผล
export const getStreak = async () => {
    try {
        const streakStr = await AsyncStorage.getItem('streakCount');
        return streakStr ? parseInt(streakStr, 10) : 0;
    } catch (error) {
        return 0;
    }
};