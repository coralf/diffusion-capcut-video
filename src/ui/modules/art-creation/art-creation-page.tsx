import { ArtCreationProvider } from './context';
import { ArtCreationMain } from './art-creation-main';
import { useEffect, useMemo } from 'react';
import { ArtCreationController } from './art-creation-controller';
import { IGlobalSetting } from '../../../app/services/setting/interface';
import { useNavigate } from 'react-router-dom';
import { ERouterPath } from '../../routers/config/router-menu-config';
import { App } from 'antd';

export const ArtCreationPage = () => {
    const antApi = App.useApp();
    const controller = useMemo(() => new ArtCreationController({
        antApi
    }), []);
    const navigate = useNavigate();

    const checkData = async () => {
        const globalSetting = await controller.getGlobalSetting() as IGlobalSetting;
        if (!globalSetting.jianyingWorkspace) {
            navigate(ERouterPath.Setting);
        }
    };

    useEffect(() => {
        checkData();
    }, []);


    return (
        <ArtCreationProvider value={controller}>
            <ArtCreationMain />
        </ArtCreationProvider>
    );

};
