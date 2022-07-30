import { v4 as uuid } from 'uuid';

export interface PlaylistsState {
    items: Playlist[];
}

export const initialState = (): PlaylistsState => ({
    items: [
        {
            id: uuid(),
            title: 'Default',
            items: Array.from({ length: 50 }, (_, i) => ({
                id: `id${i}`,
                title: `Track${i}`,
                artists: `Artist${i}`,
                albumArtists: `albumArtists${i}`,
                album: `Album${i}`,
                genre: `Genre${i}`,
                duration: i,
                trackNumber: i,
                discNumber: 1,
                source: '/tracks/track.mp3'
            }))
            // items: []
        }
    ]
});
