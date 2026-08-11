const hotspots =
    document.querySelectorAll(".hotspot");

const selectedArea =
    document.getElementById("selectedArea");

const continueBtn =
    document.getElementById("continueBtn");

const backBtn =
    document.getElementById("backBtn");


/* =========================
   SELECT PAIN AREA
========================= */

hotspots.forEach((hotspot) => {

    hotspot.addEventListener("click", () => {

        const area =
            hotspot.dataset.area;


        // แสดงชื่อบริเวณที่เลือก
        selectedArea.textContent = area;


        // บันทึกข้อมูล
        localStorage.setItem(
            "selectedPain",
            area
        );


        // ล้าง selected จากจุดอื่น
        hotspots.forEach((item) => {

            item.classList.remove("selected");

        });


        // เพิ่ม selected ให้จุดที่เลือก
        hotspot.classList.add("selected");

    });

});


/* =========================
   CONTINUE
========================= */

continueBtn.addEventListener("click", () => {

    const area =
        localStorage.getItem("selectedPain");


    if (!area) {

        alert(
            "กรุณาเลือกบริเวณที่ปวดก่อน"
        );

        return;

    }


    window.location.href =
        "record.html";

});


/* =========================
   BACK
========================= */

backBtn.addEventListener("click", () => {

    window.location.href =
        "home.html";

});