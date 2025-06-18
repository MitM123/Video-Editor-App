import { useState, useRef } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL, fetchFile } from "@ffmpeg/util";

function App() {
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [videoProcessed, setVideoProcessed] = useState(false);
  const [processing, setProcessing] = useState(false);
  const ffmpegRef = useRef(new FFmpeg());
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const messageRef = useRef<HTMLParagraphElement | null>(null);
  const videoDataRef = useRef<Uint8Array | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      // Use local files from public/ffmpeg folder
      const baseURL = "/ffmpeg";
      const ffmpeg = ffmpegRef.current;
      ffmpeg.on("log", ({ message }: { message: string }) => {
        if (messageRef.current) messageRef.current.innerHTML = message;
      });
      ffmpeg.on("progress", ({ progress }: { progress: number }) => {
        if (messageRef.current) {
          messageRef.current.innerHTML = `Progress: ${Math.round(progress * 100)}%`;
        }
        console.log(progress);
      });

      // Load FFmpeg using local files with multi-threading
      await ffmpeg.load({
        coreURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.js`,
          "text/javascript"
        ),
        wasmURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.wasm`,
          "application/wasm"
        ),
        workerURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.worker.js`,
          "text/javascript"
        ),
      });
      setLoaded(true);
      setLoading(false);
    } catch (err) {
      console.log("Error loading FFmpeg:", err);
      setLoading(false);
    }
  };

  const watermark = async () => {
    try {
      setProcessing(true);
      console.log("Starting watermark process");
      const videoURL =
        "https://www.editframe.com/docs/composition/layers/video/puppy-beach.mp4";
      const ffmpeg = ffmpegRef.current;

      // Write input video file
      await ffmpeg.writeFile("input.mp4", await fetchFile(videoURL));

      // Write font file (you can also put arial.ttf in public/ffmpeg folder and use local path)
      await ffmpeg.writeFile('arial.ttf', await fetchFile('https://raw.githubusercontent.com/ffmpegwasm/testdata/master/arial.ttf'));

      console.log("Files written, starting FFmpeg processing");

      // Optimized FFmpeg command for faster processing
      await ffmpeg.exec([
        "-i", "input.mp4",
        "-vf", "drawtext=fontfile=/arial.ttf:text='Mit Lodu':x=(w-text_w)/2:y=(h-text_h)/2:fontsize=50:fontcolor=white",
        "-c:v", "libx264",
        "-preset", "ultrafast",      // Fastest encoding (trade quality for speed)
        "-crf", "23",               // Balanced quality (faster than 18)
        "-threads", "0",            // Use all available threads
        "-c:a", "copy",             // Copy audio without re-encoding (much faster)
        "-avoid_negative_ts", "make_zero",
        "-movflags", "+faststart",
        "-f", "mp4",                // Force MP4 format
        "output.mp4",
      ]);

      console.log("FFmpeg processing completed");

      // Read the output file
      const fileData = await ffmpeg.readFile("output.mp4");
      const data = new Uint8Array(fileData as ArrayBuffer);

      // Store the video data for download
      videoDataRef.current = data;

      // Display the processed video
      if (videoRef.current) {
        videoRef.current.src = URL.createObjectURL(
          new Blob([data.buffer], { type: "video/mp4" })
        );
        console.log("Video displayed successfully");
      }

      setVideoProcessed(true);
      setProcessing(false);
    } catch (err) {
      console.error("Error processing video:", err);
      if (messageRef.current) {
        if (err && typeof err === "object" && "message" in err) {
          messageRef.current.innerHTML = `Error: ${(err as { message: string }).message}`;
        } else {
          messageRef.current.innerHTML = "An unknown error occurred.";
        }
      }
      setProcessing(false);
    }
  };

  const downloadVideo = () => {
    if (videoDataRef.current) {
      const blob = new Blob([videoDataRef.current.buffer], { type: "video/mp4" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "watermarked-video.mp4";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div
      style={{
        margin: "auto",
        padding: "20px",
        maxWidth: "800px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>Video Watermark Tool</h1>
      <p style={{ color: "#666", marginBottom: "20px" }}>
        Add text watermarks to your videos using FFmpeg in the browser
      </p>

      {loaded ? (
        <>
          <video
            style={{
              height: "500px",
              width: "100%",
              maxWidth: "700px",
              backgroundColor: "#000",
              borderRadius: "8px",
            }}
            ref={videoRef}
            controls
          ></video>
          <br />
          <p
            ref={messageRef}
            style={{
              minHeight: "20px",
              margin: "10px 0",
              padding: "10px",
              backgroundColor: "#f8f9fa",
              borderRadius: "4px",
              fontFamily: "monospace",
              fontSize: "14px"
            }}
          ></p>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              onClick={watermark}
              disabled={processing}
              style={{
                padding: "12px 24px",
                backgroundColor: processing ? "#ccc" : "#007bff",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: processing ? "not-allowed" : "pointer",
                fontSize: "16px",
                fontWeight: "500",
              }}
            >
              {processing ? "Processing..." : "Add Watermark"}
            </button>

            {videoProcessed && (
              <button
                onClick={downloadVideo}
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: "500",
                }}
              >
                Download Video
              </button>
            )}
          </div>
        </>
      ) : (
        <div style={{ textAlign: "center", padding: "40px" }}>
          {loading && (
            <div style={{ marginBottom: "20px" }}>
              <p style={{ fontSize: "18px", color: "#007bff" }}>Loading FFmpeg core...</p>
              <div style={{
                width: "200px",
                height: "4px",
                backgroundColor: "#e9ecef",
                borderRadius: "2px",
                margin: "10px auto",
                overflow: "hidden"
              }}>
                <div style={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: "#007bff",
                  animation: "loading 1.5s infinite"
                }}></div>
              </div>
            </div>
          )}
          <button
            onClick={load}
            disabled={loading}
            style={{
              padding: "12px 24px",
              backgroundColor: loading ? "#ccc" : "#007bff",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: "16px",
              fontWeight: "500",
            }}
          >
            {loading ? "Loading..." : "Load FFmpeg Core"}
          </button>
        </div>
      )}

      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}

export default App;
