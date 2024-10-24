import React from 'react';

import { AppstoreAddOutlined, SettingOutlined } from '@ant-design/icons';

import { ArtCreationPage } from '../../modules/art-creation';
import { SettingPage } from '../../modules/setting';

export interface IRouterMenu {
    path: string;
    icon: React.ReactNode;
    label: string;
    key?: string;
    // 是否是默认路由
    defaultRouter?: boolean;
    routerElement?: React.ReactNode;
}

export enum ERouterPath {
    ArtCreation = '/art-creation',
    Setting = '/setting',
}

export const routes: IRouterMenu[] = [
    {
        path: ERouterPath.ArtCreation,
        icon: <AppstoreAddOutlined />,
        label: '创作',
        defaultRouter: true,
        routerElement: <ArtCreationPage />
    },
    {
        path: ERouterPath.Setting,
        icon: <SettingOutlined />,
        label: '设置',
        routerElement: <SettingPage />
    }
];


