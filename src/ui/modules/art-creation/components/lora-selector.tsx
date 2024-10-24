import { Button, Flex, Image, InputNumber, Popover } from 'antd';
import { useArtCreationController } from '../hooks';
import './lora-selector.css';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import { useMemo, useState } from 'react';
import { IEditTableDataItem } from '../art-creation-store';


export interface ILoraSelectorProps {

    value: IEditTableDataItem;
}

interface ILoraModelListProps {
    dataSources: any[];
}

export const LoraModelList = (props: ILoraModelListProps) => {
    const { dataSources, onItemValueChange, onItemSelect } = props;
    return <div className={classNames('lora-model')}>
        <Flex wrap={'wrap'} gap={'large'} justify={'space-around'}>
            {dataSources.map((item) => {
                return <Flex
                    vertical key={item.key} gap={'middle'}
                    onClick={() => onItemSelect(item)}>
                    <div>
                        权重：<InputNumber
                            size={'small'}
                            precision={2}
                            value={item.weight || 1}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                            onChange={value => onItemValueChange(value, 'weight', item)}
                        />
                    </div>
                    <div className={classNames(item.isSelected ? 'lora-model-item-selected' : '', 'lora-model-item')}>
                        <Image
                            preview={false}
                            width={150}
                            height={150}
                            className={classNames('lora-model-item-image')}
                            src={item.imageUrl}
                        />
                    </div>
                    <div>
                        <p className={classNames('lora-model-text')}>
                            {item.name || ''}
                        </p>
                    </div>
                </Flex>;

            })}
        </Flex>
    </div>;
};


export const LoraSelector = (props: ILoraSelectorProps) => {
    const { dataSources, onOpenChange, onItemSelect, onItemValueChange } = props;
    const handleOpenChange = (isOpen: boolean) => {
        onOpenChange?.(isOpen, dataSources);
    };
    return <Flex vertical align={'center'}>
        <div>
            <Popover
                content={
                    <LoraModelList
                        onItemSelect={onItemSelect}
                        onItemValueChange={onItemValueChange}
                        dataSources={dataSources}
                    />}
                title="选择画面风格"
                onOpenChange={handleOpenChange}
                trigger="click">
                <Button>设置画面风格</Button>
            </Popover>
        </div>
    </Flex>;
};


export const useLoraSelectorModel = (options) => {
    const { dataSources, rowData, selectItems } = options;
    const controller = useArtCreationController();
    const newDataSources = useMemo(() => {
        return dataSources.map(item => {
            const selectedIndex = selectItems.findIndex(selectItem => selectItem.key === item.key);
            return {
                key: item.name,
                weight: item.weight || 1.00,
                name: item.name,
                imageUrl: item.imageUrl,
                isSelected: selectedIndex !== -1
            };
        });
    }, [dataSources, selectItems]);
    const [loraModelList, setLoraModelList] = useState(newDataSources);
    const handleOpenChange = (isOpen: boolean) => {
        // 如果是关闭需要保存数据
        if (!isOpen) {
            controller.setRowItemLoraPrompts(loraModelList.filter(item => item.isSelected), rowData);
        }

        if (isOpen) {
            setLoraModelList(newDataSources || []);
        }
    };

    const handleItemSelect = (loraModel: any) => {
        setLoraModelList((preState) => {
            const nextState = [...preState];
            const index = nextState?.findIndex(item => item.key === loraModel.key);
            nextState[index].isSelected = !loraModel.isSelected;
            return nextState;
        });

    };

    const handleItemValueChange = (value: number, dataIndex: string, loraModel: any) => {
        setLoraModelList((preState) => {
            const nextState = [...preState];
            const index = nextState?.findIndex(item => item.key === loraModel.key);
            nextState[index][dataIndex] = value;
            return nextState;
        });
    };


    return {
        dataSources: loraModelList,
        handleOpenChange,
        handleItemSelect,
        handleItemValueChange
    };
};

export const LoraSelectorModel = observer((props: ILoraSelectorProps) => {
    const controller = useArtCreationController();
    const options = useLoraSelectorModel({
        selectItems: props.record.loras || [],
        rowData: props.record,
        dataSources: controller.store.loraModelList
    });
    const { dataSources, handleOpenChange, handleItemSelect, handleItemValueChange } = options;
    return <LoraSelector
        onOpenChange={handleOpenChange}
        onItemSelect={handleItemSelect}
        onItemValueChange={handleItemValueChange}
        dataSources={dataSources}
    />;
});













