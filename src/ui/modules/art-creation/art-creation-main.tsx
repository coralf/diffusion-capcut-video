import { Flex } from 'antd';
import { observer } from 'mobx-react-lite';

import { ArtCreationTable } from './art-creation-table';
import { Actions } from './components/actions';
import { RowControl } from './components/row-control';
import { GlobalSetting } from './global-setting';

export const ArtCreationMain = observer(() => {


    return <Flex vertical gap={'large'}>
        {/* <GlobalSetting /> */}
        <Actions />
        <ArtCreationTable />
        <RowControl />
    </Flex>
});
