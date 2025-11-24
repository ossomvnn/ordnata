document.addEventListener('DOMContentLoaded', () => {
    const codePart = document.getElementById('codePart');
    const codeName = document.getElementById('codeName');
    const daysCount = document.getElementById('daysCount');
    const totalCodes = document.getElementById('totalCodes');
    const giveCodeBtn = document.getElementById('giveCodeBtn');
    const codesTableBody = document.getElementById('codesTableBody');
    
    // Filter and Count Box initialization REMOVED 

    // --- Helper Functions ---
    
    function loadResidents() {
        return JSON.parse(localStorage.getItem('residents') || '[]');
    }

    function loadCodes() {
        return JSON.parse(localStorage.getItem('codes') || '[]');
    }

    function saveCodes(codes) {
        localStorage.setItem('codes', JSON.stringify(codes));
    }

    function loadBlocked() {
        return JSON.parse(localStorage.getItem('blocked') || '[]');
    }

    function showMessage(msg, color = "#ff4444") {
        const box = document.createElement("div");
        box.innerText = msg;
        box.style.position = "fixed";
        box.style.top = "20px";
        box.style.left = "50%";
        box.style.transform = "translateX(-50%)";
        box.style.background = color;
        box.style.color = "#fff";
        box.style.padding = "12px 18px";
        box.style.borderRadius = "8px";
        box.style.zIndex = "99999";
        box.style.fontFamily = "Segoe UI";
        document.body.appendChild(box);
        setTimeout(() => box.remove(), 5000);
    }

    function populateNames() {
        const part = codePart.value;
        const residents = loadResidents();
        // Translated 'Select Name'
        codeName.innerHTML = '<option value="">Namen auswählen</option>'; 
        residents.filter(r => r.part === part).forEach(r => {
            const opt = document.createElement('option');
            opt.value = r.name;
            opt.textContent = r.name;
            codeName.appendChild(opt);
        });
    }

    function removeExpiredCodes() {
        let codes = loadCodes();
        const today = new Date();
        codes = codes.filter(c => new Date(c.nextAllowed) >= today);
        saveCodes(codes);
    }

    function renderCodes() {
        removeExpiredCodes();
        const codes = loadCodes();
        
        // Filtering logic REMOVED. Display ALL codes.
        const filtered = codes; 

        codesTableBody.innerHTML = '';
        filtered.forEach((c, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${c.name}</td>
                <td>${c.part}</td>
                <td>${c.codeDate}</td>
                <td>${c.nextAllowed}</td>
                <td>${c.totalCodes}</td>
                <td><button class="removeBtn" data-index="${index}">Entfernen</button></td>
            `;
            codesTableBody.appendChild(tr);
        });
        
        // Count Box update REMOVED
    }

    // --- Event Listeners ---
    
    giveCodeBtn.addEventListener('click', () => {
        const part = codePart.value;
        const name = codeName.value;
        const days = parseInt(daysCount.value);
        const total = parseInt(totalCodes.value);

        if (!part || !name || !days || !total) {
            // Translated error message
            showMessage("Bitte füllen Sie alle Felder aus"); 
            return;
        }

        const today = new Date();
        const nextDate = new Date();
        nextDate.setDate(today.getDate() + days);

        const codes = loadCodes();
        const blocked = loadBlocked();

        const isBlocked = blocked.find(b => b.name === name && b.part === part);
        if (isBlocked) {
            // Translated error message
            showMessage(`Dieser Bewohner kann keinen neuen Code bis ${isBlocked.blockedUntil} erhalten`);
            return;
        }

        const existing = codes.find(c => c.name === name);
        if (existing) {
            const nextAllowedDate = new Date(existing.nextAllowed);
            if (today < nextAllowedDate) {
                // Translated error message
                showMessage(`Code kann nicht vergeben werden. Nächste Erlaubnis: ${existing.nextAllowed}`, "#ff4444");
                return;
            }
        }

        codes.push({
            part,
            name,
            codeDate: today.toISOString().split('T')[0],
            nextAllowed: nextDate.toISOString().split('T')[0],
            totalCodes: total
        });

        saveCodes(codes);
        renderCodes();
        // Translated success message
        showMessage(`Code erfolgreich für ${name} vergeben`, "#33c341"); 

        codePart.value = '';
        // Translated 'Select Name'
        codeName.innerHTML = '<option value="">Namen auswählen</option>'; 
        daysCount.value = '';
        totalCodes.value = '';
    });

    codesTableBody.addEventListener('click', e => {
        if (e.target.classList.contains('removeBtn')) {
            const index = parseInt(e.target.dataset.index);
            // Since we are not filtering, the index is the true index in the loaded array.
            const codes = loadCodes();
            const removed = codes.splice(index, 1);
            saveCodes(codes);
            renderCodes();
            if (removed.length > 0) {
                // Translated removal message
                showMessage(`Code für ${removed[0].name} entfernt`); 
            }
        }
    });

    codePart.addEventListener('change', populateNames);
    // codeFilter event listener REMOVED

    renderCodes();
});