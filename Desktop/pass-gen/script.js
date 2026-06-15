// Constants
const CHARACTER_SETS = {
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    numbers: "0123456789",
    symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?"
};

// DOM Elements
const lengthSlider = document.getElementById("length");
const lengthValue = document.getElementById("lengthValue");
const passwordInput = document.getElementById("password");
const strengthText = document.getElementById("strength");
const strengthBar = document.getElementById("strengthBar");
const uppercaseCheckbox = document.getElementById("uppercase");
const lowercaseCheckbox = document.getElementById("lowercase");
const numbersCheckbox = document.getElementById("numbers");
const symbolsCheckbox = document.getElementById("symbols");
const excludeAmbiguousCheckbox = document.getElementById("excludeAmbiguous");
const historySection = document.getElementById("historySection");
const historyList = document.getElementById("historyList");

// Password history
let passwordHistory = [];

// Dark Mode
const themeToggle = document.getElementById("themeToggle");
const html = document.documentElement;

function initTheme() {
    const savedTheme = localStorage.getItem("theme") || "light";
    if (savedTheme === "dark") {
        html.classList.add("dark-mode");
        updateThemeIcon();
    }
}

function updateThemeIcon() {
    const icon = themeToggle.querySelector(".theme-icon");
    icon.textContent = html.classList.contains("dark-mode") ? "☀️" : "🌙";
}

themeToggle.addEventListener("click", () => {
    html.classList.toggle("dark-mode");
    const isDark = html.classList.contains("dark-mode");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    updateThemeIcon();
});

// Presets
const presets = {
    strong: { length: 16, uppercase: true, lowercase: true, numbers: true, symbols: true },
    medium: { length: 12, uppercase: true, lowercase: true, numbers: true, symbols: false },
    pin: { length: 4, uppercase: false, lowercase: false, numbers: true, symbols: false },
    memorable: { length: 12, uppercase: true, lowercase: true, numbers: true, symbols: false }
};

function applyPreset(presetName) {
    const preset = presets[presetName];
    if (!preset) return;

    lengthSlider.value = preset.length;
    lengthValue.textContent = preset.length;
    uppercaseCheckbox.checked = preset.uppercase;
    lowercaseCheckbox.checked = preset.lowercase;
    numbersCheckbox.checked = preset.numbers;
    symbolsCheckbox.checked = preset.symbols;

    generatePassword();
    showToast(`✨ ${presetName.charAt(0).toUpperCase() + presetName.slice(1)} preset applied!`);
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    loadHistory();
    generatePassword();
});

// Length slider event
lengthSlider.addEventListener("input", () => {
    lengthValue.textContent = lengthSlider.value;
    updateRealTimeStrength();
});

// Real-time strength update on checkbox change
uppercaseCheckbox.addEventListener("change", updateRealTimeStrength);
lowercaseCheckbox.addEventListener("change", updateRealTimeStrength);
numbersCheckbox.addEventListener("change", updateRealTimeStrength);
symbolsCheckbox.addEventListener("change", updateRealTimeStrength);
excludeAmbiguousCheckbox.addEventListener("change", updateRealTimeStrength);

// Update strength in real-time based on settings
function updateRealTimeStrength() {
    const length = parseInt(lengthSlider.value);
    let chars = "";

    if (uppercaseCheckbox.checked) chars += "A";
    if (lowercaseCheckbox.checked) chars += "a";
    if (numbersCheckbox.checked) chars += "0";
    if (symbolsCheckbox.checked) chars += "!";

    if (chars === "") {
        strengthBar.style.width = "0%";
        strengthText.textContent = "No characters selected";
        return;
    }

    // Calculate expected strength based on current settings
    let expectedStrength = 0;
    
    // Length contribution
    if (length >= 8) expectedStrength += 20;
    if (length >= 12) expectedStrength += 20;
    if (length >= 16) expectedStrength += 20;

    // Character variety contribution
    if (uppercaseCheckbox.checked) expectedStrength += 15;
    if (lowercaseCheckbox.checked) expectedStrength += 15;
    if (numbersCheckbox.checked) expectedStrength += 15;
    if (symbolsCheckbox.checked) expectedStrength += 15;

    expectedStrength = Math.min(expectedStrength, 100);

    // Update strength display
    strengthBar.style.width = expectedStrength + "%";

    let strengthLevel, strengthColor;
    if (expectedStrength < 30) {
        strengthLevel = "Weak 🔴";
        strengthColor = "#f44336";
    } else if (expectedStrength < 60) {
        strengthLevel = "Fair 🟡";
        strengthColor = "#ff9800";
    } else if (expectedStrength < 80) {
        strengthLevel = "Good 🟢";
        strengthColor = "#4caf50";
    } else {
        strengthLevel = "Strong 💪";
        strengthColor = "#2196f3";
    }

    strengthText.textContent = strengthLevel + " (" + expectedStrength + "/100) - Preview";
    strengthBar.style.backgroundColor = strengthColor;
}

// Generate password function
function generatePassword() {
    const length = parseInt(lengthSlider.value);
    let chars = "";

    if (uppercaseCheckbox.checked) chars += CHARACTER_SETS.uppercase;
    if (lowercaseCheckbox.checked) chars += CHARACTER_SETS.lowercase;
    if (numbersCheckbox.checked) chars += CHARACTER_SETS.numbers;
    if (symbolsCheckbox.checked) chars += CHARACTER_SETS.symbols;

    // Ensure at least one character set is selected
    if (chars === "") {
        showToast("Select at least one character type!");
        return;
    }

    // Filter out ambiguous characters if enabled
    if (excludeAmbiguousCheckbox.checked) {
        chars = filterAmbiguousChars(chars);
        if (chars === "") {
            showToast("No characters left after filtering! Disable ambiguous filter.");
            return;
        }
    }

    let password = "";
    for (let i = 0; i < length; i++) {
        password += chars[Math.floor(Math.random() * chars.length)];
    }

    passwordInput.value = password;
    updateStrengthIndicator(password);
    addToHistory(password);
}

// Filter ambiguous characters (0/O, l/1, I/i, |, etc.)
function filterAmbiguousChars(chars) {
    const ambiguous = "0O1lI|";
    let filtered = "";
    for (let char of chars) {
        if (!ambiguous.includes(char)) {
            filtered += char;
        }
    }
    return filtered;
}

// Calculate password strength
function calculateStrength(password) {
    let strength = 0;
    const length = password.length;

    // Length score
    if (length >= 8) strength += 20;
    if (length >= 12) strength += 20;
    if (length >= 16) strength += 20;

    // Character variety score
    if (/[a-z]/.test(password)) strength += 15;
    if (/[A-Z]/.test(password)) strength += 15;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) strength += 15;

    return Math.min(strength, 100);
}

// Update strength indicator
function updateStrengthIndicator(password) {
    const strength = calculateStrength(password);
    const length = password.length;

    strengthBar.style.width = strength + "%";

    let strengthLevel, strengthColor;

    if (strength < 30) {
        strengthLevel = "Weak 🔴";
        strengthColor = "#f44336";
    } else if (strength < 60) {
        strengthLevel = "Fair 🟡";
        strengthColor = "#ff9800";
    } else if (strength < 80) {
        strengthLevel = "Good 🟢";
        strengthColor = "#4caf50";
    } else {
        strengthLevel = "Strong 💪";
        strengthColor = "#2196f3";
    }

    strengthText.textContent = strengthLevel + " (" + strength + "/100)";
    strengthBar.style.backgroundColor = strengthColor;
}

// Copy password to clipboard
function copyPassword() {
    const pwd = passwordInput.value;

    if (!pwd) {
        showToast("Generate a password first!");
        return;
    }

    // Modern clipboard API
    if (navigator.clipboard) {
        navigator.clipboard.writeText(pwd).then(() => {
            showToast("✓ Password copied!");
        }).catch(() => {
            fallbackCopy(pwd);
        });
    } else {
        fallbackCopy(pwd);
    }
}

// Fallback copy method
function fallbackCopy(text) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    showToast("✓ Password copied!");
}

// Add password to history
function addToHistory(password) {
    if (!passwordHistory.includes(password)) {
        passwordHistory.unshift(password);
        if (passwordHistory.length > 5) {
            passwordHistory.pop();
        }
        saveHistory();
        renderHistory();
    }
}

// Save history to localStorage
function saveHistory() {
    localStorage.setItem("passwordHistory", JSON.stringify(passwordHistory));
}

// Load history from localStorage
function loadHistory() {
    const saved = localStorage.getItem("passwordHistory");
    if (saved) {
        passwordHistory = JSON.parse(saved);
        renderHistory();
    }
}

// Render history
function renderHistory() {
    historyList.innerHTML = "";

    if (passwordHistory.length > 0) {
        historySection.style.display = "block";
        passwordHistory.forEach((pwd) => {
            const item = document.createElement("div");
            item.className = "history-item";
            item.innerHTML = `
                <span>${pwd}</span>
                <span style="cursor: pointer; font-size: 1.1em;" onclick="copyFromHistory('${pwd}')">📋</span>
            `;
            historyList.appendChild(item);
        });
    } else {
        historySection.style.display = "none";
    }
}

// Copy from history
function copyFromHistory(password) {
    passwordInput.value = password;
    updateStrengthIndicator(password);
    copyPassword();
}

// Clear history
function clearHistory() {
    if (confirm("Are you sure you want to clear the history?")) {
        passwordHistory = [];
        saveHistory();
        renderHistory();
        showToast("History cleared!");
    }
}

// Show toast notification
function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

// Keyboard Shortcuts
document.addEventListener("keydown", (e) => {
    // Spacebar or Enter to generate
    if ((e.code === "Space" || e.code === "Enter") && e.target.tagName !== "TEXTAREA") {
        e.preventDefault();
        generatePassword();
        showToast("⌨️ Spacebar shortcut!");
    }

    // D to toggle dark mode
    if ((e.key === "d" || e.key === "D") && e.ctrlKey === false && e.target.tagName !== "INPUT") {
        themeToggle.click();
        showToast("🌙 Dark mode toggled!");
    }

    // ? or H to show shortcuts
    if ((e.key === "?" || e.key === "h" || e.key === "H") && e.target.tagName !== "INPUT") {
        const shortcuts = `
⌨️ KEYBOARD SHORTCUTS:
Space/Enter - Generate password
Ctrl+D - Toggle dark mode
? or H - Show this help
        `;
        showToast("Press Spacebar to generate!");
    }
});