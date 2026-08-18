/* =========================================
   STRETCHMAN USER DATA
========================================= */

const DEFAULT_USER = {
    xp: 0,
    level: 1,
    coins: 0,

    streak: 0,

    lastExerciseDate: null,

    completedToday: false
};


/* =========================================
   GET USER DATA
========================================= */

function getUserData() {

    const saved =
        localStorage.getItem("stretchmanUser");

    if (!saved) {

        localStorage.setItem(
            "stretchmanUser",
            JSON.stringify(DEFAULT_USER)
        );

        return { ...DEFAULT_USER };
    }

    try {

        return JSON.parse(saved);

    } catch (error) {

        console.error(
            "User data error:",
            error
        );

        return { ...DEFAULT_USER };
    }
}


/* =========================================
   SAVE USER DATA
========================================= */

function saveUserData(user) {

    localStorage.setItem(
        "stretchmanUser",
        JSON.stringify(user)
    );
}


/* =========================================
   ADD XP
========================================= */

function addXP(amount) {

    const user = getUserData();

    user.xp += amount;

    checkLevelUp(user);

    saveUserData(user);

    updateAllUserUI();

    return user;
}


/* =========================================
   LEVEL SYSTEM
========================================= */

function getRequiredXP(level) {

    return 100 + ((level - 1) * 50);
}


function checkLevelUp(user) {

    let requiredXP =
        getRequiredXP(user.level);

    while (user.xp >= requiredXP) {

        user.xp -= requiredXP;

        user.level++;

        requiredXP =
            getRequiredXP(user.level);

        showLevelUp(user.level);
    }
}


/* =========================================
   ADD COINS
========================================= */

function addCoins(amount) {

    const user = getUserData();

    user.coins += amount;

    saveUserData(user);

    updateAllUserUI();
}


/* =========================================
   COMPLETE EXERCISE
========================================= */

function completeExercise(
    xpReward = 15,
    coinReward = 5
) {

    const user = getUserData();

    const today =
        getTodayString();


    /*
        ป้องกันการนับซ้ำ
        ในวันเดียวกัน
    */

    if (
        user.completedToday &&
        user.lastExerciseDate === today
    ) {

        return user;
    }


    user.xp += xpReward;

    user.coins += coinReward;


    updateStreak(user);


    user.completedToday = true;

    user.lastExerciseDate = today;


    checkLevelUp(user);

    saveUserData(user);

    updateAllUserUI();


    return user;
}


/* =========================================
   STREAK
========================================= */

function updateStreak(user) {

    const today =
        getTodayString();


    if (!user.lastExerciseDate) {

        user.streak = 1;

        return;
    }


    const lastDate =
        new Date(
            user.lastExerciseDate
        );


    const currentDate =
        new Date(today);


    const difference =
        Math.floor(
            (
                currentDate -
                lastDate
            ) /
            (1000 * 60 * 60 * 24)
        );


    if (difference === 0) {

        return;
    }


    if (difference === 1) {

        user.streak++;

    } else {

        user.streak = 1;

    }
}


/* =========================================
   DATE
========================================= */

function getTodayString() {

    const date =
        new Date();

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
   RESET DAILY STATUS
========================================= */

function checkDailyStatus() {

    const user =
        getUserData();

    const today =
        getTodayString();


    if (
        user.lastExerciseDate !== today
    ) {

        user.completedToday =
            false;

        saveUserData(user);
    }
}


/* =========================================
   UPDATE UI
========================================= */

function updateAllUserUI() {

    const user =
        getUserData();


    const xpElements =
        document.querySelectorAll(
            "[data-xp]"
        );


    xpElements.forEach(
        element => {

            element.textContent =
                user.xp;

        }
    );


    const coinElements =
        document.querySelectorAll(
            "[data-coins]"
        );


    coinElements.forEach(
        element => {

            element.textContent =
                formatNumber(
                    user.coins
                );

        }
    );


    const streakElements =
        document.querySelectorAll(
            "[data-streak]"
        );


    streakElements.forEach(
        element => {

            element.textContent =
                user.streak;

        }
    );


    const levelElements =
        document.querySelectorAll(
            "[data-level]"
        );


    levelElements.forEach(
        element => {

            element.textContent =
                user.level;

        }
    );


    updateXPBars(user);
}


/* =========================================
   XP BAR
========================================= */

function updateXPBars(user) {

    const required =
        getRequiredXP(user.level);


    const percentage =
        Math.min(
            (user.xp / required) * 100,
            100
        );


    const bars =
        document.querySelectorAll(
            "[data-xp-bar]"
        );


    bars.forEach(
        bar => {

            bar.style.width =
                `${percentage}%`;

        }
    );


    const labels =
        document.querySelectorAll(
            "[data-xp-label]"
        );


    labels.forEach(
        label => {

            label.textContent =
                `${user.xp} / ${required} XP`;

        }
    );
}


/* =========================================
   NUMBER FORMAT
========================================= */

function formatNumber(number) {

    return number.toLocaleString(
        "en-US"
    );
}


/* =========================================
   LEVEL UP MESSAGE
========================================= */

function showLevelUp(level) {

    setTimeout(() => {

        alert(
            `🎉 LEVEL UP!\n\nLevel ${level}`
        );

    }, 100);
}


/* =========================================
   INITIALIZE
========================================= */

checkDailyStatus();

document.addEventListener(
    "DOMContentLoaded",
    () => {

        updateAllUserUI();

    }
);