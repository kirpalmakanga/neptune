export interface MenuItemData {
    title: string;
    icon: string;
    onClick: (...args: any[]) => void;
}

export type MenuOpener = (data: {
    title: string;
    items: MenuItemData[];
}) => void;

export interface MenuState {
    items: MenuItemData[];
    isOpen: boolean;
    title: string;
    callbackData: object;
}

export const initialState = (): MenuState => ({
    items: [],
    isOpen: false,
    title: '',
    callbackData: {}
});
