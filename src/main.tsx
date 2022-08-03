import { render } from 'solid-js/web';
import { Router } from '@solidjs/router';
import Root from './Root';
import { StoreProvider } from './store';

import 'virtual:windi.css';
import './assets/styles/main.scss';
import Routes from './Routes';

const appContainer = document.querySelector('#app');
const loader = document.querySelector('#app-loader');

if (appContainer) {
    render(
        () => (
            <StoreProvider>
                <Router>
                    <Root>
                        <Routes />
                    </Root>
                </Router>
            </StoreProvider>
        ),
        appContainer
    );
}

if (loader) {
    loader.addEventListener('transitionend', () => loader.remove(), {
        once: true
    });
    loader.classList.add('is--hidden');
}
