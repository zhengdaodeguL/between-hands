import { colors } from "../theme/tokens";

/** Local developer capture. Frames come exclusively from the live renderer canvas. */
export function createCapture(source: HTMLCanvasElement): { dispose(): void } {
  const toolbar = document.createElement("aside");
  toolbar.setAttribute("aria-label", "Developer emulator capture");
  Object.assign(toolbar.style, {
    position: "fixed",
    top: "80px",
    right: "12px",
    zIndex: "2147483647",
    display: "grid",
    gap: "7px",
    padding: "12px",
    width: "224px",
    color: colors.text,
    background: colors.captureBackground,
    border: `1px solid ${colors.rain}`,
    borderRadius: "10px",
    font: "13px sans-serif",
    pointerEvents: "auto",
  });
  const title = document.createElement("strong");
  title.textContent = "Developer · emulator capture";
  const status = document.createElement("output");
  status.setAttribute("aria-live", "polite");
  status.textContent = "Local, silent video · max 175 s";
  const record = document.createElement("button");
  record.textContent = "Record XR demo";
  const stop = document.createElement("button");
  stop.textContent = "Stop recording";
  stop.disabled = true;
  const still = document.createElement("button");
  still.textContent = "Capture screenshot";
  const downloads = document.createElement("div");
  toolbar.append(title, status, record, stop, still, downloads);
  document.body.append(toolbar);
  const canvas = document.createElement("canvas");
  canvas.width = 1280;
  canvas.height = 720;
  const context = canvas.getContext("2d");
  const video = document.createElement("video");
  video.muted = true;
  video.playsInline = true;
  let sourceStream: MediaStream | undefined;
  let outputStream: MediaStream | undefined;
  let recorder: MediaRecorder | undefined;
  let raf = 0;
  let startedAt = 0;
  let disposed = false;
  let preparing = false;
  let maximumTimer: ReturnType<typeof setTimeout> | undefined;
  const urls = new Set<string>();
  function fail(error: unknown): void {
    status.textContent =
      "Capture error: " +
      (error instanceof Error ? error.message : String(error));
  }
  function paint(): void {
    if (disposed || !context) return;
    if (
      video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA &&
      video.videoWidth > 0
    ) {
      context.fillStyle = colors.background;
      context.fillRect(0, 0, 1280, 720);
      const scale = Math.min(1280 / video.videoWidth, 720 / video.videoHeight);
      const width = video.videoWidth * scale,
        height = video.videoHeight * scale;
      context.drawImage(
        video,
        (1280 - width) / 2,
        (720 - height) / 2,
        width,
        height,
      );
      context.fillStyle = colors.captureLabelBackground;
      context.fillRect(18, 18, 480, 42);
      context.fillStyle = colors.text;
      context.font = "20px sans-serif";
      context.fillText("IWER emulator · actual gameplay · silent", 30, 46);
    }
    if (recorder?.state === "recording") {
      const seconds = Math.min(
        175,
        Math.floor((performance.now() - startedAt) / 1000),
      );
      status.textContent = `XR emulator capture · ${seconds} / 175 s`;
    }
    raf = requestAnimationFrame(paint);
  }

  async function prepare(): Promise<void> {
    if (!context) throw new Error("2D composition is unavailable.");
    if (typeof source.captureStream !== "function")
      throw new Error("Canvas captureStream is unavailable in this browser.");
    if (sourceStream) return;
    sourceStream = source.captureStream(30);
    if (!sourceStream.getVideoTracks().length)
      throw new Error("The renderer did not provide a live video track.");
    video.srcObject = sourceStream;
    await video.play();
    if (disposed) {
      sourceStream.getTracks().forEach((track) => track.stop());
      return;
    }
    paint();
  }
  function addDownload(blob: Blob, filename: string, label: string): void {
    if (disposed) return;
    const url = URL.createObjectURL(blob);
    urls.add(url);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.textContent = label;
    Object.assign(link.style, {
      color: colors.rain,
      display: "block",
      padding: "5px 0",
    });
    downloads.append(link);
    const save = document.createElement("button");
    const isVideo = filename.endsWith(".webm");
    save.textContent = isVideo
      ? "Save demo to project"
      : "Save screenshot to project";
    save.addEventListener("click", async () => {
      save.disabled = true;
      try {
        const result = await fetch(
          `/__between-hands-capture/${isVideo ? "demo.webm" : "screenshot.png"}`,
          {
            method: "POST",
            headers: { "Content-Type": isVideo ? "video/webm" : "image/png" },
            body: blob,
            credentials: "same-origin",
            redirect: "error",
          },
        );
        const saved = (await result.json()) as {
          filename?: string;
          error?: string;
        };
        if (!result.ok || !saved.filename)
          throw new Error(saved.error ?? "Local save failed.");
        status.textContent = `Saved locally: ${saved.filename}`;
        save.textContent = "Saved to project";
      } catch (error) {
        fail(error);
        save.disabled = false;
      }
    });
    downloads.append(save);
  }
  function stopRecording(): void {
    if (maximumTimer !== undefined) clearTimeout(maximumTimer);
    maximumTimer = undefined;
    if (recorder?.state === "recording") recorder.stop();
    stop.disabled = true;
  }
  record.addEventListener("click", async () => {
    if (preparing || recorder?.state === "recording") return;
    preparing = true;
    record.disabled = true;
    try {
      if (typeof MediaRecorder === "undefined")
        throw new Error("MediaRecorder is unavailable.");
      const mimeType = [
        "video/webm;codecs=vp9",
        "video/webm;codecs=vp8",
        "video/webm",
      ].find((type) => MediaRecorder.isTypeSupported(type));
      if (!mimeType) throw new Error("No supported WebM recorder codec.");
      await prepare();
      if (disposed) return;
      outputStream = canvas.captureStream(30);
      recorder = new MediaRecorder(outputStream, {
        mimeType,
        videoBitsPerSecond: 6_000_000,
      });
      const chunks: Blob[] = [];
      recorder.addEventListener("dataavailable", (event) => {
        if (event.data.size) chunks.push(event.data);
      });
      recorder.addEventListener("error", () => {
        fail("The browser recorder failed.");
        stopRecording();
      });
      recorder.addEventListener("stop", () => {
        outputStream?.getTracks().forEach((track) => track.stop());
        if (disposed) return;
        const blob = new Blob(chunks, { type: mimeType });
        if (blob.size) {
          addDownload(blob, "demo.webm", "Download demo.webm");
          status.textContent = "Recording ready. Download and inspect it.";
        } else fail("The recording contained no video data.");
        record.disabled = false;
      });
      startedAt = performance.now();
      recorder.start(1000);
      stop.disabled = false;
      status.textContent = "XR emulator capture · 0 / 175 s";
      maximumTimer = setTimeout(stopRecording, 175_000);
    } catch (error) {
      fail(error);
      record.disabled = false;
    } finally {
      preparing = false;
    }
  });
  stop.addEventListener("click", stopRecording);
  still.addEventListener("click", async () => {
    still.disabled = true;
    try {
      await prepare();
      await new Promise<void>((resolve) =>
        requestAnimationFrame(() => resolve()),
      );
      if (disposed) return;
      if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA)
        throw new Error("No live renderer frame is available yet. Try again.");
      canvas.toBlob((blob) => {
        if (blob)
          addDownload(
            blob,
            "between-hands-emulator.png",
            "Download screenshot",
          );
        else fail("Screenshot encoding failed.");
      }, "image/png");
    } catch (error) {
      fail(error);
    } finally {
      still.disabled = false;
    }
  });
  return {
    dispose(): void {
      disposed = true;
      stopRecording();
      cancelAnimationFrame(raf);
      sourceStream?.getTracks().forEach((track) => track.stop());
      outputStream?.getTracks().forEach((track) => track.stop());
      video.pause();
      video.srcObject = null;
      urls.forEach((url) => URL.revokeObjectURL(url));
      toolbar.remove();
    },
  };
}
