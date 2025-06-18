import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL, fetchFile } from "@ffmpeg/util";

let ffmpegInstance: FFmpeg | null = null;
let isLoaded = false;

export async function getFFmpegInstance() {
  if (!ffmpegInstance) {
    ffmpegInstance = new FFmpeg();
  }
  if (!isLoaded) {
    const baseURL = "/ffmpeg";
    await ffmpegInstance.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
      workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, "text/javascript"),
    });
    isLoaded = true;
  }
  return ffmpegInstance;
}

export interface WatermarkConfig {
  text: string;
  position?: {
    x: string; // Can be pixels (100) or expressions like "(w-text_w)/2"
    y: string; // Can be pixels (100) or expressions like "(h-text_h)/2"
  };
  style?: {
    fontSize?: number;
    fontColor?: string;
    opacity?: number;
  };
}

export async function addWatermark(inputUrl: string, config: WatermarkConfig) {
  const ffmpeg = await getFFmpegInstance();
  await ffmpeg.writeFile("input.mp4", await fetchFile(inputUrl));
  await ffmpeg.writeFile('arial.ttf', await fetchFile('https://raw.githubusercontent.com/ffmpegwasm/testdata/master/arial.ttf'));

  const position = config.position || { x: "(w-text_w)/2", y: "(h-text_h)/2" };
  const style = config.style || { fontSize: 50, fontColor: 'white', opacity: 1 };

  await ffmpeg.exec([
    "-i", "input.mp4",
    "-vf", `drawtext=fontfile=/arial.ttf:text='${config.text}':x=${position.x}:y=${position.y}:fontsize=${style.fontSize}:fontcolor=${style.fontColor}@${style.opacity}`,
    "-c:v", "libx264",
    "-preset", "ultrafast",
    "-crf", "28",
    "-threads", "0",
    "-c:a", "copy",
    "-avoid_negative_ts", "make_zero",
    "-movflags", "+faststart",
    "-tune", "fastdecode",
    "-rc-lookahead", "10",
    "-f", "mp4",
    "output.mp4",
  ]);
  const fileData = await ffmpeg.readFile("output.mp4");
  return new Uint8Array(fileData as ArrayBuffer);
}


export async function adjustVideoSpeed(inputUrl: string, speed: number): Promise<Uint8Array> {
  const ffmpeg = await getFFmpegInstance();

  try {
    try {
      await ffmpeg.deleteFile("input.mp4");
      await ffmpeg.deleteFile("output.mp4");
    } catch (e) {
    }

    const inputData = await fetchFile(inputUrl);
    if (!inputData) throw new Error('Failed to fetch input file');
    await ffmpeg.writeFile("input.mp4", inputData);

    const pts = 1 / speed;
    await ffmpeg.exec([
      "-i", "input.mp4",
      "-filter:v", `setpts=${pts}*PTS`,
      "-c:v", "libx264",
      "-preset", "ultrafast",
      "-c:a", "copy",
      "-f", "mp4",
      "output.mp4"
    ]);

    const fileData = await ffmpeg.readFile("output.mp4");
    if (!fileData) throw new Error('Failed to read output file');

    return new Uint8Array(fileData as ArrayBuffer);
  } catch (error: any) {
    throw new Error(`Failed to adjust video speed: ${error?.message || 'Unknown error'}`);
  } finally {
    try {
      await ffmpeg.deleteFile("input.mp4");
      await ffmpeg.deleteFile("output.mp4");
    } catch (e) {
    }
  }
}


export async function applyBrightness(inputUrl: string, brightness: number = 0.2) {
  const ffmpeg = await getFFmpegInstance();
  await ffmpeg.writeFile("input.mp4", await fetchFile(inputUrl));
  await ffmpeg.exec([
    "-i", "input.mp4",
    "-vf", `eq=brightness=${brightness}`,
    "-c:v", "libx264",
    "-preset", "ultrafast",
    "-crf", "23",
    "-threads", "0",
    "-c:a", "copy",
    "-avoid_negative_ts", "make_zero",
    "-movflags", "+faststart",
    "-f", "mp4",
    "output.mp4",
  ]);
  const fileData = await ffmpeg.readFile("output.mp4");
  return new Uint8Array(fileData as ArrayBuffer);
}

export async function trimVideo(inputUrl: string, startTime: number, duration: number) {
  const ffmpeg = await getFFmpegInstance();
  await ffmpeg.writeFile("input.mp4", await fetchFile(inputUrl));
  await ffmpeg.exec([
    "-i", "input.mp4",
    "-ss", startTime.toString(),
    "-t", duration.toString(),
    "-c:v", "libx264",
    "-preset", "ultrafast",
    "-crf", "23",
    "-threads", "0",
    "-c:a", "copy",
    "-avoid_negative_ts", "make_zero",
    "-movflags", "+faststart",
    "-f", "mp4",
    "output.mp4",
  ]);
  const fileData = await ffmpeg.readFile("output.mp4");
  return new Uint8Array(fileData as ArrayBuffer);
}

export async function addImageOverlay(
  inputUrl: string,
  imageUrl: string,
  position: { x: number, y: number }
): Promise<Uint8Array> {
  const ffmpeg = await getFFmpegInstance();

  // Write input files
  await Promise.all([
    ffmpeg.writeFile("input.mp4", await fetchFile(inputUrl)),
    ffmpeg.writeFile("overlay.png", await fetchFile(imageUrl))
  ]);

  // Execute FFmpeg command
  await ffmpeg.exec([
    "-i", "input.mp4",
    "-i", "overlay.png",
    "-filter_complex", `[1:v]format=rgba[over];[0:v][over]overlay=${position.x}:${position.y}:format=auto`,
    "-c:v", "libx264",
    "-preset", "fast",
    "-crf", "23",
    "-c:a", "copy",
    "-movflags", "+faststart",
    "-f", "mp4",
    "output.mp4"
  ]);

  const fileData = await ffmpeg.readFile("output.mp4");
  return new Uint8Array(fileData as ArrayBuffer);
}

export interface VideoEditConfig {
  inputUrl: string;
  trim?: {
    startTime: number;
    duration: number;
  };
  watermark?: {
    text: string;
  };
  imageOverlay?: {
    imageUrl: string;
    position: { x: number; y: number };
  };
  filters?: {
    brightness?: number;
    grayscale?: boolean;
  };
  texts?: Array<{
    content: string;
    position: { x: number; y: number };
    style: {
      fontSize: number;
      color: string;
      fontWeight: string;
    };
  }>;
}

export async function processVideoExport(config: VideoEditConfig): Promise<Uint8Array> {
  const ffmpeg = await getFFmpegInstance();
  await ffmpeg.writeFile("input.mp4", await fetchFile(config.inputUrl));

  // Prepare filter complex string
  let filterComplex: string[] = [];
  let inputIndex = 0;
  let lastOutput = "[0:v]";

  // Add trim if specified
  const inputArgs = ["-i", "input.mp4"];
  if (config.trim) {
    inputArgs.push("-ss", config.trim.startTime.toString());
    inputArgs.push("-t", config.trim.duration.toString());
  }

  // Add image overlay if specified
  if (config.imageOverlay) {
    await ffmpeg.writeFile("overlay.png", await fetchFile(config.imageOverlay.imageUrl));
    inputArgs.push("-i", "overlay.png");
    filterComplex.push(`${lastOutput}[${++inputIndex}:v]overlay=${config.imageOverlay.position.x}:${config.imageOverlay.position.y}[v${inputIndex}]`);
    lastOutput = `[v${inputIndex}]`;
  }

  // Add watermark if specified
  if (config.watermark) {
    await ffmpeg.writeFile('arial.ttf', await fetchFile('https://raw.githubusercontent.com/ffmpegwasm/testdata/master/arial.ttf'));
    filterComplex.push(`${lastOutput}drawtext=fontfile=/arial.ttf:text='${config.watermark.text}':x=(w-text_w)/2:y=(h-text_h)/2:fontsize=50:fontcolor=white[v${++inputIndex}]`);
    lastOutput = `[v${inputIndex}]`;
  }

  if (config.texts && config.texts.length > 0) {
    await ffmpeg.writeFile('arial.ttf', await fetchFile('https://raw.githubusercontent.com/ffmpegwasm/testdata/master/arial.ttf'));
    config.texts.forEach((text, i) => {
      // Convert color to hex if needed (assume it's already hex or named)
      // Font weight is not supported by drawtext, so we ignore it
      // x/y are in pixels, so use as is
      filterComplex.push(`${lastOutput}drawtext=fontfile=/arial.ttf:text='${text.content.replace(/'/g, "\\'")}':x=${text.position.x}:y=${text.position.y}:fontsize=${text.style.fontSize}:fontcolor=${text.style.color}[v${++inputIndex}]`);
      lastOutput = `[v${inputIndex}]`;
    });
  }

  // Add filters if specified
  if (config.filters) {
    let filterString = "";
    if (config.filters.grayscale) {
      filterString += "hue=s=0,";
    }
    if (typeof config.filters.brightness === 'number') {
      filterString += `eq=brightness=${config.filters.brightness},`;
    }
    if (filterString) {
      filterComplex.push(`${lastOutput}${filterString.slice(0, -1)}[v${++inputIndex}]`);
      lastOutput = `[v${inputIndex}]`;
    }
  }

  // Build FFmpeg command
  const ffmpegArgs = [
    ...inputArgs,
    ...(filterComplex.length ? ["-filter_complex", filterComplex.join(';')] : []),
    "-map", lastOutput,
    "-map", "0:a?",
    "-c:v", "libx264",
    "-preset", "ultrafast",
    "-crf", "23",
    "-threads", "0",
    "-c:a", "copy",
    "-avoid_negative_ts", "make_zero",
    "-movflags", "+faststart",
    "-f", "mp4",
    "output.mp4"
  ];

  await ffmpeg.exec(ffmpegArgs);
  const fileData = await ffmpeg.readFile("output.mp4");
  return new Uint8Array(fileData as ArrayBuffer);
}

