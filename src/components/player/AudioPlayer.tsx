import { createAudio } from '@solid-primitives/audio';
import { JSX } from 'solid-js';
import {
    Component,
    createEffect,
    createMemo,
    createSignal,
    onMount
} from 'solid-js';
import { throttle } from '../../utils/helpers';

const ProgressBar: Component<{ percentage: number }> = (props) => (
    <span class="absolute inset-0 overflow-hidden">
        <span
            class="absolute inset-0 bg-primary-400"
            style={{
                transform: `translateX(${props.percentage - 100}%)`
            }}
        ></span>
    </span>
);

const PositionBar: Component = () => {
    const [seekingPosition, setSeekingPosition] = createSignal(0);

    let container!: HTMLSpanElement;

    const handleMouseMove = throttle(({ currentTarget, pageX }) => {
        const { left } = currentTarget.getBoundingClientRect();
        const position = (100 * (pageX - left)) / currentTarget.offsetWidth;

        setSeekingPosition(position);
    }, 10);

    const handleMouseLeave = () => setSeekingPosition(0);

    return (
        <span
            ref={container}
            class="absolute inset-0 overflow-hidden"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <span
                class="absolute inset-0 bg-primary-100 bg-opacity-40 bg-opacity"
                style={{
                    transform: `translateX(${seekingPosition() - 100}%)`
                }}
            ></span>
        </span>
    );
};

interface Props {
    isPlaying: boolean;
    startTime: number;
    volume: number;
    source: string;
    onPlaybackStateChange: (isPlaying: boolean) => void;
    onLoadingStateChange: (isLoading: boolean) => void;
    onTimeUpdate: (t: number) => void;
    onEnd: VoidFunction;
}

const AudioPlayer: Component<Props> = (props) => {
    const [audioState, { seek, setVolume, play, pause }] = createAudio(
        () => props.source,
        () => props.isPlaying,
        () => props.volume / 100
    );

    const progress = createMemo(
        () => (100 * audioState.currentTime) / audioState.duration
    );

    const handleClick: JSX.EventHandlerUnion<HTMLDivElement, MouseEvent> = ({
        currentTarget,
        pageX
    }) => {
        const { left } = currentTarget.getBoundingClientRect();
        const positionPercent = (pageX - left) / currentTarget.offsetWidth;

        seek(positionPercent * audioState.duration);
    };

    onMount(() => {
        const { volume, startTime } = props;

        setVolume(volume / 100);

        if (startTime) seek(startTime);
    });

    createEffect(() => {
        const { isPlaying } = props;

        if (isPlaying) play();
        else pause();

        return isPlaying;
    });

    createEffect((previousCurrentTime) => {
        const { currentTime } = audioState;

        if (currentTime !== previousCurrentTime) {
            props.onTimeUpdate(currentTime);
        }

        return currentTime;
    });

    createEffect((previousState) => {
        const { state } = audioState;

        if (state !== previousState) {
            switch (state) {
                case 'loading':
                    props.onLoadingStateChange(true);
                    break;

                case 'ready':
                    props.onLoadingStateChange(false);
                    break;

                case 'playing':
                    props.onPlaybackStateChange(true);
                    break;

                case 'paused':
                    if (audioState.currentTime >= audioState.duration)
                        props.onEnd();
                    else props.onPlaybackStateChange(false);
                    break;
            }
        }

        return state;
    }, audioState.state);

    return (
        <div
            class="relative flex flex-grow bg-primary-700 h-3 overflow-hidden cursor-pointer"
            onClick={handleClick}
        >
            <ProgressBar percentage={progress()} />

            <PositionBar />

            <span class="hidden">{audioState.state}</span>
        </div>
    );
};

export default AudioPlayer;
