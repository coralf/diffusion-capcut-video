import { Layout, theme } from 'antd';
import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { useDefaultRouterMenu, useRouterMenus } from '../config/hooks';
import { SiderMenu } from './sider-menu';

const { Header, Sider, Content } = Layout;

export const MainLayout = (props: any) => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    const navigate = useNavigate();
    const defaultRouterMenu = useDefaultRouterMenu();
    const [currentSelectMenuKey, setCurrentSelectMenuKey] = useState(defaultRouterMenu?.path as string);
    const routerMenus = useRouterMenus();

    const toLink = (path: string) => {
        navigate(path);
    };

    const handleMenuClick = (item) => {
        toLink(item.key);
        setCurrentSelectMenuKey(item.key);
    };


    useEffect(() => {
        toLink(defaultRouterMenu?.path as string);
    }, []);


    return (
        <Layout style={{ height: 'calc(100vh - 26px)' }}>
            <Sider
                breakpoint="lg"
                collapsedWidth="0"
                trigger={null}
                collapsible
                width={60}
                style={{ backgroundColor: '#1f1f1f' }}
                collapsed={collapsed}>
                <SiderMenu
                    menuItems={routerMenus}
                    selectedItemKey={currentSelectMenuKey}
                    onMenuItemClick={handleMenuClick}
                />
            </Sider>
            <Layout>
                <Content
                    style={{
                        padding: '12px 8px 8px 8px',
                        minHeight: 280,
                        overflow: 'hidden',
                        background: colorBgContainer,
                    }}
                >
                    <Outlet />
                </Content>
            </Layout>
        </Layout>

    );
};

