import { Component, createMemo, Show } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { useParams } from '@solidjs/router';
import Icon from '../components/Icon';
import ScrollContainer from '../components/ScrollContainer';
import SortableList from '../components/SortableList';
import PlaylistItem from '../components/PlaylistItem';
import { usePlaylists } from '../store/playlists';
import FileDrop from '../components/FileDrop';
import { usePlayer } from '../store/player';

const Playlist: Component = () => {
    const params = useParams();
    const [, { updatePlaylist, getPlaylistById, addPlaylistItems }] =
        usePlaylists();
    const [player, { setCurrentTrack }] = usePlayer();

    const playlist = createMemo(() => getPlaylistById(params.playlistId));

    const handleReorderItems = (items: Track[]) =>
        updatePlaylist(params.playlistId, { items });

    const handleDropFiles = (items: Track[]) =>
        addPlaylistItems(params.playlistId, items);

    const handleSetCurrentTrack = (id: string) => () =>
        setCurrentTrack({ id, playlistId: params.playlistId });

    return (
        <div class="flex flex-col flex-grow bg-primary-700">
            <Show when={playlist()}>
                <Dynamic
                    data={playlist() as Playlist}
                    component={(props: { data: Playlist }) => (
                        <>
                            <header class="flex justify-between items-center p-3 bg-primary-600">
                                <h1 class="font-bold text-primary-100 text-primary-100">
                                    {props.data.title}
                                </h1>

                                <button class="inline-block w-5 h-5 text-primary-100 hover:opacity-70">
                                    <Icon class="w-5 h-5" name="more" />
                                </button>
                            </header>

                            <FileDrop onDropFiles={handleDropFiles}>
                                <ScrollContainer>
                                    <SortableList
                                        items={props.data.items}
                                        itemKey="id"
                                        onReorderItems={handleReorderItems}
                                    >
                                        {(data) => (
                                            <PlaylistItem
                                                {...data}
                                                isCurrent={
                                                    data.id ===
                                                    player.currentTrackId
                                                }
                                                onClick={handleSetCurrentTrack(
                                                    data.id
                                                )}
                                            />
                                        )}
                                    </SortableList>
                                </ScrollContainer>
                            </FileDrop>
                        </>
                    )}
                />
            </Show>
        </div>
    );
};

export default Playlist;
