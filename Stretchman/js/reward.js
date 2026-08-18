/* =========================================
   STRETCHMAN REWARD SYSTEM
   XP + COINS + STREAK
========================================= */


/* =========================================
   DEFAULT DATA
========================================= */

const DEFAULT_XP = 0;
const DEFAULT_COINS = 0;
const DEFAULT_STREAK = 0;


/* =========================================
   GET XP
========================================= */

function getXP() {

    return parseInt(
        localStorage.getItem("xp")
    ) || DEFAULT_XP;

}


/* =========================================
   GET COINS
========================================= */

function getCoins() {

    return parseInt(
        localStorage.getItem("coins")
    ) || DEFAULT_COINS;

}


/* =========================================
   GET STREAK
========================================= */

function getStreak() {

    return parseInt(
        localStorage.getItem("streak")
    ) || DEFAULT_STREAK;

}


/* =========================================
   SET XP
========================================= */

function setXP(value) {

    localStorage.setItem(
        "xp",
        Math.max(0, value)
    );

}


/* =========================================
   SET COINS
========================================= */

function setCoins(value) {

    localStorage.setItem(
        "coins",
        Math.max(0, value)
    );

}


/* =========================================
   SET STREAK
========================================= */

function setStreak(value) {

    localStorage.setItem(
        "streak",
        Math.max(0, value)
    );

}


/* =========================================
   ADD XP
========================================= */

function addXP(amount) {

    const currentXP =
        getXP();

    const newXP =
        currentXP + amount;

    setXP(newXP);

    return newXP;

}


/* =========================================
   ADD COINS
========================================= */

function addCoins(amount) {

    const currentCoins =
        getCoins();

    const newCoins =
        currentCoins + amount;

    setCoins(newCoins);

    return newCoins;

}


/* =========================================
   LEVEL SYSTEM
========================================= */

function getLevel() {

    const xp =
        getXP();

    return Math.floor(
        xp / 100
    ) + 1;

}


/* =========================================
   XP IN CURRENT LEVEL
========================================= */

function getLevelXP() {

    const xp =
        getXP();

    return xp % 100;

}


/* =========================================
   XP REQUIRED FOR NEXT LEVEL
========================================= */

function getXPForNextLevel() {

    return 100;

}


/* =========================================
   GET TODAY
========================================= */

function getToday() {

    const now =
        new Date();

    const year =
        now.getFullYear();

    const month =
        String(
            now.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            now.getDate()
        ).padStart(2, "0");

    return `${year}-${month}-${day}`;

}


/* =========================================
   GET YESTERDAY
========================================= */

function getYesterday() {

    const date =
        new Date();

    date.setDate(
        date.getDate() - 1
    );

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            date.getDate()
        ).padStart(2, "0");

    return `${year}-${month}-${day}`;

}


/* =========================================
   UPDATE STREAK
========================================= */

function updateStreak() {

    const today =
        getToday();

    const yesterday =
        getYesterday();

    const lastDate =
        localStorage.getItem(
            "lastExerciseDate"
        );

    let streak =
        getStreak();


    /* =========================
       FIRST TIME
    ========================= */

    if (!lastDate) {

        streak = 1;

        setStreak(streak);

        localStorage.setItem(
            "lastExerciseDate",
            today
        );

        return streak;

    }


    /* =========================
       ALREADY COMPLETED TODAY
    ========================= */

    if (lastDate === today) {

        return streak;

    }


    /* =========================
       CONTINUE STREAK
    ========================= */

    if (lastDate === yesterday) {

        streak++;

    }


    /* =========================
       MISSED A DAY
    ========================= */

    else {

        streak = 1;

    }


    setStreak(streak);


    localStorage.setItem(
        "lastExerciseDate",
        today
    );


    return streak;

}


/* =========================================
   STREAK BONUS
========================================= */

/*
   ทุกครั้งที่ Streak เพิ่มขึ้น
   จะได้รับ Bonus เพิ่ม

   วันที่ 1 = +0
   วันที่ 2 = +1 Coin
   วันที่ 3 = +1 Coin
   วันที่ 4 = +2 Coins
   ฯลฯ

   จำกัด Bonus สูงสุด +5 Coins
*/

function getStreakBonus(streak) {

    if (streak <= 1) {

        return 0;

    }


    return Math.min(
        5,
        Math.floor(
            streak / 2
        )
    );

}


/* =========================================
   COMPLETE EXERCISE
========================================= */

function completeExercise(
    xpReward = 15,
    coinReward = 5
) {

    /*
       ป้องกันการกดรับรางวัล
       ซ้ำจากท่าเดียวกัน
    */

    const rewardGiven =
        sessionStorage.getItem(
            "rewardGiven"
        );


    if (rewardGiven === "true") {

        return false;

    }


    /* =========================
       BASIC REWARD
    ========================= */

    addXP(
        xpReward
    );

    addCoins(
        coinReward
    );


    /* =========================
       UPDATE STREAK
    ========================= */

    const oldStreak =
        getStreak();

    const newStreak =
        updateStreak();


    /* =========================
       STREAK BONUS
    ========================= */

    let streakBonus = 0;


    /*
       ให้ Bonus เฉพาะวันที่
       Streak เปลี่ยนจริง
    */

    if (
        newStreak !== oldStreak ||
        oldStreak === 0
    ) {

        streakBonus =
            getStreakBonus(
                newStreak
            );

    }


    if (streakBonus > 0) {

        addCoins(
            streakBonus
        );

    }


    /* =========================
       SAVE REWARD INFO
    ========================= */

    sessionStorage.setItem(
        "rewardGiven",
        "true"
    );


    localStorage.setItem(
        "exerciseCompleted",
        "true"
    );


    localStorage.setItem(
        "lastRewardXP",
        xpReward
    );


    localStorage.setItem(
        "lastRewardCoins",
        coinReward
    );


    localStorage.setItem(
        "lastStreakBonus",
        streakBonus
    );


    localStorage.setItem(
        "lastStreak",
        newStreak
    );


    console.log(
        `ได้รับ ${xpReward} XP`
    );


    console.log(
        `ได้รับ ${coinReward} Coins`
    );


    console.log(
        `Streak: ${newStreak} วัน`
    );


    if (streakBonus > 0) {

        console.log(
            `Streak Bonus: +${streakBonus} Coins`
        );

    }


    return true;

}


/* =========================================
   RESET REWARD SESSION
========================================= */

function resetRewardSession() {

    sessionStorage.removeItem(
        "rewardGiven"
    );

}