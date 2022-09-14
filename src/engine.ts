export interface KeyState {
  pressed: boolean;
  changed: boolean;
}

export interface Input {
  up: KeyState;
  left: KeyState;
  down: KeyState;
  right: KeyState;

  run: KeyState;
  crouch: KeyState;

  h: KeyState;

  mouse: {
    left: KeyState;
    middle: KeyState;
    right: KeyState;
    x: number;
    y: number;
  };
}

export const init = (
  updateAndRender: (
    ctx: CanvasRenderingContext2D,
    delta: number,
    input: Input,
  ) => void,
) => {
  // === Setup ===
  const canvas = document.querySelector("canvas");
  if (!canvas) throw new Error("Missing canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Missing ctx");

  // === Resize handling ===
  const onResize = () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
  };
  onResize();
  addEventListener("resize", onResize);

  // === Input handling ===

  const initKey = (): KeyState => ({
    pressed: false,
    changed: false,
  });

  const updateKey = (state: KeyState, cur: boolean) => {
    state.changed = cur !== state.pressed;
    state.pressed = cur;
  };

  const input: Input = {
    up: initKey(),
    left: initKey(),
    down: initKey(),
    right: initKey(),

    run: initKey(),
    crouch: initKey(),

    h: initKey(),

    mouse: {
      left: initKey(),
      middle: initKey(),
      right: initKey(),
      x: 0,
      y: 0,
    },
  };

  // === Input handling: Keys ===
  const handleKey = (newState: boolean) => (e: KeyboardEvent) => {
    if (e.key === "w" || e.key === "W" || e.key === "ArrowUp") {
      updateKey(input.up, newState);
    } else if (e.key === "a" || e.key === "A" || e.key === "ArrowLeft") {
      updateKey(input.left, newState);
    } else if (e.key === "s" || e.key === "S" || e.key === "ArrowDown") {
      updateKey(input.down, newState);
    } else if (e.key === "d" || e.key === "D" || e.key === "ArrowRight") {
      updateKey(input.right, newState);
    } else if (e.key === "Shift") {
      updateKey(input.run, newState);
    } else if (e.key === "Control") {
      updateKey(input.crouch, newState);
    } else if (e.key === "h" || e.key === "H") {
      updateKey(input.h, newState);
    }
  };

  addEventListener("keydown", handleKey(true));
  addEventListener("keyup", handleKey(false));

  // === Input handling: Mouse ===
  addEventListener("mousemove", (e) => {
    input.mouse.x = e.clientX;
    input.mouse.y = e.clientY;
  });

  const handleMouse = (newState: boolean) => (e: MouseEvent) => {
    if (e.button === 0) updateKey(input.mouse.left, newState);
    else if (e.button === 1) updateKey(input.mouse.middle, newState);
    else if (e.button === 2) updateKey(input.mouse.right, newState);
  };
  addEventListener("mousedown", handleMouse(true));
  addEventListener("mouseup", handleMouse(false));

  // === Game tick ===
  const loop = (t: number) => {
    const delta = (t - time) / 100;
    time = t;
    updateAndRender(ctx, delta, input);
    requestAnimationFrame(loop);
  };

  let time = 0;
  loop(time);
};
