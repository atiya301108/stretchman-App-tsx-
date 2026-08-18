/* =====================================
   QUEST PAGE
===================================== */


/* =====================================
   GET USER DATA
===================================== */

function loadQuestRewards() {

    const xpElement =
        document.getElementById("questXP");

    const coinsElement =
        document.getElementById("questCoins");


    /* ถ้ามีระบบ app.js อยู่แล้ว */

    if (typeof getUserData === "function") {

        const user =
            getUserData();


        if (xpElement) {

            xpElement.textContent =
                user.xp || 0;

        }


        if (coinsElement) {

            coinsElement.textContent =
                user.coins || 0;

        }

        return;

    }


    /* fallback */

    const xp =
        localStorage.getItem(
            "stretchmanXP"
        ) || 0;


    const coins =
        localStorage.getItem(
            "stretchmanCoins"
        ) || 0;


    if (xpElement) {

        xpElement.textContent =
            xp;

    }


    if (coinsElement) {

        coinsElement.textContent =
            coins;

    }

}


/* =====================================
   INITIALIZE
===================================== */

loadQuestRewards();


/* อัปเดตเมื่อกลับมาหน้านี้ */

window.addEventListener(
    "focus",
    loadQuestRewards
);