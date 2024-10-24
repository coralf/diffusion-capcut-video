import { Button, message, notification, Popconfirm, Progress, Space, Tooltip } from 'antd';
import { useAppProps } from 'antd/es/app/context';
import { observer } from 'mobx-react-lite';

import { useArtCreationController } from '../hooks';
import { ExportJianyingProject } from './export-jianying-project';

export const ProgressFormat = observer(() => {
    const controller = useArtCreationController();
    return <Progress {...controller?.store?.progressProps} />
})

export const useBatchTextToImage = (api: useAppProps['notification']) => {
    const controller = useArtCreationController();

    const handleBatchImage = () => {
        const progressKey = '1';
        controller.batchToImage()
            .then(() => {
                api.success({
                    message: '批量生成图片成功',
                    description: '批量生成图片成功',
                    duration: null
                })
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                api.destroy(progressKey);
            });
        api.info({
            key: progressKey,
            message: `批量生成图片中`,
            description: <ProgressFormat />,
            placement: 'topRight',
            closeIcon: false,
            duration: null
        });
    };

    return handleBatchImage;
};
export const Actions = observer(() => {
    const controller = useArtCreationController();
    const [api, contextHolder] = notification.useNotification();

    const batchTextToImage = useBatchTextToImage(api);

    const handleSave = () => {
        controller.save();
    };

    const importTextDesc = (
        <div style={{ color: '#ff7875', zIndex: 2 }}>
            <p>
                一键导入文案会根据剪切板上复制的文本
            </p>
            <p>
                按每一行创建一条分镜
            </p>
            <p>
                以逗号分隔文案会展示在一个分镜里面
            </p>
        </div>
    );



    return <Space>
        <Popconfirm
            placement={'right'}
            title="一键导入文案？"
            description={importTextDesc}
            onConfirm={controller.importText}
            okText="确定导入"
            cancelText="取消"
        >
            <Button>导入文案</Button>
        </Popconfirm>
        <Tooltip title={'复制文案到剪贴板,用于生成音频和字幕'}>
            <Button onClick={controller.copyText}>复制配音文案</Button>
        </Tooltip>
        <Button onClick={batchTextToImage}>{contextHolder}批量生图</Button>
        <Button onClick={controller.batchHighImage}>批量2k画质</Button>
        <ExportJianyingProject />
        <Button type={'primary'} onClick={handleSave}>保存</Button>
    </Space>;
});
