export {};

declare global {
    interface Track {
        id: string;
        title: string;
        artists: string;
        albumArtists: string;
        album: string;
        genre: string;
        duration: number;
        trackNumber: number;
        discNumber: string;
        source: string;
    }

    interface Playlist {
        id: string;
        title: string;
        items: Track[];
    }
}
