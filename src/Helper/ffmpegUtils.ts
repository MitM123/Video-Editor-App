import { fetchFile } from "@ffmpeg/util";

let ffmpegInstance: any = null;

export interface WatermarkConfig {
  text: string;
  position?: { x: string; y: string };
  style?: { fontSize?: number; fontColor?: string; opacity?: number };
}

export interface VideoEditConfig {
  inputUrl: string;
  trim?: { startTime: number; duration: number };
  watermark?: { text: string };
  imageOverlay?: { imageUrl: string; position: { x: number; y: number } };
  filters?: { brightness?: number; grayscale?: boolean };
  texts?: Array<{
    content: string;
    position: { x: number; y: number };
    style: { fontSize: number; color: string; fontWeight: string };
  }>;
}

async function getFFmpegInstance() {
  if (ffmpegInstance) return ffmpegInstance;

  try {
    const { FFmpeg } = await import('@ffmpeg/ffmpeg');
    ffmpegInstance = new FFmpeg();
    await ffmpegInstance.load();
    return ffmpegInstance;
  } catch (error) {
    console.error('Failed to load FFmpeg:', error);
    return null;
  }
}

async function cleanupFiles(ffmpeg: any) {
  try {
    await Promise.all([
      ffmpeg.deleteFile("input.mp4"),
      ffmpeg.deleteFile("output.mp4"),
      ffmpeg.deleteFile("overlay.png")
    ]);
  } catch (e) { }
}

async function processWithFFmpeg(inputUrl: string, operations: (ffmpeg: any) => Promise<void>) {
  const ffmpeg = await getFFmpegInstance();
  if (!ffmpeg) throw new Error('FFmpeg not initialized');
  
  ffmpeg.on('log', ({ message }: { message: string }) => {
    console.log('addImageOverlay: FFmpeg log:', message);
  });

  try {
    await cleanupFiles(ffmpeg);
    await ffmpeg.writeFile("input.mp4", await fetchFile(inputUrl));
    await operations(ffmpeg);
    const fileData = await ffmpeg.readFile("output.mp4");
    return new Uint8Array(fileData as ArrayBuffer);
  } finally {
    await cleanupFiles(ffmpeg);
  }
}

export async function addWatermark(inputUrl: string, config: WatermarkConfig) {
  const position = config.position || { x: "(w-text_w)/2", y: "(h-text_h)/2" };
  const style = config.style || { fontSize: 50, fontColor: 'white', opacity: 1 };

  return processWithFFmpeg(inputUrl, async (ffmpeg) => {
    await ffmpeg.writeFile('arial.ttf', await fetchFile(
      'https://raw.githubusercontent.com/ffmpegwasm/testdata/master/arial.ttf'
    ));

    await ffmpeg.exec([
      "-i", "input.mp4",
      "-vf", `drawtext=fontfile=/arial.ttf:text='${config.text}':x=${position.x}:y=${position.y}:fontsize=${style.fontSize}:fontcolor=${style.fontColor}@${style.opacity}`,
      "-c:v", "libx264", "-preset", "ultrafast", "-crf", "28",
      "-c:a", "copy", "-movflags", "+faststart", "output.mp4"
    ]);
  });
}

export async function adjustVideoSpeed(inputUrl: string, speed: number) {
  return processWithFFmpeg(inputUrl, async (ffmpeg) => {
    await ffmpeg.exec([
      "-i", "input.mp4",
      "-filter:v", `setpts=${1 / speed}*PTS`,
      "-c:v", "libx264", "-preset", "ultrafast",
      "-c:a", "copy", "output.mp4"
    ]);
  });
}

export async function trimVideo(inputUrl: string, startTime: number, duration: number) {
  return processWithFFmpeg(inputUrl, async (ffmpeg) => {
    await ffmpeg.exec([
      "-i", "input.mp4",
      "-ss", startTime.toString(), "-t", duration.toString(),
      "-c:v", "libx264", "-preset", "ultrafast", "-crf", "23",
      "-c:a", "copy", "-movflags", "+faststart", "output.mp4"
    ]);
  });
}

export async function addImageOverlay(inputUrl: string, imageUrl: string, position: { x: number, y: number }) {
  return processWithFFmpeg(inputUrl, async (ffmpeg) => {
    await ffmpeg.writeFile("overlay.png", await fetchFile(imageUrl));
    await ffmpeg.exec([
      "-i", "input.mp4", "-i", "overlay.png",
      "-filter_complex", `[1:v]format=rgba[over];[0:v][over]overlay=${position.x}:${position.y}:format=auto`,
      "-c:v", "libx264", "-preset", "fast", "-crf", "23",
      "-c:a", "copy", "-movflags", "+faststart", "output.mp4"
    ]);
  });
}

export async function applyVideoEffect(inputUrl: string, effect: string) {
  const effects: Record<string, string> = {
    grayscale: "colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3",
    sepia: "colorize=hue=30:saturation=50:lightness=0",
    blur: "gblur=sigma=2",
    sharpen: "unsharp=5:5:1:5:5:0",
    brightness: "eq=brightness=0.2",
    contrast: "eq=contrast=1.5",
    saturation: "eq=saturation=2"
  };

  if (!effects[effect.toLowerCase()]) throw new Error(`Unsupported effect: ${effect}`);

  return processWithFFmpeg(inputUrl, async (ffmpeg) => {
    await ffmpeg.exec([
      "-i", "input.mp4",
      "-vf", effects[effect.toLowerCase()],
      "-c:v", "libx264", "-preset", "ultrafast", "-crf", "23",
      "-c:a", "copy", "-movflags", "+faststart", "output.mp4"
    ]);
  });
}

export async function processVideoExport(config: VideoEditConfig) {
  return processWithFFmpeg(config.inputUrl, async (ffmpeg) => {
    const inputArgs = ["-i", "input.mp4"];
    if (config.trim) {
      inputArgs.push("-ss", config.trim.startTime.toString(), "-t", config.trim.duration.toString());
    }

    let filterComplex: string[] = [];
    let inputIndex = 0;
    let lastOutput = "[0:v]";

    if (config.imageOverlay) {
      await ffmpeg.writeFile("overlay.png", await fetchFile(config.imageOverlay.imageUrl));
      inputArgs.push("-i", "overlay.png");
      filterComplex.push(`${lastOutput}[${++inputIndex}:v]overlay=${config.imageOverlay.position.x}:${config.imageOverlay.position.y}[v${inputIndex}]`);
      lastOutput = `[v${inputIndex}]`;
    }

    if (config.watermark || config.texts?.length) {
      await ffmpeg.writeFile('arial.ttf', await fetchFile(
        'https://raw.githubusercontent.com/ffmpegwasm/testdata/master/arial.ttf'
      ));
    }

    if (config.watermark) {
      filterComplex.push(`${lastOutput}drawtext=fontfile=/arial.ttf:text='${config.watermark.text}':x=(w-text_w)/2:y=(h-text_h)/2:fontsize=50:fontcolor=white[v${++inputIndex}]`);
      lastOutput = `[v${inputIndex}]`;
    }

    config.texts?.forEach((text) => {
      filterComplex.push(`${lastOutput}drawtext=fontfile=/arial.ttf:text='${text.content.replace(/'/g, "\\'")}':x=${text.position.x}:y=${text.position.y}:fontsize=${text.style.fontSize}:fontcolor=${text.style.color}[v${++inputIndex}]`);
      lastOutput = `[v${inputIndex}]`;
    });

    if (config.filters) {
      let filterString = "";
      if (config.filters.grayscale) filterString += "hue=s=0,";
      if (typeof config.filters.brightness === 'number') filterString += `eq=brightness=${config.filters.brightness},`;
      if (filterString) {
        filterComplex.push(`${lastOutput}${filterString.slice(0, -1)}[v${++inputIndex}]`);
        lastOutput = `[v${inputIndex}]`;
      }
    }

    await ffmpeg.exec([
      ...inputArgs,
      ...(filterComplex.length ? ["-filter_complex", filterComplex.join(';')] : []),
      "-map", lastOutput, "-map", "0:a?",
      "-c:v", "libx264", "-preset", "ultrafast", "-crf", "23",
      "-c:a", "copy", "-movflags", "+faststart", "output.mp4"
    ]);
  });
}