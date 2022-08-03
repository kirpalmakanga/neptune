import { useStore } from '..';

export const usePlayer = () => {
    const [{ player }, setState] = useStore();

    const setCurrentTrack = ({
        id: currentTrackId,
        playlistId: currentPlaylistId
    }: {
        id: string;
        playlistId: string;
    }) => setState('player', { currentTrackId, currentPlaylistId });

    return [player, { setCurrentTrack }] as const;
};
