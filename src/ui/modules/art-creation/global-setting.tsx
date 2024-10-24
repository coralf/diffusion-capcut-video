import { Flex, Select, Spin } from 'antd';
import { useArtCreationController } from './hooks';
import { observer } from 'mobx-react-lite';


export const GlobalSetting = observer(() => {
    const controller = useArtCreationController();

    return <div>
        <Flex gap={'small'} justify={'center'} align={'center'}>
            <span style={{ color: 'white' }}>
                SD模型：
            </span>
            <Spin spinning={controller.store.sdModelSelectLoading} tip={'正在切换模型'}>
                <Select
                    style={{ width: 200 }}
                    onChange={controller.handleSdModelChange}
                    value={controller.store.sdModel}
                    options={controller.store.sdModelList}
                />
            </Spin>
        </Flex>
    </div>;
});
