# ordnata

Eine moderne und offline-fähige Desktop-Anwendung zur Verwaltung und Ausgabe von Internet-Codes.  
Die App wurde mit **Electron**, **HTML/CSS/JS** entwickelt und funktioniert auf **Windows**, **macOS** und **Linux**.

---

## 🚀 Funktionen

### ✔ Verwaltung von Bewohnern / Personen
- Namen, Teil (A/B/C/D), letzte Ausgabe und Anzahl der Codes speichern
- Übersichtliche Tabelle mit automatischer Berechnung des nächsten Verfügbarkeitsdatums (+28 Tage)
- Daten werden lokal in `residents.json` gespeichert (kein Server nötig)

### ✔ Code-Ausgabe-System
- Automatische Prüfung, ob eine Person neue Codes bekommen darf
- Anzeige des nächsten verfügbaren Datums
- Fehler- und Erfolgsmeldungen
- Direkte Aktualisierung der Übersichtstabellen

### ✔ Benutzerfreundliche Oberfläche
- Moderne, einfache und klare UI
- Extra Seite zum manuellen Hinzufügen von neuen Personen
- Navigation zwischen allen Hauptseiten

### ✔ Druck-Funktionen
- Ausdruck eines Tickets / Internetcodes über ein neues Browserfenster
- Möglichkeit für automatischen Direktdruck

### ✔ Plattformübergreifend
- Entwickelt mit Electron
- Kann für Windows, macOS und Linux gebaut werden

---

## 📦 Installation (Entwicklung)

```bash
git clone https://github.com/DEIN-REPO-NAME
cd DEIN-REPO-NAME
npm install
npm start
```

---

## 🏗 Build für Windows

```bash
npm run build:win
```

Ausgabe befindet sich danach im Ordner:

```
dist/
```

---

## 🏗 Build für macOS

```bash
npm run build:mac
```

macOS erstellt eine `.app` Datei.

---

## 📁 Projektstruktur

```
.
├── whats-news.html
├── residents-html
├── perload.js
├── package.json
├── package-lock.js
├── css/
│   └── style.css
├── main.js
└── issue-code.html
└── index.html
└── forms.html
└── contact.html
└── blocked.html
└── appoiments.html
├── js/
│   └── appointments.js
│   └── blocked.js
│   └── issue-code.js
│   └── storage.js 

```

---

## ⚙ Technologien

- **Electron v25**
- HTML5 / CSS3 / JavaScript
- IPC Renderer/IPC Main Kommunikation
- JSON-Datei als lokale Datenbank

---

## 👨‍💻 Entwickler

**Erstellt von: Osman**  
100% lokal, offline nutzbar, zuverlässig und einfach.

---

## 📜 Lizenz

Dieses Projekt ist **frei verwendbar**, angepasst, erweitert und privat nutzbar.

