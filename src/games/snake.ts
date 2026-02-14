type Point = {
  x: number;
  y: number;
};

type Locale = "en" | "ko";
type SpeedLevel = "slow" | "normal" | "fast";
type DirectionName = "up" | "down" | "left" | "right";

const GRID_SIZE = 24;
const CELL_SIZE = 24;
const BOARD_SIZE = GRID_SIZE * CELL_SIZE;
const FOOD_PADDING = 1;
const SPEED_TICK_MS: Record<SpeedLevel, number> = {
  slow: 170,
  normal: 120,
  fast: 85,
};

const textByLocale: Record<
  Locale,
  {
    title: string;
    score: string;
    best: string;
    gameOver: string;
    finalScore: string;
    restart: string;
    help: string;
    speed: string;
    speedSlow: string;
    speedNormal: string;
    speedFast: string;
    descTitle1: string;
    descBody1: string;
    descTitle2: string;
    descBody2: string;
    descTitle3: string;
    descBody3: string;
    ariaDescription: string;
  }
> = {
  en: {
    title: "Snake",
    score: "Score",
    best: "Best",
    gameOver: "Game Over",
    finalScore: "Final Score",
    restart: "Restart",
    help: "Arrow keys / WASD or touch-and-hold joystick on the board",
    speed: "Speed",
    speedSlow: "Slow",
    speedNormal: "Normal",
    speedFast: "Fast",
    descTitle1: "How To Play",
    descBody1:
      "Snake is a classic arcade game where you control a moving snake. Use the arrow keys or WASD keys to change direction. Collect apples to increase your score. Do not hit the wall or your own body.",
    descTitle2: "Game Goal And Difficulty",
    descBody2:
      "The main goal is to survive as long as possible while building a long snake. Each apple makes the snake longer, so movement becomes more difficult over time. Players need timing, path planning, and careful turns to reach a high score.",
    descTitle3: "Why This Game Is Fun",
    descBody3:
      "This game is simple to understand, but it still offers a strong challenge. Every session is short and replayable, which is good for quick breaks. The clear rules and visual feedback make it suitable for both new players and experienced players.",
    ariaDescription: "Snake game description",
  },
  ko: {
    title: "\uC2A4\uB124\uC774\uD06C",
    score: "\uC810\uC218",
    best: "\uCD5C\uACE0 \uC810\uC218",
    gameOver: "\uAC8C\uC784 \uC624\uBC84",
    finalScore: "\uCD5C\uC885 \uC810\uC218",
    restart: "\uB2E4\uC2DC \uC2DC\uC791",
    help: "\uBC29\uD5A5\uD0A4 / WASD \uB610\uB294 \uAC8C\uC784\uD310 \uD130\uCE58 \uD6C4 \uC870\uC774\uC2A4\uD2F1 \uC870\uC791",
    speed: "\uC18D\uB3C4",
    speedSlow: "\uB290\uB9BC",
    speedNormal: "\uBCF4\uD1B5",
    speedFast: "\uBE60\uB984",
    descTitle1: "\uAC8C\uC784 \uBC29\uBC95",
    descBody1:
      "\uC2A4\uB124\uC774\uD06C\uB294 \uC6C0\uC9C1\uC774\uB294 \uBC40\uC744 \uC870\uC791\uD558\uB294 \uD074\uB798\uC2DD \uC544\uCF00\uC774\uB4DC \uAC8C\uC784\uC785\uB2C8\uB2E4. \uBC29\uD5A5\uD0A4 \uB610\uB294 WASD \uD0A4\uB85C \uBC29\uD5A5\uC744 \uBC14\uAFB8\uC138\uC694. \uC0AC\uACFC\uB97C \uBA39\uC73C\uBA74 \uC810\uC218\uAC00 \uC62C\uB77C\uAC11\uB2C8\uB2E4. \uBCBD\uC774\uB098 \uC790\uC2E0\uC758 \uBAB8\uC5D0 \uBD80\uB52A\uD788\uBA74 \uAC8C\uC784\uC774 \uB05D\uB0A9\uB2C8\uB2E4.",
    descTitle2: "\uBAA9\uD45C\uC640 \uB09C\uC774\uB3C4",
    descBody2:
      "\uBAA9\uD45C\uB294 \uAC00\uB2A5\uD55C \uC624\uB798 \uC0B4\uC544\uB0A8\uC544 \uAE34 \uBC40\uC744 \uB9CC\uB4DC\uB294 \uAC83\uC785\uB2C8\uB2E4. \uC0AC\uACFC\uB97C \uBA39\uC744\uC218\uB85D \uBAB8\uC774 \uAE38\uC5B4\uC838 \uC870\uC791\uC774 \uC810\uC810 \uC5B4\uB824\uC6CC\uC9D1\uB2C8\uB2E4. \uB192\uC740 \uC810\uC218\uB97C \uC5BB\uC73C\uB824\uBA74 \uD0C0\uC774\uBC0D, \uC774\uB3D9 \uACBD\uB85C \uACC4\uD68D, \uC2E0\uC911\uD55C \uBC29\uD5A5 \uC804\uD658\uC774 \uD544\uC694\uD569\uB2C8\uB2E4.",
    descTitle3: "\uC774 \uAC8C\uC784\uC774 \uC7AC\uBBF8\uC788\uB294 \uC774\uC720",
    descBody3:
      "\uADDC\uCE59\uC740 \uB2E8\uC21C\uD558\uC9C0\uB9CC \uCDA9\uBD84\uD55C \uB3C4\uC804 \uC694\uC18C\uAC00 \uC788\uC5B4 \uBAB0\uC785\uAC10\uC774 \uB192\uC2B5\uB2C8\uB2E4. \uD55C \uD310\uC774 \uC9E7\uC544 \uBC18\uBCF5 \uD50C\uB808\uC774\uC5D0 \uC801\uD569\uD558\uACE0, \uD53C\uB4DC\uBC31\uC774 \uBA85\uD655\uD574\uC11C \uCC98\uC74C \uD558\uB294 \uD50C\uB808\uC774\uC5B4\uC640 \uC219\uB828\uB41C \uD50C\uB808\uC774\uC5B4 \uBAA8\uB450 \uC990\uAE38 \uC218 \uC788\uC2B5\uB2C8\uB2E4.",
    ariaDescription: "\uC2A4\uB124\uC774\uD06C \uAC8C\uC784 \uC124\uBA85",
  },
};

export const mountSnakeGame = (host: HTMLElement, locale: Locale) => {
  const text = textByLocale[locale];

  host.innerHTML = `
    <section class="snake-layout">
      <h2>${text.title}</h2>
      <div class="snake-hud">
        <p id="score">${text.score}: 0</p>
        <p id="best">${text.best}: 0</p>
      </div>
      <div class="speed-controls" role="group" aria-label="${text.speed}">
        <span>${text.speed}</span>
        <button type="button" data-speed="slow">${text.speedSlow}</button>
        <button type="button" data-speed="normal">${text.speedNormal}</button>
        <button type="button" data-speed="fast">${text.speedFast}</button>
      </div>
      <div class="snake-board-wrap">
        <canvas id="board" width="${BOARD_SIZE}" height="${BOARD_SIZE}" aria-label="Snake game board"></canvas>
        <div id="joystick" class="joystick" hidden aria-hidden="true">
          <div class="joystick-base"></div>
          <div class="joystick-knob"></div>
        </div>
        <div id="game-over-overlay" class="snake-overlay" hidden>
          <p class="snake-overlay-title">${text.gameOver}</p>
          <p class="snake-overlay-text">${text.finalScore}: <span id="final-score">0</span></p>
          <button id="restart" type="button">${text.restart}</button>
        </div>
      </div>
      <p class="snake-help">${text.help}</p>
      <section class="game-description" aria-label="${text.ariaDescription}">
        <h3>${text.descTitle1}</h3>
        <p>${text.descBody1}</p>
        <h3>${text.descTitle2}</h3>
        <p>${text.descBody2}</p>
        <h3>${text.descTitle3}</h3>
        <p>${text.descBody3}</p>
      </section>
    </section>
  `;

  const canvas = host.querySelector<HTMLCanvasElement>("#board");
  const scoreEl = host.querySelector<HTMLParagraphElement>("#score");
  const bestEl = host.querySelector<HTMLParagraphElement>("#best");
  const finalScoreEl = host.querySelector<HTMLSpanElement>("#final-score");
  const overlayEl = host.querySelector<HTMLDivElement>("#game-over-overlay");
  const restartBtn = host.querySelector<HTMLButtonElement>("#restart");
  const boardWrapEl = host.querySelector<HTMLDivElement>(".snake-board-wrap");
  const joystickEl = host.querySelector<HTMLDivElement>("#joystick");
  const joystickKnobEl = host.querySelector<HTMLDivElement>(".joystick-knob");
  const speedButtons = Array.from(
    host.querySelectorAll<HTMLButtonElement>(".speed-controls button[data-speed]"),
  );

  if (
    !canvas ||
    !scoreEl ||
    !bestEl ||
    !finalScoreEl ||
    !overlayEl ||
    !restartBtn ||
    !boardWrapEl ||
    !joystickEl ||
    !joystickKnobEl ||
    speedButtons.length !== 3
  ) {
    throw new Error("Snake game elements are missing.");
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Could not initialize canvas context.");
  }

  let snake: Point[] = [];
  let direction: Point = { x: 1, y: 0 };
  let nextDirection: Point = { x: 1, y: 0 };
  let food: Point = { x: 0, y: 0 };
  let score = 0;
  let best = 0;
  let gameOver = false;
  let timerId: number | null = null;
  let heading: Point = { x: 1, y: 0 };
  let speedLevel: SpeedLevel = "normal";
  let joystickPointerId: number | null = null;
  let joystickOrigin: Point | null = null;

  const pointCenter = (point: Point) => ({
    x: point.x * CELL_SIZE + CELL_SIZE / 2,
    y: point.y * CELL_SIZE + CELL_SIZE / 2,
  });

  const drawFood = (point: Point) => {
    const cx = point.x * CELL_SIZE + CELL_SIZE / 2;
    const cy = point.y * CELL_SIZE + CELL_SIZE / 2;
    const radius = CELL_SIZE * 0.42;

    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "rgba(255,255,255,0.45)";
    ctx.beginPath();
    ctx.arc(cx - radius * 0.35, cy - radius * 0.25, radius * 0.32, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#22c55e";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy - radius - 1);
    ctx.lineTo(cx + 3, cy - radius - 7);
    ctx.stroke();
  };

  const drawSnake = () => {
    if (snake.length === 0) return;

    const headCenter = pointCenter(snake[0]);
    const bodyPoints = snake.slice(1).reverse().map(pointCenter);
    bodyPoints.push(headCenter);

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.lineWidth = CELL_SIZE * 0.28;
    ctx.strokeStyle = "rgba(148, 163, 184, 0.55)";
    ctx.beginPath();
    ctx.moveTo(bodyPoints[0].x, bodyPoints[0].y);
    for (let i = 1; i < bodyPoints.length; i += 1) {
      ctx.lineTo(bodyPoints[i].x, bodyPoints[i].y);
    }
    ctx.stroke();

    ctx.lineWidth = CELL_SIZE * 0.84;
    ctx.strokeStyle = "#16a34a";
    ctx.beginPath();
    ctx.moveTo(bodyPoints[0].x, bodyPoints[0].y);
    for (let i = 1; i < bodyPoints.length; i += 1) {
      ctx.lineTo(bodyPoints[i].x, bodyPoints[i].y);
    }
    ctx.stroke();

    const head = headCenter;
    const angle = Math.atan2(heading.y, heading.x);
    ctx.save();
    ctx.translate(head.x, head.y);
    ctx.rotate(angle);

    ctx.fillStyle = "#22c55e";
    ctx.beginPath();
    ctx.arc(0, 0, CELL_SIZE * 0.42, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#052e2b";
    ctx.beginPath();
    ctx.arc(CELL_SIZE * 0.12, -CELL_SIZE * 0.12, 2.2, 0, Math.PI * 2);
    ctx.arc(CELL_SIZE * 0.12, CELL_SIZE * 0.12, 2.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  };

  const draw = () => {
    const boardGradient = ctx.createLinearGradient(0, 0, BOARD_SIZE, BOARD_SIZE);
    boardGradient.addColorStop(0, "#0b1220");
    boardGradient.addColorStop(1, "#111827");
    ctx.fillStyle = boardGradient;
    ctx.fillRect(0, 0, BOARD_SIZE, BOARD_SIZE);

    for (let y = 0; y < GRID_SIZE; y += 1) {
      for (let x = 0; x < GRID_SIZE; x += 1) {
        ctx.fillStyle =
          (x + y) % 2 === 0 ? "rgba(148, 163, 184, 0.1)" : "rgba(148, 163, 184, 0.055)";
        ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
    }

    drawFood(food);
    drawSnake();
  };

  const updateHud = () => {
    scoreEl.textContent = `${text.score}: ${score}`;
    bestEl.textContent = `${text.best}: ${best}`;
  };

  const updateSpeedButtons = () => {
    speedButtons.forEach((button) => {
      const buttonSpeed = button.dataset.speed as SpeedLevel | undefined;
      button.classList.toggle("active", buttonSpeed === speedLevel);
    });
  };

  const randomFood = (): Point => {
    while (true) {
      const candidate = {
        x: Math.floor(Math.random() * (GRID_SIZE - FOOD_PADDING * 2)) + FOOD_PADDING,
        y: Math.floor(Math.random() * (GRID_SIZE - FOOD_PADDING * 2)) + FOOD_PADDING,
      };
      const overlapsSnake = snake.some(
        (segment) => segment.x === candidate.x && segment.y === candidate.y,
      );
      if (!overlapsSnake) return candidate;
    }
  };

  const endGame = () => {
    gameOver = true;
    finalScoreEl.textContent = `${score}`;
    overlayEl.hidden = false;
    if (timerId !== null) {
      window.clearInterval(timerId);
      timerId = null;
    }
  };

  const startTickTimer = () => {
    if (timerId !== null) window.clearInterval(timerId);
    timerId = window.setInterval(tick, SPEED_TICK_MS[speedLevel]);
  };

  const tick = () => {
    if (gameOver) return;

    direction = nextDirection;
    heading = direction;
    const head = snake[0];
    const newHead = { x: head.x + direction.x, y: head.y + direction.y };

    const hitWall =
      newHead.x < 0 ||
      newHead.x >= GRID_SIZE ||
      newHead.y < 0 ||
      newHead.y >= GRID_SIZE;
    const willEatFood = newHead.x === food.x && newHead.y === food.y;
    const bodyToCheck = willEatFood ? snake : snake.slice(0, -1);
    const hitSelf = bodyToCheck.some(
      (segment) => segment.x === newHead.x && segment.y === newHead.y,
    );

    if (hitWall || hitSelf) {
      endGame();
      return;
    }

    snake.unshift(newHead);

    if (willEatFood) {
      score += 1;
      best = Math.max(best, score);
      food = randomFood();
    } else {
      snake.pop();
    }

    updateHud();
    draw();
  };

  const setDirection = (candidate: Point) => {
    const isOpposite = direction.x + candidate.x === 0 && direction.y + candidate.y === 0;
    if (!isOpposite) nextDirection = candidate;
  };

  const setDirectionByName = (dir: DirectionName) => {
    if (dir === "up") setDirection({ x: 0, y: -1 });
    if (dir === "down") setDirection({ x: 0, y: 1 });
    if (dir === "left") setDirection({ x: -1, y: 0 });
    if (dir === "right") setDirection({ x: 1, y: 0 });
  };

  const updateDirectionByDelta = (dx: number, dy: number) => {
    const threshold = 14;
    if (Math.abs(dx) < threshold && Math.abs(dy) < threshold) return;
    if (Math.abs(dx) > Math.abs(dy)) {
      setDirectionByName(dx > 0 ? "right" : "left");
    } else {
      setDirectionByName(dy > 0 ? "down" : "up");
    }
  };

  const moveJoystickKnob = (dx: number, dy: number) => {
    const radius = 34;
    const distance = Math.hypot(dx, dy);
    const scale = distance > radius ? radius / distance : 1;
    joystickKnobEl.style.transform = `translate(${dx * scale}px, ${dy * scale}px)`;
  };

  const showJoystick = (x: number, y: number) => {
    joystickEl.hidden = false;
    joystickEl.style.left = `${x}px`;
    joystickEl.style.top = `${y}px`;
    joystickKnobEl.style.transform = "translate(0, 0)";
  };

  const hideJoystick = () => {
    joystickEl.hidden = true;
    joystickKnobEl.style.transform = "translate(0, 0)";
    joystickPointerId = null;
    joystickOrigin = null;
  };

  const pointFromClient = (clientX: number, clientY: number): Point => {
    const rect = boardWrapEl.getBoundingClientRect();
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const handleKeydown = (event: KeyboardEvent) => {
    const key = event.key.toLowerCase();

    if (gameOver && (key === "enter" || key === " " || event.code === "Space")) {
      event.preventDefault();
      startGame();
      return;
    }

    if (
      [
        "arrowup",
        "arrowdown",
        "arrowleft",
        "arrowright",
        "w",
        "a",
        "s",
        "d",
      ].includes(key)
    ) {
      event.preventDefault();
    }

    if (key === "arrowup" || key === "w") setDirectionByName("up");
    if (key === "arrowdown" || key === "s") setDirectionByName("down");
    if (key === "arrowleft" || key === "a") setDirectionByName("left");
    if (key === "arrowright" || key === "d") setDirectionByName("right");
  };

  const startGame = () => {
    snake = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 },
    ];
    direction = { x: 1, y: 0 };
    nextDirection = { x: 1, y: 0 };
    score = 0;
    gameOver = false;
    heading = { x: 1, y: 0 };
    food = randomFood();
    overlayEl.hidden = true;
    updateHud();
    updateSpeedButtons();
    draw();
    startTickTimer();
  };

  const handleRestart = () => startGame();

  const handleSpeedChange = (event: Event) => {
    const button = event.currentTarget as HTMLButtonElement;
    const nextSpeed = button.dataset.speed as SpeedLevel | undefined;
    if (!nextSpeed) return;

    speedLevel = nextSpeed;
    updateSpeedButtons();
    if (!gameOver) startTickTimer();
  };

  const handlePointerDown = (event: PointerEvent) => {
    if (gameOver) return;
    joystickPointerId = event.pointerId;
    joystickOrigin = pointFromClient(event.clientX, event.clientY);
    showJoystick(joystickOrigin.x, joystickOrigin.y);
    boardWrapEl.setPointerCapture(event.pointerId);
    event.preventDefault();
  };

  const handlePointerMove = (event: PointerEvent) => {
    if (joystickPointerId !== event.pointerId || !joystickOrigin) return;
    const current = pointFromClient(event.clientX, event.clientY);
    const dx = current.x - joystickOrigin.x;
    const dy = current.y - joystickOrigin.y;
    moveJoystickKnob(dx, dy);
    updateDirectionByDelta(dx, dy);
    event.preventDefault();
  };

  const handlePointerUp = (event: PointerEvent) => {
    if (joystickPointerId !== event.pointerId) return;
    if (boardWrapEl.hasPointerCapture(event.pointerId)) {
      boardWrapEl.releasePointerCapture(event.pointerId);
    }
    hideJoystick();
  };

  window.addEventListener("keydown", handleKeydown);
  restartBtn.addEventListener("click", handleRestart);
  speedButtons.forEach((button) => button.addEventListener("click", handleSpeedChange));
  boardWrapEl.addEventListener("pointerdown", handlePointerDown);
  boardWrapEl.addEventListener("pointermove", handlePointerMove);
  boardWrapEl.addEventListener("pointerup", handlePointerUp);
  boardWrapEl.addEventListener("pointercancel", handlePointerUp);

  startGame();

  return () => {
    if (timerId !== null) window.clearInterval(timerId);
    window.removeEventListener("keydown", handleKeydown);
    restartBtn.removeEventListener("click", handleRestart);
    speedButtons.forEach((button) => button.removeEventListener("click", handleSpeedChange));
    boardWrapEl.removeEventListener("pointerdown", handlePointerDown);
    boardWrapEl.removeEventListener("pointermove", handlePointerMove);
    boardWrapEl.removeEventListener("pointerup", handlePointerUp);
    boardWrapEl.removeEventListener("pointercancel", handlePointerUp);
  };
};
