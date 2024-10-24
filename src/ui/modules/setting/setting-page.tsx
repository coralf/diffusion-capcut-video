import { useMemo } from 'react';
import { SettingProvider } from './context';
import { SettingController } from './setting-controller';
import { SettingMain } from './setting-main';


export const SettingPage = () => {

    const controller = useMemo(() => new SettingController(), []);


    return <div>
        <SettingProvider value={controller}>
            <SettingMain />
        </SettingProvider>
    </div>
}
