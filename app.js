let dailyShifts = []; // Dati del mese corrente
let monthlyTotal = 0; // Totale del mese corrente
let previousMonthShifts = []; // Dati del mese precedente
let previousMonthTotal = 0; // Totale del mese precedente

function registerShift() {
    const startTime = document.getElementById('start-time').value;
    const endTime = document.getElementById('end-time').value;
    const breakTime = document.getElementById('break-time').value;

    if (!startTime || !endTime) {
        alert("Per favore inserisci sia l'ora di inizio che quella di fine.");
        return;
    }

    const start = new Date(`01/01/2000 ${startTime}`);
    const end = new Date(`01/01/2000 ${endTime}`);

    if (end <= start) {
        alert("L'ora di fine deve essere successiva all'ora di inizio.");
        return;
    }

    let hoursWorked = (end - start) / (1000 * 60 * 60); // Calcolo delle ore lavorate

    // Se è stata inserita una pausa, sottraila dal totale delle ore lavorate
    if (breakTime) {
        const breakHours = parseFloat(breakTime) / 60; // Converti i minuti di pausa in ore
        hoursWorked -= breakHours; // Sottrai il tempo di pausa
        if (hoursWorked < 0) {
            alert("La durata del turno non può essere inferiore alla durata della pausa.");
            return;
        }
    }

    dailyShifts.push(hoursWorked);
    monthlyTotal += hoursWorked;

    updateUI();
    saveToLocalStorage();
}


function updateUI() {
    const dailyList = document.getElementById('daily-list');
    dailyList.innerHTML = '';
    
    dailyShifts.forEach((hours, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `Turno ${index + 1}: ${hours.toFixed(2)} ore`;
        
        // Aggiungi un pulsante di eliminazione per ogni turno
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Elimina';
        deleteButton.classList.add('delete-button');
        deleteButton.onclick = () => deleteShift(index);
        
        listItem.appendChild(deleteButton);
        dailyList.appendChild(listItem);
    });

    document.getElementById('monthly-total').textContent = `${monthlyTotal.toFixed(2)} ore`;
}

function deleteShift(index) {
    const confirmation = confirm("Sei sicuro di voler eliminare questo turno?");
    if (confirmation) {
        const hours = dailyShifts[index];
        monthlyTotal -= hours;
        dailyShifts.splice(index, 1);
        
        updateUI();
        saveToLocalStorage();
    }
}


function resetMonth() {
    const confirmation = confirm("Sei sicuro di voler resettare tutti i dati del mese?");
    if (confirmation) {
        dailyShifts = [];
        monthlyTotal = 0;
        updateUI();
        saveToLocalStorage();
    }
}

function newMonth() {
    const confirmation = confirm("Sei sicuro di voler iniziare un nuovo mese? Questo salverà i dati correnti nel mese precedente e azzererà i dati del mese corrente.");
    if (confirmation) {
        previousMonthShifts = dailyShifts; // Salva i dati del mese corrente come mese precedente
        previousMonthTotal = monthlyTotal;

        dailyShifts = []; // Azzera i dati del mese corrente
        monthlyTotal = 0;
        updateUI();
        saveToLocalStorage();
    }
}

function showPreviousMonth() {
    const dailyList = document.getElementById('daily-list');
    dailyList.innerHTML = '';
    
    previousMonthShifts.forEach((hours, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `Turno ${index + 1}: ${hours.toFixed(2)} ore`;
        dailyList.appendChild(listItem);
    });

    document.getElementById('monthly-total').textContent = `${previousMonthTotal.toFixed(2)} ore`;
}

function showCurrentMonth() {
    updateUI(); // Ripristina la visualizzazione del mese corrente
}

function saveToLocalStorage() {
    localStorage.setItem('dailyShifts', JSON.stringify(dailyShifts));
    localStorage.setItem('monthlyTotal', monthlyTotal);
    localStorage.setItem('previousMonthShifts', JSON.stringify(previousMonthShifts));
    localStorage.setItem('previousMonthTotal', previousMonthTotal);
}

function loadFromLocalStorage() {
    const storedShifts = localStorage.getItem('dailyShifts');
    const storedTotal = localStorage.getItem('monthlyTotal');
    const storedPrevShifts = localStorage.getItem('previousMonthShifts');
    const storedPrevTotal = localStorage.getItem('previousMonthTotal');

    if (storedShifts && storedTotal) {
        dailyShifts = JSON.parse(storedShifts);
        monthlyTotal = parseFloat(storedTotal);
        updateUI();
    }

    if (storedPrevShifts && storedPrevTotal) {
        previousMonthShifts = JSON.parse(storedPrevShifts);
        previousMonthTotal = parseFloat(storedPrevTotal);
    }
}

// Carica i dati salvati quando la pagina viene caricata
window.onload = loadFromLocalStorage;
