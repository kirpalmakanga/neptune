import {
    initialState as playlistsInitialState,
    PlaylistsState
} from './playlists/_state';
import {
    initialState as playerInitialState,
    PlayerState
} from './player/_state';
import {
    initialState as notificationsInitialState,
    NotificationState
} from './notifications/_state';
import {
    initialState as promptInitialState,
    PromptState
} from './prompt/_state';

export interface RootState {
    playlists: PlaylistsState;
    player: PlayerState;
    notifications: NotificationState;
    prompt: PromptState;
}

export const rootInitialState = (): RootState => ({
    playlists: playlistsInitialState(),
    player: playerInitialState(),
    notifications: notificationsInitialState(),
    prompt: promptInitialState()
});
