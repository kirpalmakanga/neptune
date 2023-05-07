import { Route, Routes } from '@solidjs/router';
import { Component } from 'solid-js';
import { Transition } from 'solid-transition-group';

import Playlist from './pages/Playlist';

const Router: Component = () => (
    <Transition name="fade" mode="outin">
        <Routes>
            <Route path="/playlist/:playlistId" component={Playlist} />
        </Routes>
    </Transition>
);

export default Router;
