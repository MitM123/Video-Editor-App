# 🎬 Video-Editor-App

A responsive, fully client-side web-based video editor built using React, TypeScript, Tailwind CSS, and WebAssembly-based video processing. This editor offers intuitive real-time video editing in the browser — enabling trim, filters, text overlays, stickers, audio tracks, transitions, and export.

---

## 🚀 Features

✅ **Video Trim & Split**  
- Define precise start and end points for trimming  
- Split video into clips for granular editing  

✅ **Filters & Effects**  
- Apply aesthetic filters (grayscale, sepia, contrast, saturation) in real-time  
- Preview filters before applying  

✅ **Text Overlays**  
- Add customizable text with fonts, colors, positioning

✅ **Stickers & Images**  
- Choose from built-in stickers  
- Upload and position custom images on videos  

✅ **Transitions**  
- Smooth fade, slide, and wipe effects between clips  

✅ **Audio Integration**  
- Add background music / voiceovers  
- Volume control, trimming, fade in/out effects  

✅ **Speed Control**  
- Dynamically adjust playback speed  

✅ **Real-time Preview & Export**  
- Live preview of all changes  
- Export final videos as MP4/WebM in 720p or 1080p  

✅ **Frame Extraction using WebAssembly & Canvas**  
- Capture video frames at specific timestamps using WebAssembly-accelerated Canvas rendering  

✅ **Drag & Drop Video Upload & Timeline Editor**  
- Modern timeline-based editor for managing video clips, overlays, stickers, and audio  

✅ **Shape Drawing**  
- Add draggable shapes like rectangles, circles, and lines over videos  

---

## 📚 Tech Stack

| Tool/Library        | Purpose                             |
|:-------------------|:------------------------------------|
| **React + TypeScript**   | Frontend framework & type safety |
| **Redux Toolkit**        | State management                 |
| **Tailwind CSS**         | Utility-first CSS styling        |
| **Canvas API + WebAssembly** | Frame extraction & effects   |
| **Remotion (optional)**   | Additional video composition tools |
| **React DnD**            | Drag-and-drop system             |

---

## 🛠️ Installation & Development

1️⃣ Clone the repository:
```bash
git clone https://github.com/MitM123/Video-Editor-App
cd Video-Editor-App
npm install
npm run dev
