import { Component, createEffect, createSignal, onMount, Show } from 'solid-js';
import { Transition } from 'solid-transition-group';
import WaveSurfer from 'wavesurfer.js';
import Icon from '../Icon';

interface Props {
    isPlaying: boolean;
    startTime: number;
    volume: number;
    source: string;
    onPlaybackStateChange: (isPlaying: boolean) => void;
    onBufferingStateChange: (isBuffering: boolean) => void;
    onPlayerStateChange: (isReady: boolean) => void;
    onTimeUpdate: (t: number) => void;
    onEnd: VoidFunction;
}

interface WavePlayer {
    load: (source: string) => void;
    setVolume: (volume: number) => void;
    getCurrentTime: () => number;
    getDuration: () => number;
    seekTo: (progress: number) => void;
    on: (event: string, callback: (data: any) => void) => void;
    un: (event: string, callback: (data: any) => void) => void;
    isPlaying: () => boolean;
    play: VoidFunction;
    pause: VoidFunction;
}

const WavePlayer: Component<Props> = (props) => {
    const [isLoading, setIsLoading] = createSignal(true);

    let waveFormContainer!: HTMLDivElement;
    let wavesurfer!: WavePlayer;
    let timeWatcher!: number;

    const loadTrack = (source: string) => {
        props.onPlayerStateChange(false);

        setIsLoading(true);

        return new Promise((resolve, reject) => {
            const onReady = () => {
                wavesurfer.un('ready', onReady);

                setIsLoading(false);

                props.onPlayerStateChange(true);

                resolve(undefined);
            };

            const onError = (error: Error) => {
                wavesurfer.un('error', onError);

                setIsLoading(false);

                reject(error);
            };

            wavesurfer.load(source);
            wavesurfer.on('ready', onReady);
            wavesurfer.on('error', onError);
            wavesurfer.on('finish', props.onEnd);
        });
    };

    const startWatchingTime = () =>
        (timeWatcher = window.setInterval(
            () => props.onTimeUpdate(wavesurfer.getCurrentTime()),
            200
        ));

    const stopWatchingTime = () => clearInterval(timeWatcher);

    onMount(async () => {
        const { offsetHeight: height } = waveFormContainer;

        wavesurfer = WaveSurfer.create({
            container: '#waveform',
            waveColor: '#cdced9',
            progressColor: '#6b6e8e',
            cursorWidth: 0,
            barWidth: 1,
            barGap: 2,
            height
        });

        wavesurfer.on('seek', (progress) =>
            props.onTimeUpdate(progress * wavesurfer.getDuration())
        );

        if (props.source) {
            await loadTrack(props.source);

            if (props.startTime)
                wavesurfer.seekTo(props.startTime / wavesurfer.getDuration());
        }
    });

    createEffect(async (previousSource) => {
        const { source } = props;

        if (!source) {
            // unload
        } else if (source !== previousSource && wavesurfer) loadTrack(source);

        return source;
    }, props.source);

    createEffect((previousIsPlaying) => {
        if (props.isPlaying && !wavesurfer.isPlaying()) {
            wavesurfer.play();

            startWatchingTime();
        } else if (wavesurfer.isPlaying()) {
            wavesurfer.pause();

            stopWatchingTime();
        }

        return previousIsPlaying;
    }, props.isPlaying);

    createEffect((currentVolume) => {
        const { volume } = props;

        if (volume !== currentVolume) wavesurfer.setVolume(volume / 100);

        return volume;
    }, props.volume);

    return (
        <div class="relative h-full flex-grow">
            <div
                id="waveform"
                class="h-full w-full"
                ref={waveFormContainer}
            ></div>

            <Transition name="fade">
                <Show when={props.source && isLoading()}>
                    <Icon
                        class="absolute left-0 top-1/2 transform -translate-y-1/2 w-6 h-6 text-primary-100"
                        name="loading"
                    />
                </Show>
            </Transition>
        </div>
    );
};

export default WavePlayer;
