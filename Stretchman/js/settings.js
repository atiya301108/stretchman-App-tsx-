/* =========================================
   ELEMENTS
========================================= */

const notificationToggle =
    document.getElementById(
        "notificationToggle"
    );

const streakToggle =
    document.getElementById(
        "streakToggle"
    );

const darkModeToggle =
    document.getElementById(
        "darkModeToggle"
    );

const soundToggle =
    document.getElementById(
        "soundToggle"
    );

const leaderboardBtn =
    document.getElementById(
        "leaderboardBtn"
    );

const historyBtn =
    document.getElementById(
        "historyBtn"
    );

const resetDataBtn =
    document.getElementById(
        "resetDataBtn"
    );

const aboutBtn =
    document.getElementById(
        "aboutBtn"
    );

const editProfileBtn =
    document.getElementById(
        "editProfileBtn"
    );


/* =========================================
   LOAD SETTINGS
========================================= */

function loadSettings() {

    notificationToggle.checked =
        localStorage.getItem(
            "stretchmanNotifications"
        ) !== "false";


    streakToggle.checked =
        localStorage.getItem(
            "stretchmanStreakReminder"
        ) !== "false";


    darkModeToggle.checked =
        localStorage.getItem(
            "stretchmanDarkMode"
        ) === "true";


    soundToggle.checked =
        localStorage.getItem(
            "stretchmanSound"
        ) !== "false";


    if (
        darkModeToggle.checked
    ) {

        document.body.classList.add(
            "dark-mode"
        );

    }

}


/* =========================================
   NOTIFICATIONS
========================================= */

notificationToggle.addEventListener(
    "change",
    () => {

        localStorage.setItem(
            "stretchmanNotifications",
            notificationToggle.checked
        );

    }
);


/* =========================================
   STREAK REMINDER
========================================= */

streakToggle.addEventListener(
    "change",
    () => {

        localStorage.setItem(
            "stretchmanStreakReminder",
            streakToggle.checked
        );

    }
);


/* =========================================
   DARK MODE
========================================= */

darkModeToggle.addEventListener(
    "change",
    () => {

        const enabled =
            darkModeToggle.checked;


        localStorage.setItem(
            "stretchmanDarkMode",
            enabled
        );


        document.body.classList.toggle(
            "dark-mode",
            enabled
        );

    }
);


/* =========================================
   SOUND
========================================= */

soundToggle.addEventListener(
    "change",
    () => {

        localStorage.setItem(
            "stretchmanSound",
            soundToggle.checked
        );

    }
);


/* =========================================
   LEADERBOARD
========================================= */

leaderboardBtn.addEventListener(
    "click",
    () => {

        window.location.href =
            "leaderboard.html";

    }
);


/* =========================================
   STREAK HISTORY
========================================= */

historyBtn.addEventListener(
    "click",
    () => {

        window.location.href =
            "streak-history.html";

    }
);


/* =========================================
   EDIT PROFILE
========================================= */

editProfileBtn.addEventListener(
    "click",
    () => {

        const currentName =
            localStorage.getItem(
                "stretchmanName"
            ) || "Atiya";


        const newName =
            prompt(
                "ใส่ชื่อของคุณ",
                currentName
            );


        if (
            newName &&
            newName.trim() !== ""
        ) {

            localStorage.setItem(
                "stretchmanName",
                newName.trim()
            );


            loadProfile();

        }

    }
);


/* =========================================
   PROFILE
========================================= */

function loadProfile() {

    const name =
        localStorage.getItem(
            "stretchmanName"
        ) || "Atiya";


    const profileName =
        document.getElementById(
            "profileName"
        );


    if (profileName) {

        profileName.textContent =
            name;

    }


    if (
        typeof getUserData !==
        "undefined"
    ) {

        const user =
            getUserData();


        document
            .querySelectorAll(
                "[data-level]"
            )
            .forEach(
                element => {

                    element.textContent =
                        user.level || 1;

                }
            );


        const xp =
            Number(user.xp || 0);


        const xpText =
            document.getElementById(
                "xpText"
            );


        if (xpText) {

            xpText.textContent =
                `${xp} XP`;

        }


        const xpProgress =
            document.getElementById(
                "xpProgress"
            );


        if (xpProgress) {

            const currentLevelXP =
                xp % 100;


            xpProgress.style.width =
                `${currentLevelXP}%`;

        }

    }

}


/* =========================================
   ABOUT
========================================= */

aboutBtn.addEventListener(
    "click",
    () => {

        alert(
            "Stretchman\n\n" +
            "แอปช่วยแนะนำการยืดกล้ามเนื้อ\n" +
            "พร้อมระบบ XP, Coins และ Streak\n\n" +
            "Version 1.0.0"
        );

    }
);


/* =========================================
   RESET DATA
========================================= */

resetDataBtn.addEventListener(
    "click",
    () => {

        const confirmReset =
            confirm(
                "ต้องการรีเซ็ตข้อมูลทั้งหมดหรือไม่?\n\n" +
                "XP, Coins, Streak และประวัติทั้งหมดจะถูกลบ"
            );


        if (!confirmReset) {
            return;
        }


        localStorage.clear();


        alert(
            "รีเซ็ตข้อมูลเรียบร้อยแล้ว"
        );


        window.location.reload();

    }
);


/* =========================================
   INITIALIZE
========================================= */

loadSettings();

loadProfile();