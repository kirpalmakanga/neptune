import { createContext, useContext, Component, createEffect } from 'solid-js';
import { createStore, SetStoreFunction, Store } from 'solid-js/store';
import { createLocalStorage } from '@solid-primitives/storage';
import { rootInitialState, RootState } from './_state';
import { mergeDeep } from '../utils/helpers';

const StoreContext = createContext();

const storageKey = 'neptune';

export const StoreProvider: Component = (props) => {
    const [storage, setStorage] = createLocalStorage();
    const store = createStore<RootState>(
        mergeDeep(
            rootInitialState(),
            JSON.parse(storage[storageKey]) || {}
        ) as RootState
    );

    createEffect(() => {
        const [{ playlists }] = store;

        setStorage(
            storageKey,
            JSON.stringify({
                playlists
            })
        );
    });

    return (
        <StoreContext.Provider value={store}>
            {props.children}
        </StoreContext.Provider>
    );
};

export const useStore = () =>
    useContext(StoreContext) as [Store<RootState>, SetStoreFunction<RootState>];
