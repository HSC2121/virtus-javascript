Virtus.io — Web3 Course Enrollment Simulator 🎓💻

Virtus.io is an interactive simulator that allows users to explore Web3 courses, build a custom enrollment selection, apply discounts, choose installment plans, and view a dynamically calculated final cost — all rendered in-browser using vanilla JavaScript.

⚙️ Built With

HTML5

CSS3

JavaScript (ES6+)

SweetAlert2 (modals)

Toastify.js (notifications)

Fetch API (JSON data loading)

LocalStorage (state persistence)

🛠️ Core Features

📦 Dynamic course catalog loaded from external cursos.json (Fetch API)

🛒 Interactive cart with quantity updates, remove buttons, and real-time totals

💸 Automatic calculation of discounts (≥3 courses) and installment surcharges

🔔 Toast notifications (Add, Remove, Save, Load, etc.)

🧾 Full summary rendered in DOM (no alerts/console in final version)

💾 Save and load shopping state using LocalStorage

🧹 Clean structure with functions, arrays, objects, and DOM modularity

📁 Project Structure
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── script.js
├── data/
│   └── cursos.json
├── assets/
│   └── virtus.jpg
└── README.md

🧪 Live Demo (GitHub Pages)

👉 (Add your GitHub Pages link once deployed)
https://hsc2121.github.io/virtus.io-javascript/

🧠 How It Works

Explore available Web3 courses in the catalog

Add courses by clicking or via ID input form

Adjust quantities directly in the cart table

Select payment type (1 or 3 installments) and auto-apply surcharge

Save or restore selections via LocalStorage

View a full summary with totals, units, discounts, and installments

👨‍💻 Author

Hernán Cortacans
Virtus Strategic Labs
