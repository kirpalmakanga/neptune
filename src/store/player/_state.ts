export interface PlayerState {
    currentTrackId: string;
    currentTime: number;
    volume: number;
}

export const initialState = (): PlayerState => ({
    currentTrackId: '',
    currentTime: 0,
    volume: 100
});
