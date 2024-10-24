import { routes } from './router-menu-config';

export const useRouterMenus = () => {
    return routes.map(item => {
        return { ...item, key: item.path };
    });
};

export const useDefaultRouterMenu = () => {
    const routerMenus = useRouterMenus();
    return routerMenus.find(item => item.defaultRouter);
};