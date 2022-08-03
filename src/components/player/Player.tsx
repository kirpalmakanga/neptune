import { Component, createMemo } from 'solid-js';
import { createStore } from 'solid-js/store';
import { makeAudioPlayer } from '@solid-primitives/audio';
import { usePlayer } from '../../store/player';
import { usePlaylists } from '../../store/playlists';
import Button from '../Button';
import WavePlayer from './WavePlayer';
import { formatTime } from '../../utils/helpers';

interface State {
    isPlaying: boolean;
    isBuffering: boolean;
    isPlayerReady: boolean;
    currentTime: number;
}

const Player: Component = () => {
    const [playlists] = usePlaylists();
    const [player, {}] = usePlayer();

    const [state, setState] = createStore<State>({
        isPlaying: false,
        isBuffering: false,
        isPlayerReady: false,
        currentTime: 0
    });

    const currentPlaylist = createMemo(() =>
        playlists.items.find(({ id }) => id === player.currentPlaylistId)
    );

    const currentTrack = createMemo<Track>(() => {
        const playlist = currentPlaylist();
        const defaultTrack = {
            title: 'No active track',
            artists: 'No artist',
            duration: 0
        };

        if (playlist)
            return (
                playlist.items.find(({ id }) => id === player.currentTrackId) ||
                defaultTrack
            );
        else return defaultTrack;
    });

    const currentTrackIndex = createMemo(() => {
        const index = (currentPlaylist()?.items || []).findIndex(
            ({ id }) => id === player.currentTrackId
        );

        return index > -1 ? index : 0;
    });

    const getPlaylistItems = () => currentPlaylist()?.items || [];

    const getTrack = (targetId: string) =>
        getPlaylistItems().find(({ id }) => id === targetId);

    const previousTrackId = createMemo(() => {
        const { id = null } = getPlaylistItems()[currentTrackIndex() - 1] || [];

        return id;
    });

    const nextTrackId = createMemo(() => {
        const { id = null } = getPlaylistItems()[currentTrackIndex() + 1] || [];

        return id;
    });

    const handleTogglePlay = () => setState('isPlaying', !state.isPlaying);

    const handlePlaybackStateChange = (isPlaying: boolean) =>
        setState('isPlaying', isPlaying);

    const handleBufferingStateChange = (isBuffering: boolean) =>
        setState('isBuffering', isBuffering);

    const handleTimeUpdate = (time: number) => setState('currentTime', time);

    const handleSeeking = (progress: number) =>
        setState('currentTime', progress * currentTrack().duration);

    const handlePlayerStateChange = (isReady: boolean) => {
        console.log({ isReady });

        setState('isPlayerReady', isReady);
    };

    return (
        <div class="flex items-center bg-primary-900 p-2 gap-4 overflow-hidden">
            <div
                class="flex gap-2"
                classList={{
                    'pointer-events-none opacity-50': !state.isPlayerReady
                }}
            >
                <Button
                    class="w-6 h-6 text-primary-100"
                    classList={{
                        'pointer-events-none opacity-50':
                            !state.isPlayerReady || previousTrackId()
                    }}
                    icon="previous"
                    iconClass="w-6 h-6"
                />

                <Button
                    class="w-6 h-6 text-primary-100"
                    icon={state.isPlaying ? 'pause' : 'play'}
                    iconClass="w-6 h-6"
                    onClick={handleTogglePlay}
                />

                <Button
                    class="w-6 h-6 text-primary-100"
                    classList={{
                        'pointer-events-none opacity-50':
                            !state.isPlayerReady || nextTrackId()
                    }}
                    icon="next"
                    iconClass="w-6 h-6"
                />
            </div>

            <div class="flex flex-col gap-1 overflow-hidden">
                <div class="text-primary-100 text-sm overflow-hidden overflow-ellipsis whitespace-nowrap">
                    {currentTrack().title}
                </div>

                <div class="text-primary-200 text-xs overflow-hidden overflow-ellipsis whitespace-nowrap">
                    {currentTrack().artists}
                </div>
            </div>

            <WavePlayer
                isPlaying={state.isPlaying}
                volume={player.volume}
                source={currentTrack().source}
                onPlaybackStateChange={handlePlaybackStateChange}
                onBufferingStateChange={handleBufferingStateChange}
                onTimeUpdate={handleTimeUpdate}
                onSeek={handleSeeking}
                onPlayerStateChange={handlePlayerStateChange}
            />

            <div class="text-sm text-primary-100">
                {formatTime(state.currentTime)} /{' '}
                {formatTime(currentTrack().duration)}
            </div>
        </div>
    );
};

export default Player;
