import "./style.css";
import { mountSnakeGame } from "./games/snake";

type Locale = "en" | "ko";

type GameDefinition = {
  id: string;
  label: Record<Locale, string>;
  mount: (host: HTMLElement, locale: Locale) => () => void;
};

const games: GameDefinition[] = [
  {
    id: "snake",
    label: { en: "Snake", ko: "\uC2A4\uB124\uC774\uD06C" },
    mount: mountSnakeGame,
  },
];

const launcherText: Record<
  Locale,
  { title: string; subtitle: string; gameLabel: string; languageButton: string }
> = {
  en: {
    title: "Game Page",
    subtitle: "Select a game and start playing.",
    gameLabel: "Game",
    languageButton: "\uD55C\uAD6D\uC5B4",
  },
  ko: {
    title: "\uAC8C\uC784 \uD398\uC774\uC9C0",
    subtitle: "\uAC8C\uC784\uC744 \uC120\uD0DD\uD574\uC11C \uD50C\uB808\uC774\uD558\uC138\uC694.",
    gameLabel: "\uAC8C\uC784",
    languageButton: "English",
  },
};

const LANGUAGE_STORAGE_KEY = "game-vite-language";

const getInitialLocale = (): Locale => {
  const saved = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  return saved === "ko" ? "ko" : "en";
};

const app = document.querySelector<HTMLDivElement>("#app");
if (!app) throw new Error("App root not found.");

app.innerHTML = `
  <main class="launcher">
    <header class="launcher-header">
      <h1 id="launcher-title"></h1>
      <p id="launcher-subtitle"></p>
    </header>
    <div class="launcher-controls">
      <div class="launcher-controls-row">
        <label id="game-select-label" for="game-select"></label>
        <button id="language-switch" type="button"></button>
      </div>
      <select id="game-select"></select>
    </div>
    <section id="game-host"></section>
  </main>
`;

const selectEl = app.querySelector<HTMLSelectElement>("#game-select");
const hostEl = app.querySelector<HTMLElement>("#game-host");
const titleEl = app.querySelector<HTMLHeadingElement>("#launcher-title");
const subtitleEl = app.querySelector<HTMLParagraphElement>("#launcher-subtitle");
const gameLabelEl = app.querySelector<HTMLLabelElement>("#game-select-label");
const languageBtn = app.querySelector<HTMLButtonElement>("#language-switch");
if (!selectEl || !hostEl || !titleEl || !subtitleEl || !gameLabelEl || !languageBtn) {
  throw new Error("Launcher elements are missing.");
}

let locale: Locale = getInitialLocale();
let cleanupCurrentGame: (() => void) | null = null;

const renderLauncherText = () => {
  const text = launcherText[locale];
  titleEl.textContent = text.title;
  subtitleEl.textContent = text.subtitle;
  gameLabelEl.textContent = text.gameLabel;
  languageBtn.textContent = text.languageButton;
};

const renderGameOptions = () => {
  const selectedId = selectEl.value;
  selectEl.innerHTML = "";

  games.forEach((game) => {
    const option = document.createElement("option");
    option.value = game.id;
    option.textContent = game.label[locale];
    selectEl.append(option);
  });

  const targetId = selectedId || games[0].id;
  selectEl.value = games.some((game) => game.id === targetId) ? targetId : games[0].id;
};

const launchGame = (gameId: string) => {
  cleanupCurrentGame?.();
  hostEl.innerHTML = "";

  const game = games.find((entry) => entry.id === gameId);
  if (!game) {
    throw new Error(`Unknown game: ${gameId}`);
  }

  cleanupCurrentGame = game.mount(hostEl, locale);
};

selectEl.addEventListener("change", () => {
  launchGame(selectEl.value);
});

languageBtn.addEventListener("click", () => {
  locale = locale === "en" ? "ko" : "en";
  window.localStorage.setItem(LANGUAGE_STORAGE_KEY, locale);
  renderLauncherText();
  renderGameOptions();
  launchGame(selectEl.value);
});

renderLauncherText();
renderGameOptions();
launchGame(selectEl.value);
