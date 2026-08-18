/* =========================================
   STRETCHMAN COMPLETE PAGE
========================================= */


/* =========================================
   ELEMENTS
========================================= */

const xpRewardElement =
    document.getElementById(
        "xpReward"
    );


const coinRewardElement =
    document.getElementById(
        "coinReward"
    );


const streakElement =
    document.getElementById(
        "streakValue"
    );


const totalXPElement =
    document.getElementById(
        "totalXP"
    );


const totalCoinsElement =
    document.getElementById(
        "totalCoins"
    );


const levelElement =
    document.getElementById(
        "levelValue"
    );


const exerciseNameElement =
    document.getElementById(
        "exerciseName"
    );


const streakTitleElement =
    document.getElementById(
        "streakTitle"
    );


const streakTextElement =
    document.getElementById(
        "streakText"
    );


/* =========================================
   GET LAST REWARD
========================================= */

const lastXP =
    parseInt(
        localStorage.getItem(
            "lastRewardXP"
        ) || "0"
    );


const lastCoins =
    parseInt(
        localStorage.getItem(
            "lastRewardCoins"
        ) || "0"
    );


const streakBonus =
    parseInt(
        localStorage.getItem(
            "lastStreakBonus"
        ) || "0"
    );


/* =========================================
   GET CURRENT DATA
========================================= */

const currentXP =
    getXP();


const currentCoins =
    getCoins();


const currentStreak =
    getStreak();


const currentLevel =
    getLevel();


/* =========================================
   SHOW REWARD
========================================= */

if (xpRewardElement) {

    xpRewardElement.textContent =
        `+${lastXP}`;

}


if (coinRewardElement) {

    const totalRewardCoins =
        lastCoins +
        streakBonus;


    coinRewardElement.textContent =
        `+${totalRewardCoins}`;

}


if (streakElement) {

    streakElement.textContent =
        currentStreak;

}


/* =========================================
   SHOW TOTAL
========================================= */

if (totalXPElement) {

    totalXPElement.textContent =
        `${currentXP} XP`;

}


if (totalCoinsElement) {

    totalCoinsElement.textContent =
        currentCoins;

}


if (levelElement) {

    levelElement.textContent =
        `Lv.${currentLevel}`;

}


/* =========================================
   EXERCISE NAME
========================================= */

const savedExerciseName =
    localStorage.getItem(
        "exerciseName"
    );


if (
    savedExerciseName &&
    exerciseNameElement
) {

    exerciseNameElement.textContent =
        savedExerciseName;

}


/* =========================================
   STREAK MESSAGE
========================================= */

if (currentStreak === 1) {

    streakTitleElement.textContent =
        "เริ่มต้น Streak แล้ว! 🔥";


    streakTextElement.textContent =
        "กลับมายืดกล้ามเนื้อในวันพรุ่งนี้ เพื่อสร้าง Streak ต่อ";

}


else if (currentStreak < 7) {

    streakTitleElement.textContent =
        `🔥 Streak ${currentStreak} วัน!`;


    streakTextElement.textContent =
        "ทำต่อเนื่องทุกวันเพื่อสร้าง Streak ให้สูงขึ้น";

}


else if (currentStreak < 30) {

    streakTitleElement.textContent =
        `🔥 สุดยอด! Streak ${currentStreak} วัน!`;


    streakTextElement.textContent =
        "คุณกำลังสร้างนิสัยที่ดี รักษาความต่อเนื่องต่อไป!";

}


else {

    streakTitleElement.textContent =
        `🔥 ${currentStreak} วันติดต่อกัน!`;


    streakTextElement.textContent =
        "ยอดเยี่ยมมาก! คุณรักษาความต่อเนื่องได้สุดยอดจริง ๆ";

}


/* =========================================
   HOME BUTTON
========================================= */

const homeBtn =
    document.getElementById(
        "homeBtn"
    );


if (homeBtn) {

    homeBtn.addEventListener(
        "click",
        () => {

            window.location.href =
                "home.html";

        }
    );

}


/* =========================================
   EXERCISE BUTTON
========================================= */

const exerciseBtn =
    document.getElementById(
        "exerciseBtn"
    );


if (exerciseBtn) {

    exerciseBtn.addEventListener(
        "click",
        () => {

            /*
                ปลดล็อกการรับ Reward
                สำหรับการทำท่าใหม่
            */

            resetRewardSession();


            window.location.href =
                "exercise.html";

        }
    );

}