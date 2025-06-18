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
  ffmpegInstance.on("progress", (progress) => {
    console.log(progress.progress);
  });
  ffmpegInstance.on("log", (message) => {
    console.log(message.message);
  });
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


export async function trimVideo(inputUrl: string, startTime: number, duration: number) {
  console.log('trimVideo', inputUrl, startTime, duration);
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
  position: { x: number; y: number },
  size: { width: number; height: number } = { width: 200, height: 200 }
): Promise<Uint8Array> {
  const ffmpeg = await getFFmpegInstance();

  console.log('Starting addImageOverlay:', { inputUrl, imageUrl, position, size });

  try {
    // **Step 1: Clean up any existing files**
    await Promise.all([
      ffmpeg.deleteFile("input.mp4").catch(() => {}),
      ffmpeg.deleteFile("overlay.png").catch(() => {}),
      ffmpeg.deleteFile("output.mp4").catch(() => {}),
    ]);
    console.log('Cleaned up existing files');

    // **Step 2: Fetch input files**
    console.log('Fetching input files...');
    const videoData = await fetchFile(inputUrl);
    const imageData = await fetchFile(imageUrl);

    if (!videoData || videoData.byteLength === 0) {
      throw new Error('Failed to fetch or empty video file');
    }
    if (!imageData || imageData.byteLength === 0) {
      throw new Error('Failed to fetch or empty image file');
    }
    console.log('Input files fetched successfully');

    // **Step 3: Write files to FFmpeg filesystem**
    console.log('Writing files to FFmpeg filesystem...');
    await ffmpeg.writeFile("input.mp4", videoData);
    await ffmpeg.writeFile("overlay.png", imageData);
    console.log('Files written to FFmpeg filesystem');

    // **Step 4: Build and execute FFmpeg command**
    const filterComplex = `[1:v]scale=${size.width}:${size.height}[scaled];[0:v][scaled]overlay=${position.x}:${position.y}:format=auto`;
    console.log('Executing FFmpeg with filter:', filterComplex);

    await ffmpeg.exec([
      '-i', 'input.mp4',
      '-i', 'overlay.png',
      '-filter_complex', filterComplex,
      '-c:v', 'libx264',
      '-preset', 'fast',
      '-crf', '23',
      '-c:a', 'copy',
      '-movflags', '+faststart',
      '-f', 'mp4',
      'output.mp4',
    ]);
    console.log('FFmpeg command completed');

    // **Step 5: Read and validate the output**
    console.log('Reading output file...');
    const outputData:any = await ffmpeg.readFile("output.mp4");

    if (!outputData || outputData.byteLength === 0) {
      throw new Error('Output file is empty or could not be read');
    }
    console.log('Output file read successfully, size:', outputData.byteLength, 'bytes');

    // **Step 6: Convert and return as Uint8Array**
    const result = new Uint8Array(outputData as ArrayBuffer);
    console.log('Returning Uint8Array, length:', result.length);

    return result;

  } catch (error: any) {
    console.error('Error in addImageOverlay:', error);
    throw new Error(`Failed to add image overlay: ${error?.message || 'Unknown error'}`);
  } finally {
    // **Step 7: Clean up files**
    try {
      await Promise.all([
        ffmpeg.deleteFile("input.mp4").catch(() => {}),
        ffmpeg.deleteFile("overlay.png").catch(() => {}),
        ffmpeg.deleteFile("output.mp4").catch(() => {}),
      ]);
      console.log('Cleaned up files in finally block');
    } catch (e) {
      console.warn('Non-critical cleanup error:', e);
    }
  }
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

export async function applyVideoEffect(inputUrl: string, effect: string): Promise<Uint8Array> {
  const ffmpeg = await getFFmpegInstance();

  try {
    // Clean up any existing files
    try {
      await ffmpeg.deleteFile("input.mp4");
      await ffmpeg.deleteFile("output.mp4");
    } catch (e) {
    }

    const inputData = await fetchFile(inputUrl);
    if (!inputData) throw new Error('Failed to fetch input file');
    await ffmpeg.writeFile("input.mp4", inputData);

    console.log('Applying effect:', effect);
    let filterCommand = "";
    
    switch (effect.toLowerCase()) {
      case "none":
        filterCommand = ""; 
        break;
      case "grayscale":
        filterCommand = "hue=s=0";
        break;
      case "cool":
        filterCommand = "eq=brightness=-0.1:contrast=1.1,hue=h=180";
        break;
      case "warm":
        filterCommand = "eq=brightness=0.1:contrast=0.9,hue=h=-20";
        break;
      case "cinematic":
        filterCommand = "eq=contrast=1.3:brightness=-0.1:saturation=1.1";
        break;
      case "blur":
        filterCommand = "gblur=sigma=2";
        break;
      default:
        throw new Error(`Unsupported effect: ${effect}`);
    }
    
    console.log('Filter command:', filterCommand);

    if (!filterCommand || filterCommand === "") {
      await ffmpeg.exec([
        "-i", "input.mp4",
        "-c:v", "copy",
        "-c:a", "copy",
        "-f", "mp4",
        "output.mp4"
      ]);
    } else {
      await ffmpeg.exec([
        "-i", "input.mp4",
        "-vf", filterCommand,
        "-c:v", "libx264",
        "-preset", "ultrafast",
        "-crf", "23",
        "-c:a", "copy",
        "-avoid_negative_ts", "make_zero",
        "-movflags", "+faststart",
        "-f", "mp4",
        "output.mp4"
      ]);
    }

    const fileData = await ffmpeg.readFile("output.mp4");
    if (!fileData) throw new Error('Failed to read output file');

    return new Uint8Array(fileData as ArrayBuffer);
  } catch (error: any) {
    console.error('Error applying video effect:', error);
    throw new Error(`Failed to apply video effect: ${error?.message || 'Unknown error'}`);
  } finally {
    try {
      await ffmpeg.deleteFile("input.mp4");
      await ffmpeg.deleteFile("output.mp4");
    } catch (e) {
    }
  }
}

