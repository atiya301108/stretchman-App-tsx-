/* =========================================
   STRETCHMAN MULTI USER LEADERBOARD
========================================= */


/* =========================================
   DEFAULT USERS
========================================= */

const defaultLeaderboardUsers = [

    {
        id: "user-atiya",
        name: "Atiya",
        avatar: "👩🏻",
        xp: 0,
        streak: 0
    },

    {
        id: "user-palao",
        name: "Mr.Palao",
        avatar: "👨🏻",
        xp: 540,
        streak: 12
    },

    {
        id: "user-mupup",
        name: "Mupup",
        avatar: "👨🏽",
        xp: 420,
        streak: 8
    },

    {
        id: "user-tonnam",
        name: "Tonnam",
        avatar: "👨",
        xp: 390,
        streak: 7
    },

    {
        id: "user-fai",
        name: "Fai",
        avatar: "👩",
        xp: 350,
        streak: 6
    },

    {
        id: "user-beam",
        name: "Beam",
        avatar: "👨",
        xp: 310,
        streak: 5
    },

    {
        id: "user-mint",
        name: "Mint",
        avatar: "👩🏻",
        xp: 280,
        streak: 4
    },

    {
        id: "user-nam",
        name: "Nam",
        avatar: "👩",
        xp: 250,
        streak: 3
    },

    {
        id: "user-bank",
        name: "Bank",
        avatar: "👨🏻",
        xp: 220,
        streak: 2
    }

];


/* =========================================
   LOAD USERS
========================================= */

function getLeaderboardUsers() {

    const saved =
        localStorage.getItem(
            "stretchmanLeaderboardUsers"
        );


    if (saved) {

        try {

            return JSON.parse(saved);

        } catch (error) {

            console.error(
                "Leaderboard data error:",
                error
            );

        }

    }


    /*
        ถ้ายังไม่มีข้อมูล
        สร้างผู้ใช้เริ่มต้น
    */

    const users =
        [...defaultLeaderboardUsers];


    saveLeaderboardUsers(users);


    return users;

}


/* =========================================
   SAVE USERS
========================================= */

function saveLeaderboardUsers(users) {

    localStorage.setItem(
        "stretchmanLeaderboardUsers",
        JSON.stringify(users)
    );

}


/* =========================================
   GET CURRENT USER
========================================= */

function getCurrentLeaderboardUser() {

    /*
        ใช้ข้อมูลจากระบบหลัก
    */

    if (
        typeof getUserData === "function"
    ) {

        const user =
            getUserData();


        if (user) {

            return {

                id:
                    "user-atiya",

                name:
                    user.name ||
                    "Atiya",

                avatar:
                    user.avatar ||
                    "👩🏻",

                xp:
                    Number(user.xp) || 0,

                streak:
                    Number(user.streak) || 0

            };

        }

    }


    /*
        fallback
    */

    return {

        id: "user-atiya",

        name: "Atiya",

        avatar: "👩🏻",

        xp: 0,

        streak: 0

    };

}


/* =========================================
   SYNC CURRENT USER
========================================= */

function syncCurrentUser() {

    const users =
        getLeaderboardUsers();


    const currentUser =
        getCurrentLeaderboardUser();


    const index =
        users.findIndex(
            user =>
                user.id === currentUser.id
        );


    if (index === -1) {

        users.push(
            currentUser
        );

    } else {

        users[index] = {

            ...users[index],

            name:
                currentUser.name,

            avatar:
                currentUser.avatar,

            xp:
                currentUser.xp,

            streak:
                currentUser.streak

        };

    }


    saveLeaderboardUsers(users);


    return users;

}


/* =========================================
   SORT
========================================= */

function sortLeaderboard(users) {

    return [...users].sort(
        (a, b) => {

            /*
                XP มากกว่า = อันดับสูงกว่า
            */

            if (
                b.xp !== a.xp
            ) {

                return b.xp - a.xp;

            }


            /*
                ถ้า XP เท่ากัน
                ให้ดู Streak
            */

            return (
                b.streak -
                a.streak
            );

        }
    );

}


/* =========================================
   UPDATE TOP USER
========================================= */

function updateTopUser(sortedUsers) {

    const currentUser =
        getCurrentLeaderboardUser();


    const topXP =
        document.getElementById(
            "topXP"
        );


    if (!topXP) {
        return;
    }


    /*
        ใช้คนอันดับ 1
    */

    const firstUser =
        sortedUsers[0];


    if (!firstUser) {
        return;
    }


    topXP.textContent =
        `${firstUser.xp} XP`;


    /*
        ถ้า HTML มีชื่อ Top 1
        ให้เปลี่ยนด้วย
    */

    const firstPlayer =
        document.querySelector(
            ".podium-player.first strong"
        );


    if (firstPlayer) {

        firstPlayer.textContent =
            firstUser.name;

    }

}


/* =========================================
   RENDER PODIUM
========================================= */

function renderPodium(sortedUsers) {

    const podium =
        document.getElementById(
            "podium"
        );


    if (!podium) {
        return;
    }


    podium.innerHTML = "";


    const topThree =
        sortedUsers.slice(
            0,
            3
        );


    /*
        เราต้องการแสดง
        2 - 1 - 3
    */

    const order = [
        1,
        0,
        2
    ];


    order.forEach(
        index => {

            const user =
                topThree[index];


            if (!user) {
                return;
            }


            const player =
                document.createElement(
                    "div"
                );


            let positionClass =
                "third";


            if (index === 0) {

                positionClass =
                    "second";

            }

            if (index === 1) {

                positionClass =
                    "first";

            }


            player.className =
                `podium-player ${positionClass}`;


            if (index === 1) {

                player.innerHTML = `

                    <div class="crown">
                        👑
                    </div>

                    <div class="rank-avatar">
                        ${user.avatar}
                    </div>

                    <span class="rank">
                        1
                    </span>

                    <strong>
                        ${escapeHTML(user.name)}
                    </strong>

                    <small>
                        ${user.xp} XP
                    </small>

                `;

            } else {

                const rank =
                    index + 1;


                player.innerHTML = `

                    <div class="rank-avatar">
                        ${user.avatar}
                    </div>

                    <span class="rank">
                        ${rank}
                    </span>

                    <strong>
                        ${escapeHTML(user.name)}
                    </strong>

                    <small>
                        ${user.xp} XP
                    </small>

                `;

            }


            podium.appendChild(
                player
            );

        }
    );

}


/* =========================================
   RENDER OTHER PLAYERS
========================================= */

function renderRankingList(sortedUsers) {

    const rankingList =
        document.getElementById(
            "rankingList"
        );


    if (!rankingList) {
        return;
    }


    rankingList.innerHTML = "";


    /*
        เริ่มจากอันดับ 4
    */

    const otherUsers =
        sortedUsers.slice(3);


    otherUsers.forEach(
        (user, index) => {

            const rank =
                index + 4;


            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "ranking-item";


            const currentUser =
                getCurrentLeaderboardUser();


            if (
                user.id ===
                currentUser.id
            ) {

                item.classList.add(
                    "current-user"
                );

            }


            item.innerHTML = `

                <span class="ranking-number">
                    ${rank}
                </span>


                <div class="mini-avatar">
                    ${user.avatar}
                </div>


                <div class="ranking-name">

                    ${escapeHTML(user.name)}

                </div>


                <strong>

                    ${user.xp} XP

                </strong>

            `;


            rankingList.appendChild(
                item
            );

        }
    );

}


/* =========================================
   CURRENT USER POSITION
========================================= */

function renderMyRanking(sortedUsers) {

    const container =
        document.getElementById(
            "myRanking"
        );


    if (!container) {
        return;
    }


    const currentUser =
        getCurrentLeaderboardUser();


    const index =
        sortedUsers.findIndex(
            user =>
                user.id ===
                currentUser.id
        );


    if (index === -1) {

        container.innerHTML = "";

        return;

    }


    const rank =
        index + 1;


    container.innerHTML = `

        <div class="my-ranking-left">

            <span>
                อันดับของคุณ
            </span>

            <strong>
                #${rank}
            </strong>

        </div>


        <div class="my-ranking-user">

            <div class="mini-avatar">
                ${currentUser.avatar}
            </div>

            <div>

                <strong>
                    ${escapeHTML(currentUser.name)}
                </strong>

                <span>
                    ${currentUser.streak} 🔥 Streak
                </span>

            </div>

        </div>


        <strong class="my-ranking-xp">

            ${currentUser.xp} XP

        </strong>

    `;

}


/* =========================================
   UPDATE PLAYER CARD
========================================= */

function updatePlayerCard() {

    const user =
        getCurrentLeaderboardUser();


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


    const levelElements =
        document.querySelectorAll(
            "[data-level]"
        );


    const level =
        calculateLevel(
            user.xp
        );


    levelElements.forEach(
        element => {

            element.textContent =
                level;

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


    /*
        Best Streak
    */

    const bestStreak =
        document.getElementById(
            "bestStreak"
        );


    if (bestStreak) {

        const savedBest =
            Number(
                localStorage.getItem(
                    "stretchmanBestStreak"
                ) || 0
            );


        const best =
            Math.max(
                savedBest,
                user.streak
            );


        localStorage.setItem(
            "stretchmanBestStreak",
            best
        );


        bestStreak.textContent =
            best;

    }

}


/* =========================================
   LEVEL
========================================= */

function calculateLevel(xp) {

    /*
        ทุก 100 XP = 1 Level

        0 - 99    = Level 1
        100 - 199 = Level 2
        ...
    */

    return (
        Math.floor(
            xp / 100
        ) + 1
    );

}


/* =========================================
   STREAK DAYS
========================================= */

function updateStreakDays() {

    const currentUser =
        getCurrentLeaderboardUser();


    const days =
        document.querySelectorAll(
            ".streak-days .day"
        );


    if (!days.length) {
        return;
    }


    const today =
        new Date();


    const currentDay =
        today.getDay();


    /*
        Monday = 0
    */

    const mondayIndex =
        currentDay === 0
            ? 6
            : currentDay - 1;


    const streak =
        currentUser.streak;


    days.forEach(
        (day, index) => {

            day.classList.remove(
                "completed"
            );

            day.classList.remove(
                "today"
            );


            if (
                index === mondayIndex
            ) {

                day.classList.add(
                    "today"
                );

            }


            if (
                streak > 0 &&
                index <= mondayIndex &&
                index >=
                    mondayIndex -
                    streak +
                    1
            ) {

                day.classList.add(
                    "completed"
                );

            }

        }
    );

}


/* =========================================
   REFRESH LEADERBOARD
========================================= */

function refreshLeaderboard() {

    /*
        เอาข้อมูล User หลัก
        มาอัปเดตใน Leaderboard
    */

    syncCurrentUser();


    const users =
        getLeaderboardUsers();


    const sortedUsers =
        sortLeaderboard(
            users
        );


    updateTopUser(
        sortedUsers
    );


    renderPodium(
        sortedUsers
    );


    renderRankingList(
        sortedUsers
    );


    renderMyRanking(
        sortedUsers
    );


    updatePlayerCard();

    updateStreakDays();

}


/* =========================================
   ESCAPE HTML
========================================= */

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text;


    return div.innerHTML;

}


/* =========================================
   BACK BUTTON
========================================= */

const backBtn =
    document.getElementById(
        "backBtn"
    );


if (backBtn) {

    backBtn.addEventListener(
        "click",
        () => {

            window.location.href =
                "settings.html";

        }
    );

}


/* =========================================
   HISTORY BUTTON
========================================= */

const historyBtn =
    document.getElementById(
        "historyBtn"
    );


if (historyBtn) {

    historyBtn.addEventListener(
        "click",
        () => {

            window.location.href =
                "streak-history.html";

        }
    );

}


/* =========================================
   INITIALIZE
========================================= */

refreshLeaderboard();


/*
    ถ้ากลับมาหน้านี้
    ให้อัปเดตข้อมูลใหม่
*/

window.addEventListener(
    "focus",
    () => {

        refreshLeaderboard();

    }
);


/*
    ตรวจทุก 2 วินาที
    เผื่อ XP / Streak เปลี่ยน
*/

setInterval(
    refreshLeaderboard,
    2000
);