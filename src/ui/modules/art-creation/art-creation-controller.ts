import { useAppProps } from 'antd/es/app/context';
import { omit } from 'lodash';
import { IReactionDisposer } from 'mobx';
import { v4 } from 'uuid';

import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

import { IMetaSchema } from '../../../app/services/meta-schema/interface';
import { CreateBeanManager, IocContainer } from '../../../common/ioc-manager';
import { copyToClipboard, toJSON } from '../../utils/utils';
import { ArtCreationStore, IEditTableDataItem } from './art-creation-store';
import { GlobalSettingService } from './services/global-setting-service';
import { InitialService } from './services/initial-service';
import { ipcRender, IpcUiService } from './services/ipc-ui-service';
import { StableDiffusionService } from './services/stable-diffusion-service';
import { KolorsService } from './services/kolors-service';
import { DEFAULT_RANDOM_SEED } from '../../../common/constants';

export interface IArtCreationOptions {
    antApi: useAppProps;
}

export class ArtCreationController {
    public context: IocContainer;
    public disposers: IReactionDisposer[] = [];
    public antApi: useAppProps;

    private get globalSettingService() {
        return this.context.getBean<GlobalSettingService>(
            GlobalSettingService.name,
        );
    }

    private get ipcUiService() {
        return this.context.getBean<IpcUiService>(IpcUiService.name);
    }

    private get artCreationStore() {
        return this.context.getBean<ArtCreationStore>(ArtCreationStore.name);
    }

    private get kolorsService() {
        return this.context.getBean<KolorsService>(KolorsService.name);
    }

    private get stableDiffusionService() {
        return this.context.getBean<StableDiffusionService>(
            StableDiffusionService.name,
        );
    }

    /**
     * Constructs a new instance of the class.
     *
     * @return {type} description of return value
     * @param options
     */
    public constructor(options: IArtCreationOptions) {
        this.antApi = options.antApi;
        this.context = CreateBeanManager({
            instances: {
                [ArtCreationController.name]: this,
                antApi: this.antApi,
            },
            beans: [
                IpcUiService,
                InitialService,
                GlobalSettingService,
                ArtCreationStore,
                StableDiffusionService,
                KolorsService,
            ],
        });
    }

    public get store() {
        return this.artCreationStore.getStore();
    }

    public getGlobalSetting() {
        return this.ipcUiService.getGlobalSetting();
    }

    private autoSave() {
        // 10秒做一次自动保存
        return setInterval(() => {
            this.saveMetaSchema();
        }, 1000 * 20);
    }

    private saveMetaSchema() {
        const metaSchema = this.getCleanMetaSchema();
        return ipcRender.invoke('saveMetaSchema', toJSON(metaSchema));
    }

    private getCleanMetaSchema() {
        const editTableDataSource = this.store.editTableDataSource.map(
            (item) => {
                return this.getCleanEditTableDataItem(item);
            },
        );
        return { editTableDataSource } as Partial<IMetaSchema>;
    }

    private getCleanEditTableDataItem(item: IEditTableDataItem) {
        const cleanItem = omit(
            item,
            'multiGridSelect.imgSrc',
            'multiGridSelect.loading',
            'image.loading',
            'image.src',
            'loading',
        );
        return cleanItem;
    }

    public save = async () => {
        this.showLoading(true, '正在保存');
        await this.saveMetaSchema();
        this.showLoading(false);
        this.antApi.message.success('保存成功');
    };

    public addRow() {
        const nextData = this.store.editTableDataSource.slice();
        nextData.push({ id: v4(), randomSeed: DEFAULT_RANDOM_SEED });
        this.artCreationStore.setStore({
            editTableDataSource: nextData,
        });
        setTimeout(() => {
            const tableBody =
                document.getElementsByClassName('ant-table-body')[0];
            tableBody.scrollTo({
                top: tableBody.scrollHeight,
                behavior: 'smooth',
            });
        });
    }

    public addRowTo(rowData: IEditTableDataItem) {
        const nextData = this.store.editTableDataSource.slice();
        const index = nextData.findIndex((item) => item.id === rowData.id);
        if (index !== -1) {
            nextData.splice(index + 1, 0, {
                id: v4(),
                randomSeed: DEFAULT_RANDOM_SEED,
            });
            this.artCreationStore.setStore({
                editTableDataSource: nextData,
            });
        }
    }

    public handleCellValueChange(
        changedValue: IEditTableDataItem[keyof IEditTableDataItem],
        rowData: IEditTableDataItem,
        dataIndex: keyof IEditTableDataItem,
    ) {
        const nextData = this.store.editTableDataSource.slice();
        const changeIndex = nextData.findIndex(
            (item) => item.id === rowData.id,
        );
        if (changeIndex === -1) return;
        const changeRowItem = nextData[changeIndex] as IEditTableDataItem;
        changeRowItem[dataIndex] = changedValue;
        nextData.splice(changeIndex, 1, changeRowItem);
        this.artCreationStore.setStore({
            editTableDataSource: nextData,
        });
    }

    public delRow = (record: IEditTableDataItem) => {
        const nextData = this.store.editTableDataSource.slice();
        const delIndex = nextData.findIndex((item) => item.id === record.id);
        if (delIndex !== -1) {
            nextData.splice(delIndex, 1);
            this.artCreationStore.setStore({
                editTableDataSource: nextData,
            });
        }
    };

    public textToImage = (record: IEditTableDataItem) => {
        // return this.stableDiffusionService.textToImage([toJSON(record)], 0);
        this.kolorsService.textToImage(toJSON(record));
    };

    public highImage(record: IEditTableDataItem) {
        this.stableDiffusionService.textToImage([toJSON(record)], 0, true);
    }

    public batchHighImage = () => {
        this.kolorsService.upscale();
    };

    public batchToImage = () => {
        return this.kolorsService.batchTextToImage(
            toJSON(this.store.editTableDataSource),
        );
        // return this.stableDiffusionService.textToImage(
        //     toJSON(this.store.editTableDataSource),
        //     0,
        // );
    };

    /**
     * update the view with the given data, can be batch or single
     *
     * @param {IEditTableDataItem[]} data - The data to update the view with.
     */
    public updateView(data: IEditTableDataItem[]) {
        // 批量
        if (data?.length > 1) {
            this.artCreationStore.setStore({
                editTableDataSource: data,
            });
        } else if (data?.length === 1) {
            // 单个
            const newData = this.store.editTableDataSource.slice();
            const rowItem = data[0];
            const index = newData.findIndex((item) => item.id === rowItem.id);
            newData[index] = rowItem;
            this.artCreationStore.setStore({
                editTableDataSource: newData,
            });
        }
    }

    public exportJianYingProject = async (mediaPaths: object) => {
        this.showLoading(true, '正在导出剪映项目');
        await this.saveMetaSchema();
        await ipcRender.invoke('exportJianYingProjectWithMedia', mediaPaths);
        this.showLoading(false);
        this.antApi.message.success('导出剪映项目成功');
    };

    public showLoading(loading: boolean, text: string = '正在加载') {
        const spinning = loading;
        const options = {
            spinning,
            tip: spinning ? text : '',
        };
        this.artCreationStore.setStore({
            spinProps: options,
        });
    }

    public handleDragEnd = (options: DragEndEvent) => {
        const { active, over } = options;
        if (active.id !== over?.id) {
            const previousData = this.store.editTableDataSource.slice();
            const activeIndex = previousData.findIndex(
                (i) => i.id === active.id,
            );
            const overIndex = previousData.findIndex((i) => i.id === over?.id);
            const nextData = arrayMove(previousData, activeIndex, overIndex);
            this.artCreationStore.setStore({
                editTableDataSource: nextData,
            });
        }
    };

    public delRowBy = (data: IEditTableDataItem) => {
        this.delRow(data);
    };

    public handleSdModelChange = async (value: any) => {
        this.artCreationStore.setStore({
            sdModelSelectLoading: true,
        });
        await this.globalSettingService.updateSdConfig({
            sd_model_checkpoint: value,
        });
        this.artCreationStore.setStore({
            sdModel: value,
            sdModelSelectLoading: false,
        });
    };

    public setRowItemLoraPrompts = (loraModels: any[], rowData: any) => {
        const editTableDataSource =
            this.store.editTableDataSource?.slice() || [];
        const rowIndex = editTableDataSource.findIndex(
            (item) => item.id === rowData.id,
        );
        if (rowIndex !== -1) {
            editTableDataSource[rowIndex].loras = loraModels;
            this.artCreationStore.setStore({
                editTableDataSource,
            });
        }
    };

    public copyText = () => {
        const text = this.store.editTableDataSource
            ?.map((item) => item.writingText?.trim())
            .join('\n');
        copyToClipboard(text || '');
        this.antApi.message.success('已将文案复制到剪贴板');
    };

    public importText = () => {
        navigator.clipboard
            .readText()
            .then((text) => {
                const nextData = this.store.editTableDataSource.slice();
                text.split('\n').forEach((segmentText) => {
                    const multiTextInOneSegment = segmentText
                        ?.replaceAll(',', '\n')
                        .replaceAll('，', '\n')
                        .trim();
                    nextData.push({
                        id: v4(),
                        writingText: multiTextInOneSegment || segmentText,
                        loras: [],
                        prompts: '',
                        negativePrompts: '',
                    });
                });
                this.artCreationStore.setStore({
                    editTableDataSource: nextData,
                });
            })
            .catch((err) => {
                console.error('Unable to read text from clipboard', err);
                this.antApi.message.warning('请复制文案');
            });
    };
}
