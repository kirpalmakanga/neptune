import { Component, createSignal, Show } from 'solid-js';
import { formatTime } from '../utils/helpers';
import Icon from './Icon';

interface Props extends Track {
    isActive: boolean;
    onClick: VoidFunction;
}

const PlaylistItem: Component<Props> = (props) => {
    const [isHovered, setIsHovered] = createSignal(false);

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    return (
        <div
            class="flex items-center p-3 gap-3 text-primary-100 bg-primary-700 hover:bg-primary-600 select-none"
            onClick={props.onClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div class="w-6 h-6 flex justify-center items-center text-xs text-primary-200">
                <Show when={isHovered()} fallback={props.trackNumber}>
                    <Icon
                        class="w-6 h-6"
                        name={props.isActive ? 'pause ' : 'play'}
                    />
                </Show>
            </div>

            <div class="flex flex-grow flex-col gap-1">
                <div class="text-sm">{props.title}</div>

                <div class="text-xs text-primary-200">
                    {props.artists || props.albumArtists}
                </div>
            </div>

            <div class="text-xs text-primary-200">
                {formatTime(props.duration)}
            </div>
        </div>
    );
};

export default PlaylistItem;
