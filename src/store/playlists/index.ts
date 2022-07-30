import { v4 as uuid } from 'uuid';
import { useStore } from '..';
import { initialState, PlaylistsState } from './_state';

export const usePlaylists = () => {
    const [{ playlists }, setState] = useStore();

    const createPlaylist = (title: string) =>
        setState('playlists', 'items', (items) => [
            ...items,
            {
                id: uuid(),
                title,
                items: []
            }
        ]);

    const updatePlaylist = (targetId: string, data: Partial<Playlist>) =>
        setState('playlists', 'items', ({ id }) => id === targetId, data);

    const deletePlaylist = (targetId: string) =>
        setState('playlists', 'items', (items) =>
            items.filter(({ id }) => id !== targetId)
        );

    const clearPlaylist = (targetId: string) =>
        setState(
            'playlists',
            'items',
            ({ id }) => id === targetId,
            'items',
            []
        );

    const getPlaylistByIndex = (targetIndex: number) =>
        playlists.items.find((_, index) => index === targetIndex);

    const getPlaylistById = (targetId: string) =>
        playlists.items.find(({ id }) => id === targetId);

    return [
        playlists,
        {
            createPlaylist,
            updatePlaylist,
            deletePlaylist,
            clearPlaylist,
            getPlaylistByIndex,
            getPlaylistById
        }
    ] as const;
};
