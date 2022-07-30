import { onMount, ParentComponent } from 'solid-js';
import { Transition } from 'solid-transition-group';
import { useNavigate } from '@solidjs/router';
import Sprite from './components/Sprite';
// import Prompt from './components/Prompt';
import Playlists from './components/Playlists';
import Player from './components/player/Player';
import Notifications from './components/Notifications';
import { usePlaylists } from './store/playlists';

const Root: ParentComponent = (props) => {
    const navigate = useNavigate();
    const [, { getPlaylistByIndex }] = usePlaylists();

    onMount(() => {
        const { id } = getPlaylistByIndex(0) || {};

        if (id) navigate(`/playlist/${id}`);
    });

    return (
        <>
            <Sprite />

            <Transition name="fade" appear={true}>
                <div class="flex flex-col flex-grow">
                    <div class="flex flex-grow">
                        <Playlists />

                        {props.children}
                    </div>
                    {/* <Prompt /> */}

                    <Player />

                    <Notifications />
                </div>
            </Transition>
        </>
    );
};

export default Root;
