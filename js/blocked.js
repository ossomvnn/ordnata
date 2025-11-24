document.addEventListener('DOMContentLoaded', () => {
    const blockPart = document.getElementById('blockPart');
    const blockName = document.getElementById('blockName');
    const blockReason = document.getElementById('blockReason');
    const blockDays = document.getElementById('blockDays');
    const blockBtn = document.getElementById('blockBtn');
    const blockedTableBody = document.getElementById('blockedTableBody');
    // blockFilter and countBox initialization REMOVED

    // Load residents and blocked from localStorage
    function loadResidents() {
        return JSON.parse(localStorage.getItem('residents') || '[]');
    }

    function loadBlocked() {
        return JSON.parse(localStorage.getItem('blocked') || '[]');
    }

    function saveBlocked(blocked) {
        localStorage.setItem('blocked', JSON.stringify(blocked));
    }

    // Remove expired blocked entries
    function removeExpiredBlocked() {
        let blocked = loadBlocked();
        const today = new Date();
        blocked = blocked.filter(b => new Date(b.blockedUntil) >= today);
        saveBlocked(blocked);
    }

    // Populate names dropdown based on selected part (Translated placeholder)
    function populateNames() {
        const part = blockPart.value;
        const residents = loadResidents();
        blockName.innerHTML = '<option value="">Namen auswählen</option>';
        residents.filter(r => r.part === part).forEach(r => {
            const opt = document.createElement('option');
            opt.value = r.name;
            opt.textContent = r.name;
            blockName.appendChild(opt);
        });
    }

    // Show message helper (Translated messages)
    function showMessage(msg, bgColor = "#ff4444") {
        const box = document.createElement("div");
        box.innerText = msg;
        box.style.position = "fixed";
        box.style.top = "20px";
        box.style.left = "50%";
        box.style.transform = "translateX(-50%)";
        box.style.background = bgColor;
        box.style.color = "#fff";
        box.style.padding = "12px 18px";
        box.style.borderRadius = "8px";
        box.style.zIndex = "99999";
        box.style.fontFamily = "Segoe UI";
        document.body.appendChild(box);
        setTimeout(() => box.remove(), 5000);
    }

    // Render blocked table (Simplified: shows ALL blocked entries)
    function renderBlocked() {
        removeExpiredBlocked();
        const blocked = loadBlocked();
        
        blockedTableBody.innerHTML = '';
        blocked.forEach((b, index) => { // Using unfiltered list index directly
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${b.name}</td>
                <td>${b.part}</td>
                <td>${b.reason}</td>
                <td>${b.blockedUntil}</td>
                <td><button class="removeBtn" onclick="removeBlocked(${index})">Entsperren</button></td>
            `;
            blockedTableBody.appendChild(tr);
        });
        
        // Count Box update REMOVED
    }

    // Add new block (Translated messages)
    function addBlock() {
        const part = blockPart.value;
        const name = blockName.value;
        const reason = blockReason.value;
        const days = parseInt(blockDays.value);

        if (!part || !name || !reason || !days) {
            showMessage("Bitte füllen Sie alle Felder aus");
            return;
        }

        const today = new Date();
        const blockedUntil = new Date();
        blockedUntil.setDate(today.getDate() + days);

        const blocked = loadBlocked();

        // Check if already blocked
        const alreadyBlocked = blocked.find(b => b.name === name && b.part === part);
        if (alreadyBlocked) {
            showMessage(`${name} ist bereits gesperrt bis ${alreadyBlocked.blockedUntil}`);
            return;
        }

        blocked.push({
            part,
            name,
            reason,
            blockedUntil: blockedUntil.toISOString().split('T')[0]
        });

        saveBlocked(blocked);

        blockPart.value = '';
        blockName.innerHTML = '<option value="">Namen auswählen</option>'; // Translated reset
        blockReason.value = '';
        blockDays.value = '';

        renderBlocked();
        showMessage(`${name} erfolgreich gesperrt`, "#eac522ff");
    }

    // Remove blocked person (Translated messages)
    window.removeBlocked = function(index) {
        // Since renderBlocked displays the full unfiltered list, the index passed here is the correct index in the loaded array.
        let blocked = loadBlocked();
        const removed = blocked.splice(index, 1);
        saveBlocked(blocked);
        renderBlocked();
        
        if (removed.length > 0) {
            showMessage(`${removed[0].name} von Sperrliste entfernt`, "#2ecc71"); // Green for success/removal
        }
    }

    // Event listeners
    blockPart.addEventListener('change', populateNames);
    blockBtn.addEventListener('click', addBlock);
    // blockFilter event listener REMOVED

    // Initial render
    renderBlocked();
});