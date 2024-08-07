import { useStore } from '..';
import { delay } from '../../utils/helpers';
import { initialState, MenuOpener } from './_state';

export const useMenu = () => {
    const [{ menu }, setState] = useStore();

    const openMenu: MenuOpener = (data) => {
        if (menu.isOpen) {
            return;
        }

        setState('menu', { isOpen: true, ...data });
    };

    const closeMenu = async () => {
        setState('menu', { isOpen: false });

        await delay(300);

        setState('menu', initialState());
    };

    return [menu, { openMenu, closeMenu }] as const;
};
