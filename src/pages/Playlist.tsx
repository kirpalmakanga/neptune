import { Component, createMemo, Show } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { useParams } from '@solidjs/router';
import Icon from '../components/Icon';
import ScrollContainer from '../components/ScrollContainer';
import SortableList from '../components/SortableList';
import PlaylistItem from '../components/PlaylistItem';
import { usePlaylists } from '../store/playlists';

const Playlist: Component = () => {
    const params = useParams();
    const [, { updatePlaylist, getPlaylistById }] = usePlaylists();

    const playlist = createMemo(() => getPlaylistById(params.playlistId));

    const handleReorderItems = (items: Track[]) =>
        updatePlaylist(params.playlistId, { items });

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

                            <ScrollContainer>
                                <SortableList
                                    items={props.data.items}
                                    itemKey="id"
                                    onReorderItems={handleReorderItems}
                                >
                                    {(data) => <PlaylistItem {...data} />}
                                </SortableList>
                            </ScrollContainer>
                        </>
                    )}
                />
            </Show>
        </div>
    );
};

export default Playlist;
