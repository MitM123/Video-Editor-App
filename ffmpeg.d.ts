declare module '@ffmpeg/ffmpeg' {
    export function createFFmpeg(options?: any): any;
    export function fetchFile(file: string | File | Blob | ArrayBuffer): Promise<Uint8Array>;
}