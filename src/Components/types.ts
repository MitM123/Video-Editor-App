export interface Clip {
    id: string;
    type: 'text' | 'video' | 'audio' | 'image';
    name: string;
    startTime: number;
    duration: number;
    trackId: string;
    src?: string;
}


export interface TrackType {
    id: string;
    name: string;
    type: 'video' | 'audio' | 'text' | 'image';
    clips: Clip[];
}