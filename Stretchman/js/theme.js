/* =====================================
   STRETCHMAN THEME SYSTEM
===================================== */

(function () {

    const savedTheme =
        localStorage.getItem("stretchmanTheme");

    if (savedTheme === "dark") {

        document.documentElement.classList.add(
            "dark-mode"
        );

    }

})();


/* =====================================
   SET THEME
===================================== */

function setTheme(theme) {

    if (theme === "dark") {

        document.documentElement.classList.add(
            "dark-mode"
        );

        localStorage.setItem(
            "stretchmanTheme",
            "dark"
        );

    } else {

        document.documentElement.classList.remove(
            "dark-mode"
        );

        localStorage.setItem(
            "stretchmanTheme",
            "light"
        );

    }

}


/* =====================================
   GET THEME
===================================== */

function getTheme() {

    return (
        localStorage.getItem(
            "stretchmanTheme"
        ) || "light"
    );

}