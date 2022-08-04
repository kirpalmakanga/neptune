import { Component, createMemo, Show } from 'solid-js';
import { createStore } from 'solid-js/store';
import { makeAudioPlayer } from '@solid-primitives/audio';
import { usePlayer } from '../../store/player';
import { usePlaylists } from '../../store/playlists';
import Button from '../Button';
import WavePlayer from './WavePlayer';
import { formatTime } from '../../utils/helpers';
import AudioPlayer from './AudioPlayer';
import Img from '../Img';

interface State {
    isPlaying: boolean;
    isLoading: boolean;
    isPlayerReady: boolean;
    currentTime: number;
}

const defaultTrack: Track = {
    id: '',
    title: 'N/A',
    artists: 'N/A',
    albumArtists: '',
    album: '',
    genre: '',
    duration: 0,
    trackNumber: 0,
    discNumber: '1',
    source: '',
    year: 0,
    cover: ''
};

const Player: Component = () => {
    const [playlists] = usePlaylists();
    const [player, { setCurrentTrack, setCurrentTime }] = usePlayer();

    const [state, setState] = createStore<State>({
        isPlaying: false,
        isLoading: false,
        isPlayerReady: true,
        currentTime: player.currentTime
    });

    const currentPlaylist = createMemo(() =>
        playlists.items.find(({ id }) => id === player.currentPlaylistId)
    );

    const currentTrack = createMemo<Track>(() => {
        const playlist = currentPlaylist();

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

    const previousTrackId = createMemo(() => {
        const { id = null } = getPlaylistItems()[currentTrackIndex() - 1] || [];

        return id;
    });

    const nextTrackId = createMemo(() => {
        const { id = null } = getPlaylistItems()[currentTrackIndex() + 1] || [];

        return id;
    });

    const handleTogglePlay = () => setState('isPlaying', !state.isPlaying);

    const handleSkipTrack = (direction: 'previous' | 'next') => () => {
        const id = direction === 'previous' ? previousTrackId() : nextTrackId();

        if (id) {
            setCurrentTrack({ id, playlistId: player.currentPlaylistId });
        }
    };

    const handlePlaybackStateChange = (isPlaying: boolean) =>
        setState('isPlaying', isPlaying);

    const handleLoadingStateChange = (isLoading: boolean) =>
        setState('isLoading', isLoading);

    const handleTimeUpdate = (time: number) => {
        setState('currentTime', time);

        setCurrentTime(time);
    };

    const handlePlayerStateChange = (isReady: boolean) =>
        setState('isPlayerReady', isReady);

    return (
        <div class="flex items-center bg-primary-900 p-2 gap-4 overflow-hidden">
            <div class="flex gap-2">
                <Button
                    class="w-6 h-6 text-primary-100"
                    classList={{
                        'pointer-events-none opacity-50': !previousTrackId()
                    }}
                    icon="previous"
                    iconClass="w-6 h-6"
                    onClick={handleSkipTrack('previous')}
                />

                <Button
                    class="w-6 h-6 text-primary-100"
                    classList={{
                        'pointer-events-none': state.isLoading
                    }}
                    icon={
                        state.isLoading
                            ? 'loading'
                            : state.isPlaying
                            ? 'pause'
                            : 'play'
                    }
                    iconClass="w-6 h-6"
                    onClick={handleTogglePlay}
                />

                <Button
                    class="w-6 h-6 text-primary-100"
                    classList={{
                        'pointer-events-none opacity-50': !nextTrackId()
                    }}
                    icon="next"
                    iconClass="w-6 h-6"
                    onClick={handleSkipTrack('next')}
                />
            </div>

            <div class="flex items-center gap-2">
                <Img class="h-8 w-8" src={currentTrack().cover} />

                <div class="flex flex-col gap-1 overflow-hidden">
                    <div class="text-primary-100 text-sm overflow-hidden overflow-ellipsis whitespace-nowrap">
                        {currentTrack().title}
                    </div>

                    <div class="text-primary-200 text-xs overflow-hidden overflow-ellipsis whitespace-nowrap">
                        {currentTrack().artists}
                    </div>
                </div>
            </div>

            <AudioPlayer
                isPlaying={state.isPlaying}
                startTime={state.currentTime}
                volume={25}
                source={currentTrack().source}
                onPlaybackStateChange={handlePlaybackStateChange}
                onLoadingStateChange={handleLoadingStateChange}
                onTimeUpdate={handleTimeUpdate}
                onPlayerStateChange={handlePlayerStateChange}
                onEnd={handleSkipTrack('next')}
            />

            <div class="flex gap-1 text-sm text-primary-100">
                <span>
                    {currentTrack().duration
                        ? formatTime(state.currentTime)
                        : '--'}
                </span>
                <span>/</span>
                <span>
                    {currentTrack().duration
                        ? formatTime(currentTrack().duration)
                        : '--'}
                </span>
            </div>
        </div>
    );
};

export default Player;
