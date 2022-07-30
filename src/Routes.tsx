import { Route, Routes } from '@solidjs/router';
import { Component } from 'solid-js';

import Playlist from './pages/Playlist';

const Router: Component = () => (
    <Routes>
        <Route path="/playlist/:playlistId" component={Playlist} />
    </Routes>
);

export default Router;
