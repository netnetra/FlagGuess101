const countries = [
  { name: "Argentina", flag: "🇦🇷" },
  { name: "Australia", flag: "🇦🇺" },
  { name: "Austria", flag: "🇦🇹" },
  { name: "Belgium", flag: "🇧🇪" },
  { name: "Brazil", flag: "🇧🇷" },
  { name: "Cameroon", flag: "🇨🇲" },
  { name: "Canada", flag: "🇨🇦" },
  { name: "Chile", flag: "🇨🇱" },
  { name: "Colombia", flag: "🇨🇴" },
  { name: "Costa Rica", flag: "🇨🇷" },
  { name: "Croatia", flag: "🇭🇷" },
  { name: "Denmark", flag: "🇩🇰" },
  { name: "Ecuador", flag: "🇪🇨" },
  { name: "Egypt", flag: "🇪🇬" },
  { name: "England", flag: "🇬🇧" },
  { name: "France", flag: "🇫🇷" },
  { name: "Germany", flag: "🇩🇪" },
  { name: "Ghana", flag: "🇬🇭" },
  { name: "Iran", flag: "🇮🇷" },
  { name: "Iraq", flag: "🇮🇶" },
  { name: "Japan", flag: "🇯🇵" },
  { name: "Mexico", flag: "🇲🇽" },
  { name: "Morocco", flag: "🇲🇦" },
  { name: "Netherlands", flag: "🇳🇱" },
  { name: "New Zealand", flag: "🇳🇿" },
  { name: "Nigeria", flag: "🇳🇬" },
  { name: "Panama", flag: "🇵🇦" },
  { name: "Paraguay", flag: "🇵🇾" },
  { name: "Peru", flag: "🇵🇪" },
  { name: "Poland", flag: "🇵🇱" },
  { name: "Portugal", flag: "🇵🇹" },
  { name: "Qatar", flag: "🇶🇦" },
  { name: "Saudi Arabia", flag: "🇸🇦" },
  { name: "Senegal", flag: "🇸🇳" },
  { name: "Serbia", flag: "🇷🇸" },
  { name: "South Korea", flag: "🇰🇷" },
  { name: "Spain", flag: "🇪🇸" },
  { name: "Switzerland", flag: "🇨🇭" },
  { name: "Tunisia", flag: "🇹🇳" },
  { name: "United States", flag: "🇺🇸" },
  { name: "Uruguay", flag: "🇺🇾" },
  { name: "Uzbekistan", flag: "🇺🇿" },
];

const flagDisplay = document.getElementById("flag-display");
const feedback = document.getElementById("feedback");
const form = document.getElementById("guess-form");
const input = document.getElementById("guess-input");
const optionsContainer = document.getElementById("options-container");

const state = {
  currentCountry: null,
  attempts: 3,
  multipleChoiceActive: false,
  blockedCountries: [],
  previousCountryName: null,
  lastRoundFailed: false,
};

function getRandomCountry() {
  const pool = countries.filter((country) => {
    if (state.previousCountryName && country.name === state.previousCountryName) {
      return state.lastRoundFailed;
    }

    return !state.blockedCountries.includes(country.name);
  });

  if (pool.length === 0) {
    state.blockedCountries = [];
    return getRandomCountry();
  }

  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
}

function startRound() {
  state.currentCountry = getRandomCountry();
  state.attempts = 3;
  state.multipleChoiceActive = false;

  flagDisplay.textContent = state.currentCountry.flag;
  feedback.textContent = "Type the country name.";
  input.value = "";
  input.hidden = false;
  input.disabled = false;
  form.hidden = false;
  optionsContainer.innerHTML = "";
  optionsContainer.hidden = true;
  input.focus();
}

function getOptionPool(correctName) {
  const wrongChoices = [];

  while (wrongChoices.length < 3) {
    const randomCountry = countries[Math.floor(Math.random() * countries.length)];

    if (randomCountry.name !== correctName && !wrongChoices.includes(randomCountry.name)) {
      wrongChoices.push(randomCountry.name);
    }
  }

  return [correctName, ...wrongChoices].sort(() => 0.5 - Math.random());
}

function showOptions() {
  state.multipleChoiceActive = true;
  form.hidden = true;
  optionsContainer.hidden = false;

  const options = getOptionPool(state.currentCountry.name);
  optionsContainer.innerHTML = "";

  options.forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "option-button";
    button.textContent = option;
    button.addEventListener("click", () => handleOptionChoice(option));
    optionsContainer.appendChild(button);
  });

  feedback.textContent = "Choose the correct country from the options.";
}

function normalize(value) {
  return value.trim().toLowerCase();
}

function handleCorrectGuess() {
  feedback.textContent = `Correct! ${state.currentCountry.name} was right.`;
  input.hidden = true;
  input.disabled = true;
  form.hidden = true;
  optionsContainer.hidden = true;

  state.previousCountryName = state.currentCountry.name;
  state.lastRoundFailed = false;
  state.blockedCountries = state.blockedCountries.filter((name) => name !== state.previousCountryName);

  setTimeout(() => {
    startRound();
  }, 1000);
}

function handleSubmit(event) {
  event.preventDefault();

  if (state.multipleChoiceActive) {
    return;
  }

  const guess = normalize(input.value);

  if (!guess) {
    feedback.textContent = "Please enter a country name.";
    return;
  }

  if (guess === normalize(state.currentCountry.name)) {
    handleCorrectGuess();
    return;
  }

  state.attempts -= 1;

  if (state.attempts > 0) {
    feedback.textContent = `Wrong! ${state.attempts} ${state.attempts === 1 ? "try" : "tries"} left.`;
    input.value = "";
    input.focus();
  } else {
    feedback.textContent = "No tries left. Choose the correct option.";
    state.lastRoundFailed = true;
    state.blockedCountries.push(state.currentCountry.name);
    showOptions();
  }
}

function handleOptionChoice(choice) {
  if (choice === state.currentCountry.name) {
    handleCorrectGuess();
    return;
  }

  const buttons = optionsContainer.querySelectorAll("button");
  buttons.forEach((button) => button.disabled = true);
  feedback.textContent = `Not quite. The answer was ${state.currentCountry.name}.`;
  state.previousCountryName = state.currentCountry.name;
  state.lastRoundFailed = true;
  state.blockedCountries.push(state.currentCountry.name);

  setTimeout(() => {
    startRound();
  }, 1200);
}

form.addEventListener("submit", handleSubmit);

startRound();
