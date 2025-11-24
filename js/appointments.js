document.addEventListener('DOMContentLoaded', () => {
    const appPart = document.getElementById("appPart");
    const residentSelect = document.getElementById("residentSelect");
    const appDate = document.getElementById("appDate");
    const appTime = document.getElementById("appTime");
    const appNote = document.getElementById("appNote");
    const addBtn = document.getElementById("addBtn");
    const appointmentsTable = document.getElementById("appointmentsTable");
    const searchBtn = document.getElementById("searchBtn");
    const searchCode = document.getElementById("searchCode");
    const searchResult = document.getElementById("searchResult");
    const backBtn = document.getElementById("backBtn");

    backBtn.addEventListener("click", () => { window.location.href = "index.html"; });

    const blocked = JSON.parse(localStorage.getItem("blocked") || "[]");

    function loadResidents() {
        return JSON.parse(localStorage.getItem("residents") || "[]");
    }

    function loadAppointments() {
        return JSON.parse(localStorage.getItem("appointments") || "[]");
    }

    function saveAppointments(list) {
        localStorage.setItem("appointments", JSON.stringify(list));
    }

    function removeExpired() {
        const now = new Date();
        let list = loadAppointments();
        list = list.filter(a => new Date(a.date + " " + a.time) >= now);
        saveAppointments(list);
    }

    // Populate resident select ONLY after Part is chosen
    function populateResidents() {
        const part = appPart.value;
        const residents = loadResidents();

        // Translated 'Bewohner auswählen'
        residentSelect.innerHTML = '<option value="">Bewohner auswählen</option>';

        if (!part) return; // Do not show names if no Part selected

        // Filter residents by selected Part
        residents.filter(r => r.part === part).forEach(r => {
            const opt = document.createElement("option");
            opt.value = r.name;
            opt.textContent = r.name;
            residentSelect.appendChild(opt);
        });
    }

    appPart.addEventListener("change", populateResidents);

    // Ensure resident select is empty initially (Translated)
    residentSelect.innerHTML = '<option value="">Bewohner auswählen</option>';

    function generateCode() {
        return String(Math.floor(1000 + Math.random() * 9000)); 
    }


    function isBlocked(name) {
        return blocked.some(b => b.name === name && new Date(b.until) > new Date());
    }

    // Success Message (Green)
    function showMessage(msg) {
        const box = document.createElement("div");
        box.innerText = msg;
        box.style.position = "fixed";
        box.style.top = "20px";
        box.style.left = "50%";
        box.style.transform = "translateX(-50%)";
        box.style.background = "#33c341ff";
        box.style.color = "#fff";
        box.style.padding = "12px 18px";
        box.style.borderRadius = "8px";
        box.style.zIndex = "99999";
        box.style.fontFamily = "Segoe UI";
        document.body.appendChild(box);
        setTimeout(() => box.remove(), 5000);
    }

    // Error/Warning Message (Red)
    function showman(msg) {
        const box = document.createElement("div");
        box.innerText = msg;
        box.style.position = "fixed";
        box.style.top = "20px";
        box.style.left = "50%";
        box.style.transform = "translateX(-50%)";
        box.style.background = "#ce3102ff";
        box.style.color = "#fff";
        box.style.padding = "12px 18px";
        box.style.borderRadius = "8px";
        box.style.zIndex = "99999";
        box.style.fontFamily = "Segoe UI";
        document.body.appendChild(box);
        setTimeout(() => box.remove(), 5000);
    }

    // --- Add appointment ---
    addBtn.addEventListener("click", () => {
        const part = appPart.value;
        const name = residentSelect.value;
        const date = appDate.value;
        const time = appTime.value;
        const note = appNote.value;

        if (!part || !name || !date || !time) {
            // Translated error message
            showman("Bitte füllen Sie alle Felder aus"); 
            return;
        }

        if (isBlocked(name)) {
            // Translated error message
            showman("Dieser Bewohner ist gesperrt."); 
            return;
        }

        const list = loadAppointments();
        const conflict = list.find(a => a.name === name && a.date === date && a.time === time);
        if (conflict) {
            // Translated error message
            showman("Dieser Bewohner hat bereits einen Termin zu dieser Zeit."); 
            return;
        }

        const code = generateCode();
        list.push({ code, part, name, date, time, note });
        saveAppointments(list);

        // Translated success message
        showMessage("Termin erfolgreich erstellt!"); 

        // Reset form (Translated reset options)
        appPart.value = '';
        residentSelect.innerHTML = '<option value="">Bewohner auswählen</option>';
        appDate.value = '';
        appTime.value = '';
        appNote.value = '';

        removeExpired();
        renderTable();
    });


    // --- Delete appointment ---
    window.deleteAppointment = function(code) {
        let list = loadAppointments();
        list = list.filter(a => a.code !== code);
        saveAppointments(list);

        // Translated message
        showman("Termin gelöscht!"); 

        renderTable();
    }


    // --- Print small receipt-style ticket ---
    window.printTicket = function(code) {
        const app = loadAppointments().find(a => a.code === code);
        // Translated alert message
        if (!app) return alert("Termin nicht gefunden."); 

        // Open a new window for printing
        const win = window.open("", "_blank");

            win.document.write(`
            
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <title>Terminbestätigung</title>
    <style>
        /* A4 Layout */
        @page {
            size: A4;
            margin: 25mm 20mm 25mm 20mm;
        }

        body {
            font-family: "Segoe UI", Tahoma, sans-serif;
            font-size: 14px;
            line-height: 1.5;
            margin: 0;
            padding: 0;
            width: 100%;
        }

        .container {
            width: 100%;
        }

        .logo {
            width: 120px;
            margin-bottom: 20px;
        }

        .sender {
            font-size: 10px; /* very small */
            text-decoration: underline;
            margin-bottom: 5px;
        }

        /* Receiver block prominent */
        .receiver {
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 30px;
        }
        .date {
            text-align: right;
            margin-bottom: 20px;
        }

        h2 {
            margin-top: 0;
            margin-bottom: 10px;
        }

        .section-title {
            margin-top: 15px;
            font-weight: bold;
            text-decoration: underline;
        }

        ul {
            margin-top: 5px;
        }

        hr {
            margin: 15px 0;
        }
    </style>
</head>
<body>

<div class="container">

  <br>
  <br>

    <div class="sender">
        UPPEN | Osterhuser 49 B , 26759 Hinte 
    </div>

    <div class="receiver">
        <strong>${app.name}</strong><br>
        <br>
        Hinte 26759
    </div>
<br>
<br>
<br>

 <div class="date">
    Hinte, den <span id="todayGerman"></span>
</div>

<script>
    const d = new Date();
    const germanDate =
        String(d.getDate()).padStart(2, "0") + "." +
        String(d.getMonth() + 1).padStart(2, "0") + "." +
        d.getFullYear();

    document.getElementById("todayGerman").textContent = germanDate;
</script>

<br>
<br>
<br>
    <h2><strong>Terminbestätigung</strong></h2>

    <p>
        Sehr geehrte/r <strong>${app.name}</strong>,
    </p>

    <p>
        hiermit bestätigen wir Ihnen Ihren Termin in unserem Büro.  
        Die Details finden Sie im Folgenden:
    </p>

    <div class="section-title">Termindetails</div>
    <p>
        <strong>Datum:</strong> ${app.date}<br>
        <strong>Uhrzeit:</strong> ${app.time}<br>
        <strong>Adresse:</strong> Osterhuser 49 A , 26759 Hinte<br>
        <strong>Code:</strong> ${app.code}
    </p>


        <strong>${app.note}</strong>
    

    <p>
        Falls Sie den Termin nicht wahrnehmen können, informieren Sie uns bitte rechtzeitig.
    </p>

    <br><br>
    <p>Mit freundlichen Grüßen</p>

    <p>
        <br>
        <h4 onclick="window.print()">UPPEN</h4>
    </p>

</div>

</body>
</html>


            `);
        }

        // --- Render appointments table ---
        function renderTable() {
            removeExpired();
            const list = loadAppointments();
            appointmentsTable.innerHTML = '';
            list.forEach(a => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${a.code}</td>
                    <td>${a.name}</td>
                    <td>${a.date}</td>
                    <td>${a.time}</td>
                    <td>${a.note || "-"}</td>
                    <td>
                        <button class="printBtn" onclick="printTicket('${a.code}')">Drucken</button>
                        <button class="deleteBtn" onclick="deleteAppointment('${a.code}')">Löschen</button>
                    </td>
                `;
                appointmentsTable.appendChild(tr);
            });
        }

        // --- Search by code ---
        searchBtn.addEventListener("click", () => {
            const code = searchCode.value.trim();
            const app = loadAppointments().find(a => a.code === code);
            searchResult.style.display = "block";

            if (!app) {
                // Translated search fail message
                searchResult.innerHTML = "<strong>Kein Termin gefunden.</strong>";
                return;
            }
            
            // Translated search result labels
            searchResult.innerHTML = `
                <strong>Name:</strong> ${app.name}<br>
                <strong>Gebäudeteil:</strong> ${app.part}<br>
                <strong>Datum:</strong> ${app.date}<br>
                <strong>Uhrzeit:</strong> ${app.time}<br>
                <strong>Notiz:</strong> ${app.note || "-"}<br>
                <strong>Code:</strong> ${app.code}
            `;
        });

    // --- Init ---
    removeExpired();
    residentSelect.innerHTML = '<option value="">Bewohner auswählen</option>';
    renderTable();
});