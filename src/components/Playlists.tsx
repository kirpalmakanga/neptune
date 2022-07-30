import { Component, For } from 'solid-js';
import { NavLink } from '@solidjs/router';
import Icon from './Icon';
import ScrollContainer from './ScrollContainer';

import { usePlaylists } from '../store/playlists';

const Playlists: Component = () => {
    const [playlists] = usePlaylists();

    return (
        <header class="flex flex-col w-xs bg-primary-800">
            <div class="flex gap-3 justify-between items-center font-bold  p-3">
                <h2 class="text-primary-100">Playlists</h2>

                <button class="inline-block w-5 h-5 text-primary-100 hover:opacity-70">
                    <Icon class="w-5 h-5" name="add" />
                </button>
            </div>

            <ScrollContainer>
                <ul>
                    <For each={playlists.items}>
                        {({ id, title, items }) => (
                            <li>
                                <NavLink
                                    class="flex gap-3 justify-between items-center p-3 no-underline overflow-hidden text-primary-100 hover:bg-primary-600"
                                    activeClass="bg-primary-700 hover:bg-primary-700"
                                    href={`/playlist/${id}`}
                                >
                                    <span class="text-sm font-bold overflow-ellipsis">
                                        {title}
                                    </span>

                                    <span class="text-xs">
                                        {`${items.length} track${
                                            items.length === 1 ? '' : 's'
                                        }`}
                                    </span>
                                </NavLink>
                            </li>
                        )}
                    </For>
                </ul>
            </ScrollContainer>
        </header>
    );
};

export default Playlists;
