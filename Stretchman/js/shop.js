/* =========================
   SHOP
========================= */

const coinAmount =
    document.getElementById(
        "coinAmount"
    );


/* =========================
   LOAD COINS
========================= */

function loadCoins() {

    const coins =
        Number(
            localStorage.getItem(
                "coins"
            )
        ) || 0;


    coinAmount.textContent =
        coins.toLocaleString();

}


/* =========================
   INIT
========================= */

loadCoins();