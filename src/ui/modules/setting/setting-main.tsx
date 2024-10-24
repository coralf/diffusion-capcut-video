import { Button, Form, Input, Card } from 'antd';
import { useSettingController } from './context';
import { observer } from 'mobx-react-lite';
import { IGlobalSetting } from '../../../app/services/setting/interface';


export const SettingMain = observer(() => {
    const controller = useSettingController();


    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        controller.updateGlobalSetting();
    }

    const handleClick = () => {
        controller.selectFolder();
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, key: keyof IGlobalSetting) => {
        controller.setGlobalSetting({
            [key]: e.target.value?.trim() || ''
        });
    };

    return <div>
        <Card title="基础配置" bordered={false}>
            <Form
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 12 }}
            >
                <Form.Item label="剪映工作空间" required rules={[{ required: true, message: '请选择剪映工作空间' }]}>
                    <Input value={controller.globalSetting?.jianyingWorkspace}
                        suffix={<Button type="primary" size="small" onClick={handleClick}>选择</Button>} />
                </Form.Item>
            </Form>
        </Card>
        <Card title="Stable Diffusion" bordered={false}>
            <Form
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 12 }}
            >
                <Form.Item label="stable diffusion webui 地址"
                    required
                    rules={[{ required: true, message: '请输入 stable diffusion webui 地址' }]}>
                    <Input value={controller.globalSetting?.stableDiffusionBaseUrl} placeholder="127.0.0.1:7860"
                        onBlur={handleBlur}
                        onChange={v => handleChange(v, 'stableDiffusionBaseUrl')} />
                </Form.Item>
            </Form>
        </Card>
    </div>
})
