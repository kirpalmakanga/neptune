import { useStore } from '..';
import { delay } from '../../utils/helpers';
import { initialState } from './_state';

interface Options {
    callback?: Function;
    callbackButtonText?: string;
}

export const useNotifications = () => {
    const [{ notifications }, setState] = useStore();

    const closeNotification = async () => {
        setState('notifications', {
            isVisible: false
        });

        await delay(300);

        setState('notifications', initialState());
    };

    const openNotification = async (message: string, options: Options = {}) => {
        setState('notifications', {
            isVisible: true,
            message,
            ...options
        });

        if (!options.callback) {
            await delay(4000);

            const { isVisible } = notifications;

            if (isVisible) closeNotification();
        }
    };

    return [
        notifications,
        {
            openNotification,
            closeNotification
        }
    ] as const;
};
