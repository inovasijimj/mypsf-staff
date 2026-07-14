const API_URL = "https://script.google.com/macros/s/AKfycbzQMWLxwViit19P3T_0CY6XyY3JN5B_KmSar9Wga7RFurFMjZWbP6qYTDRDp8i-m34-Ew/exec";

async function cariPassport() {

    const keyword = document.getElementById("search").value.trim().toUpperCase();
    const result = document.getElementById("result");

    if (keyword === "") {
        result.innerHTML = "<span style='color:red'>Sila masukkan No Resit atau No Kad Pengenalan.</span>";
        return;
    }

    result.innerHTML = "Sedang mencari...";

    try {

        const response = await fetch(API_URL + "?search=" + encodeURIComponent(keyword));
        const data = await response.json();

        if (data.found) {

            result.innerHTML = `
                <div class="info-card">

                    <h2>Maklumat Passport</h2>

                    <p><b>No Tag :</b> ${data.tag}</p>

                    <p><b>Status :</b> ${data.status}</p>

                    <p><b>Tarikh Diserah :</b> ${data.tarikh || "-"}</p>

                    <p><b>Catatan :</b> ${data.catatan || "-"}</p>

                    <br>

                    <button onclick="telahDiserah()">
                        ✅ Telah Diserah
                    </button>

                    <button onclick="tidakDiserah()">
                        ❌ Tidak Dapat Diserah
                    </button>

                    <div id="statusMsg" style="margin-top:20px;"></div>

                </div>
            `;

        } else {

            result.innerHTML =
            "<h2 style='color:red'>❌ Rekod Tidak Dijumpai</h2>";

        }

    } catch (err) {

        console.log(err);

        result.innerHTML =
        "<h2 style='color:red'>❌ Tidak dapat sambung ke Google Sheet.</h2>";

    }

}

async function telahDiserah() {

    const keyword = document.getElementById("search").value.trim();

    const response = await fetch(
        API_URL +
        "?action=update" +
        "&search=" + encodeURIComponent(keyword) +
        "&status=" + encodeURIComponent("DISERAH") +
        "&catatan=" + encodeURIComponent("Pasport telah diserah")
    );

    const data = await response.json();

    if (data.success) {

    document.getElementById("statusMsg").innerHTML = `
    <div style="
        background:#d4edda;
        color:#155724;
        padding:15px;
        border-radius:10px;
        font-weight:bold;">
        ✅ Status berjaya dikemaskini.
    </div>`;

    setTimeout(function () {

        document.getElementById("search").value = "";
        document.getElementById("result").innerHTML =
        "Sila scan barcode atau masukkan No Resit.";

        document.getElementById("search").focus();

    }, 3000);

} else {

    alert("❌ Gagal mengemaskini.");

}

}

async function tidakDiserah() {

    const sebab = prompt(
`Sebab tidak dapat diserah

1. PMA lama rosak
2. Dokumen tidak lengkap
3. Pemohon tidak hadir
4. Lain-lain`
    );

    if (!sebab) return;

    const keyword = document.getElementById("search").value.trim();

    const response = await fetch(
        API_URL +
        "?action=update" +
        "&search=" + encodeURIComponent(keyword) +
        "&status=" + encodeURIComponent("TIDAK DAPAT DISERAH") +
        "&catatan=" + encodeURIComponent(sebab)
    );

    const data = await response.json();

    document.getElementById("statusMsg").innerHTML = `
<div style="
    background:#f8d7da;
    color:#721c24;
    padding:15px;
    border-radius:10px;
    font-weight:bold;">
    ❌ Status dikemaskini.
</div>`;

setTimeout(function () {

    document.getElementById("search").value = "";
    document.getElementById("result").innerHTML =
    "Sila scan barcode atau masukkan No Resit.";

    document.getElementById("search").focus();

}, 3000);

}
// =============================
// Dual Input Method
// Barcode Scanner + Manual Entry
// =============================

// Fokus automatik pada kotak carian
window.onload = function () {
    document.getElementById("search").focus();
};

// Selepas scan atau tekan Enter
document.getElementById("search").addEventListener("keydown", function (e) {

    if (e.key === "Enter") {

        e.preventDefault();

        cariPassport();

    }

});

// ===============================
// Dual Input Method
// Barcode Scanner + Manual Entry
// ===============================

window.onload = function () {

    const input = document.getElementById("search");

    input.focus();

    let timer;

    input.addEventListener("input", function () {

        clearTimeout(timer);

        timer = setTimeout(function () {

            if (input.value.trim() !== "") {
                cariPassport();
            }

        }, 250);

    });

};