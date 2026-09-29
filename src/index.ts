import {
  World,
  createSystem,
  Color,
  HemisphereLight,
  DirectionalLight,
  Group,
  Vector3,
  CanvasTexture,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  RayInteractable,
  VisibilityState,
} from "@iwsdk/core";
import projectOptions from "virtual:iwsdk-project";
import { createGarden } from "./scene/garden";
import { createMenu } from "./scene/menu";
import { createHandInput } from "./input/hands";
import { LEVELS } from "./levels/levels";
import {
  createProgress,
  evaluatePath,
  stepProgress,
  CONTROL_BOUNDS,
  type Controls,
  type Vec3,
} from "./game/puzzle";
import { colors } from "./theme/tokens";
import "./ui/style.css";
type Mode = "ready" | "playing" | "paused" | "complete" | "finished";
const el = <T extends HTMLElement = HTMLElement>(id: string) =>
  document.getElementById(id) as T;
Object.entries(colors).forEach(([k, v]) =>
  document.documentElement.style.setProperty("--" + k, v),
);
let index = 0,
  mode: Mode = "ready",
  controls: Controls = structuredClone(LEVELS[0].initialControls),
  progress = createProgress(),
  time = 0;
let muted = false,
  quiet = matchMedia("(prefers-reduced-motion: reduce)").matches,
  desktop = false,
  dirty = true;
let evaluation = evaluatePath(LEVELS[0], controls),
  world: World,
  input: ReturnType<typeof createHandInput>,
  audio: AudioContext | undefined;
let panel: ReturnType<typeof createMenu>;
const garden = createGarden(),
  stage = new Group();
stage.name = "Between Hands";
stage.scale.setScalar(0.75);
stage.add(garden.root);
const canvas = document.createElement("canvas");
canvas.width = 1280;
canvas.height = 280;
const ctx = canvas.getContext("2d", { alpha: true })!,
  texture = new CanvasTexture(canvas);
const caption = new Mesh(
  new PlaneGeometry(0.59, 0.129),
  new MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false }),
);
caption.position.set(0, 0.34, 0);
stage.add(caption);
let lastCaption = "";
let lastUIDiagnosticAt = 0;
const beginEvents: { type: string; at: number }[] = [];
function getUIDiagnostics() {
  const pointer = world.input.xr.multiPointers.left;
  const intersection = pointer.getActivePointer()?.getIntersection();
  const path: { name: string; type: string }[] = [];
  let object = intersection?.object ?? null;
  while (object) {
    path.push({ name: object.name, type: object.type });
    object = object.parent;
  }
  const begin = panel?.getElementById("begin");
  return {
    left: {
      kind: pointer.getActiveKind(),
      intersection: intersection
        ? {
            path,
            point: intersection.point.toArray(),
            distance: intersection.distance,
          }
        : null,
    },
    begin: begin
      ? {
          name: begin.name,
          size: begin.size.value,
          relativeCenter: begin.relativeCenter.value,
          worldPos: begin.getWorldPosition(new Vector3()).toArray(),
          worldScale: begin.getWorldScale(new Vector3()).toArray(),
          globalPanelMatrix: begin.globalPanelMatrix.value?.toArray(),
          visible: begin.isVisible.value,
          clipped: begin.isClipped.value,
          hovered: begin.hoveredList.value,
          active: begin.activeList.value,
        }
      : null,
    panel: panel
      ? {
          worldPos: panel.getWorldPosition(new Vector3()).toArray(),
          worldScale: panel.getWorldScale(new Vector3()).toArray(),
        }
      : null,
    events: beginEvents,
  };
}
let recenterPending = false;
const domEvents = new AbortController();
caption.visible = false;
function save() {
  try {
    localStorage.setItem(
      "between-hands-v1",
      JSON.stringify({ index, controls, muted, quiet, mode }),
    );
  } catch {}
}
function sliders() {
  for (const side of ["left", "right"] as const) {
    for (let a = 0; a < 3; a++) {
      const slider = el<HTMLInputElement>(side + "-" + a);
      slider.value = String(controls[side][a]);
      el(side + "-" + a + "-value").textContent =
        Math.round(controls[side][a] * 100) + " cm";
    }
  }
}
function sync() {
  const level = LEVELS[index];
  el("chapter").textContent = "CHAPTER 0" + (index + 1) + " / 03";
  el("level-title").textContent =
    mode === "finished" ? "A garden, brought to life." : level.title;
  el("instruction").textContent = level.instruction.replace(
    /rain ring/g,
    "rain orb",
  );
  el("start").textContent =
    mode === "finished"
      ? "Plant a new beginning"
      : mode === "complete"
        ? "Next chapter"
        : mode === "paused"
          ? "Resume the rain"
          : mode === "playing"
            ? "Garden in progress"
            : "Begin this chapter";
  el<HTMLButtonElement>("start").disabled = mode === "playing";
  el<HTMLButtonElement>("pause").disabled = [
    "ready",
    "complete",
    "finished",
  ].includes(mode);
  el("pause").textContent = mode === "paused" ? "Resume" : "Pause";
  el("mute").textContent = muted ? "Sound off" : "Sound on";
  el("quiet").textContent = quiet ? "Gentle motion on" : "Gentle motion off";
  document.body.dataset.mode = mode;
  sliders();
}
function setLevel(n: number, c?: Controls) {
  index = n;
  controls = c ?? structuredClone(LEVELS[n].initialControls);
  mode = "ready";
  time = 0;
  progress = createProgress();
  dirty = true;
  garden.setLevel(LEVELS[n]);
  garden.setCompleted(false);
  input?.reset();
  sync();
  save();
}
function start() {
  if (mode === "finished") {
    setLevel(0);
    return;
  }
  if (mode === "complete") {
    setLevel(index + 1);
    return;
  }
  if (mode === "ready" || mode === "paused") {
    mode = "playing";
    input?.reset();
    try {
      audio ??= new AudioContext();
      void audio.resume();
    } catch {}
    sync();
  }
}
function pause() {
  if (mode === "playing") {
    mode = "paused";
    input?.reset();
    save();
  } else if (mode === "paused") start();
  sync();
}
function change(side: "left" | "right", p: Vec3) {
  if (mode !== "playing") return;
  controls = { ...controls, [side]: p };
  dirty = true;
  sliders();
}
function recenter() {
  if (world?.renderer.xr.isPresenting) {
    const p = world.player.head.getWorldPosition(new Vector3()),
      f = world.camera.getWorldDirection(new Vector3());
    f.y = 0;
    f.normalize();
    stage.position.copy(p).addScaledVector(f, 0.47);
    stage.position.y = p.y - 0.2;
    stage.rotation.y = Math.atan2(-f.x, -f.z);
  } else {
    stage.position.set(0, 1.1, -0.5);
    stage.rotation.set(0, 0, 0);
  }
  stage.updateMatrixWorld(true);
  input?.reset();
}
function chime() {
  if (muted || !audio) return;
  for (const [i, f] of [392, 523.25, 659.25].entries()) {
    const osc = audio.createOscillator(),
      g = audio.createGain(),
      t = audio.currentTime + i * 0.14;
    osc.frequency.value = f;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.06, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.8);
    osc.connect(g);
    g.connect(audio.destination);
    osc.start(t);
    osc.stop(t + 0.85);
  }
}
function draw(text: string) {
  const key = index + mode + text;
  if (key === lastCaption) return;
  lastCaption = key;
  ctx.clearRect(0, 0, 1280, 280);
  ctx.textAlign = "center";
  ctx.fillStyle = colors.text;
  ctx.font = "500 30px sans-serif";
  ctx.fillText("BETWEEN HANDS  /  " + (index + 1) + " / 3", 640, 40);
  ctx.font = "600 58px sans-serif";
  ctx.fillText(
    mode === "finished" ? "Your garden is alive." : LEVELS[index].title,
    640,
    112,
  );
  ctx.fillStyle = colors.rain;
  ctx.font = "32px sans-serif";
  let line = "",
    y = 179;
  for (const word of text.split(" ")) {
    if (ctx.measureText(line + word).width > 1170) {
      ctx.fillText(line, 640, y);
      line = "";
      y += 41;
    }
    line += word + " ";
  }
  ctx.fillText(line, 640, y);
  texture.needsUpdate = true;
}
class GardenSystem extends createSystem({}) {
  update(delta: number) {
    if (!input) return;
    const xr = world.renderer.xr.isPresenting,
      visible =
        !document.hidden &&
        (!xr || world.visibilityState.value === VisibilityState.Visible);
    if (dirty) {
      evaluation = evaluatePath(LEVELS[index], controls);
      dirty = false;
    }
    const active =
      mode === "playing" &&
      visible &&
      (xr
        ? input.tracked.left &&
          input.tracked.right &&
          input.held.left &&
          input.held.right
        : desktop);
    if (active) time += Math.min(delta, 0.1);
    if (mode === "playing")
      progress = stepProgress(
        progress,
        Math.min(delta, 0.1),
        evaluation.valid,
        active,
      );
    if (progress.complete && mode === "playing") {
      mode = index === 2 ? "finished" : "complete";
      garden.setCompleted(true);
      chime();
      save();
      sync();
    }
    const text =
      mode === "ready"
        ? "Choose Begin. Then pinch the round and diamond handles."
        : mode === "paused"
          ? "Rain paused. Your path is safe."
          : mode === "complete"
            ? "Beautiful. Choose Next to grow another chapter."
            : mode === "finished"
              ? "Three small storms. One living garden."
              : xr && (!input.tracked.left || !input.tracked.right)
                ? "Bring both hands into view."
                : xr && (!input.held.left || !input.held.right)
                  ? "Pinch and hold both handles. Guide rain through the glowing orbs."
                  : evaluation.reason.replace(/rain ring/g, "rain orb");
    el("status").textContent = text;
    el<HTMLProgressElement>("growth").value = progress.holdSeconds / 2;
    el("tracking").textContent = xr
      ? "Hands: " +
        (input.tracked.left ? "L ✓" : "L —") +
        " / " +
        (input.tracked.right ? "R ✓" : "R —")
      : desktop
        ? "Desktop rehearsal · not hand tracking"
        : "Choose immersive VR or desktop rehearsal";
    if (import.meta.env.DEV) {
      const now = performance.now();
      if (now - lastUIDiagnosticAt >= 1000) {
        lastUIDiagnosticAt = now;
        el("tracking").dataset.uiDiagnostics =
          JSON.stringify(getUIDiagnostics());
      }
      el("tracking").dataset.handDiagnostics = JSON.stringify({
        left: { ...input.diagnostics.left, held: input.held.left },
        right: { ...input.diagnostics.right, held: input.held.right },
      });
    }
    garden.update(
      controls,
      evaluation,
      progress.holdSeconds / 2,
      quiet ? 0 : time,
    );
    draw(text);
  }
}
async function boot() {
  world = await World.create(el("scene-container"), projectOptions);
  world.scene.background = new Color(colors.background);
  world.scene.add(new HemisphereLight(0xf3ebdd, 0x183529, 2.5));
  const light = new DirectionalLight(0xffe0b0, 3);
  light.position.set(1, 3, 2);
  world.scene.add(light);
  const stageEntity = world.createTransformEntity(stage, { persistent: true });
  recenter();
  world.camera.position.set(0, 1.4, 0.32);
  world.camera.lookAt(0, 1.13, -0.5);
  world.camera.updateProjectionMatrix();
  input = createHandInput(world, stage, () => controls, change);
  panel = createMenu();
  panel.document.setTargetDimensions(0.58, 0.075);
  panel.scale.setScalar(1 / 0.75);
  panel.position.set(0, 0.46, 0.02);
  world
    .createTransformEntity(panel, { parent: stageEntity, persistent: true })
    .addComponent(RayInteractable);
  panel.visible = false;

  for (const [id, fn] of Object.entries({
    begin: start,
    pause,
    reset: () => setLevel(index),
    center: recenter,
    sound: () => {
      muted = !muted;
      sync();
      save();
    },
    exit: () => world.exitXR(),
  }))
    panel.requireElementById(id).addEventListener("pointerdown", () => { fn(); if (import.meta.env.DEV) { beginEvents.push({ type: id + ":" + mode, at: performance.now() }); } });
  const sessionStarted = () => {
    desktop = false;
    el("desktop-controls").hidden = true;
    recenterPending = true;
    caption.visible = true;
    panel.visible = true;
    if (mode === "playing") pause();
  };
  world.renderer.xr.addEventListener("sessionstart", sessionStarted);
  const stopRecenterFrame = world.onXRFrame(() => {
    if (recenterPending) {
      recenterPending = false;
      recenter();
    }
  });
  const sessionEnded = () => {
    if (mode === "playing") pause();
    desktop = false;
    recenterPending = false;
    caption.visible = false;
    panel.visible = false;
    recenter();
  };
  world.renderer.xr.addEventListener("sessionend", sessionEnded);
  const stopVisibility = world.visibilityState.subscribe((v) => {
    if (
      (v === VisibilityState.Hidden || v === VisibilityState.VisibleBlurred) &&
      mode === "playing"
    )
      pause();
  });
  document.addEventListener(
    "visibilitychange",
    () => {
      if (document.hidden && mode === "playing") pause();
    },
    { signal: domEvents.signal },
  );
  el("enter-xr").addEventListener("click", () => world.launchXR(), {
    signal: domEvents.signal,
  });
  el("desktop").addEventListener(
    "click",
    () => {
      desktop = true;
      el("desktop-controls").hidden = false;
      el("desktop").textContent = "Desktop rehearsal open";
    },
    { signal: domEvents.signal },
  );
  for (const [id, fn] of Object.entries({
    start,
    pause,
    reset: () => setLevel(index),
    recenter,
    mute: () => {
      muted = !muted;
      sync();
      save();
    },
    quiet: () => {
      quiet = !quiet;
      sync();
      save();
    },
  }))
    el(id).addEventListener("click", fn, { signal: domEvents.signal });
  for (const side of ["left", "right"] as const)
    for (let a = 0; a < 3; a++) {
      const slider = el<HTMLInputElement>(side + "-" + a);
      slider.min = String(CONTROL_BOUNDS.min[a]);
      slider.max = String(CONTROL_BOUNDS.max[a]);
      slider.addEventListener(
        "input",
        () => {
          const p = [...controls[side]] as [number, number, number];
          p[a] = Number(slider.value);
          change(side, p);
          save();
        },
        { signal: domEvents.signal },
      );
    }
  let saved;
  try {
    saved = JSON.parse(localStorage.getItem("between-hands-v1") ?? "null");
  } catch {}
  muted = Boolean(saved?.muted);
  quiet = Boolean(saved?.quiet ?? quiet);
  const n =
    Number.isInteger(saved?.index) && saved.index >= 0 && saved.index < 3
      ? saved.index
      : 0;
  let restored: Controls | undefined;
  try {
    if (
      saved?.controls &&
      evaluatePath(LEVELS[n], saved.controls).reason !==
        "Bring both hands back into the garden."
    )
      restored = saved.controls;
  } catch {}
  setLevel(n, restored);
  if (
    restored &&
    evaluatePath(LEVELS[n], restored).valid &&
    (saved?.mode === "complete" || saved?.mode === "finished")
  ) {
    mode = n === LEVELS.length - 1 ? "finished" : "complete";
    progress = { holdSeconds: 2, complete: true };
    garden.setCompleted(true);
    sync();
    save();
  }
  world.registerSystem(GardenSystem);
  el("loading").hidden = true;
  el("enter-xr").textContent = "Enter immersive VR";
  try {
    if (!(await navigator.xr?.isSessionSupported("immersive-vr"))) {
      el<HTMLButtonElement>("enter-xr").disabled = true;
      el("enter-xr").textContent = "VR requires a compatible browser";
    }
  } catch {
    el("enter-xr").textContent = "VR unavailable here";
  }
  const capture = import.meta.env.DEV
    ? (await import("./ui/capture")).createCapture(world.renderer.domElement)
    : undefined;
  if (import.meta.hot)
    import.meta.hot.dispose(() => {
      capture?.dispose();
      domEvents.abort();
      stopRecenterFrame();
      stopVisibility();
      world.renderer.xr.removeEventListener("sessionstart", sessionStarted);
      world.renderer.xr.removeEventListener("sessionend", sessionEnded);
      input.dispose();
      garden.dispose();
      texture.dispose();
      caption.geometry.dispose();
      caption.material.dispose();
      panel.dispose();
      void audio?.close();
      world.destroy();
    });
}
boot().catch((e) => {
  el("loading").textContent = "The garden could not load. " + String(e);
  console.error(e);
});



