import { Flex, Image, Input, Select, Spin, InputNumber } from 'antd';
import { observer } from 'mobx-react';
import React from 'react';

import { MultiGridSelect } from '../../components/multi-grid-select';
import { IEditTableDataItem } from './art-creation-store';
import { LoraSelectorModel } from './components/lora-selector';
import { useArtCreationController } from './hooks';
import { DEFAULT_RANDOM_SEED } from '../../../common/constants';

export const enum InputType {
    TextArea = 'textArea',
    Input = 'input',
    Img = 'img',
    LoraSelect = 'loraSelect',
    MultiGridSelect = 'multiGridSelect',
    TagSelect = 'tagSelect',
    InputNumber = 'inputNumber',
}


export interface EditableCellProps {
    editing: boolean;
    dataIndex: keyof IEditTableDataItem;
    title: any;
    inputType: InputType,
    record: IEditTableDataItem;
    index: number;
    value: IEditTableDataItem[keyof IEditTableDataItem];
    children: React.ReactNode;
    onCellValueChange: (value: any) => void;
}

const renderCellItem = (options: EditableCellProps) => {
    const componentMapper = {
        [InputType.TextArea]: () => {
            return <Input.TextArea
                // showCount
                // maxLength={100}
                // defaultValue={options.value || ''}
                value={options.value || ''}
                style={{
                    ...options.componentProps?.style,
                    height: options.componentProps?.style?.height || 150,
                    resize: 'none'
                }}
                onChange={(v) => options.onCellValueChange(v.target.value || '')}
            />;
        },
        [InputType.Input]: () => {
            return <Input value={options.value || ''}
                onChange={(v) => options.onCellValueChange(v.target.value || '')}
            />;
        },
        [InputType.InputNumber]: () => {
            return <InputNumber min={1} max={1000000} value={options.value}
                onChange={(value) => options.onCellValueChange(value)}
            />;
        },
        [InputType.Img]: () => {
            return <Flex justify={'center'}>
                <Spin spinning={options.value?.loading || false}>
                    {options.value?.src ? <Image
                        src={options.value.src}
                        onChange={(v) => options.onCellValueChange(options.value)}
                        width={150}
                        height={150}
                    /> : <div style={{ width: 150, height: 150 }}></div>}
                </Spin>
            </Flex>;
        },
        [InputType.LoraSelect]: () => {
            return <LoraSelectorModel {...options} />;
        },
        [InputType.MultiGridSelect]: () => {
            return <Flex justify={'center'}>
                <Spin spinning={options.value?.loading || false}>
                    <MultiGridSelect  {...options} onSelect={options.onCellValueChange} />
                </Spin>
            </Flex>;
        },
        [InputType.TagSelect]: () => {
            return <Select
                allowClear
                mode="tags"
                maxTagCount={100}
                style={{ width: '100%', maxHeight: 150 }}
                placeholder={'请输入或选择画面描述词'}
                onChange={(v) => {
                }}
            />;
        }
    };
    return componentMapper[options.inputType]() || null;
};

export const EditableCell: React.FC<EditableCellProps> = observer((props) => {

    const {
        editing,
        dataIndex,
        title,
        inputType,
        record,
        index,
        children,
        ...restProps
    } = props;

    const controller = useArtCreationController();

    const handleChange = (value: any) => {
        controller.handleCellValueChange(value, record, dataIndex);
    };

    const renderProps: EditableCellProps = {
        ...props,
        ...restProps,
        onCellValueChange: handleChange
    };

    if (!props.editing) {
        const { render, ...restTdProps } = restProps;
        return (
            <td {...restTdProps} >
                {children}
            </td>
        );
    }

    return (
        <td {...restProps} style={{ padding: 0 }}>
            {renderCellItem(renderProps)}
        </td>
    );
});
