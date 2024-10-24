import { JianYingSchema } from "./JianYingSchema";
import { IDraftMaterial, IJianYingProject, IMaterials, ISrt, IValue } from "./interface";
import fs from "fs";
import path from "path";
import ffmpeg from "fluent-ffmpeg";
import sharp from "sharp";
import { MetaSchemaService } from "../meta-schema/MetaSchemaService";
import { SettingService } from "../setting/SettingService";
import { parseSync } from "subtitle";
import { add, multiply, subtract } from "lodash";
import { Autowired, Bean } from "../../../common/ioc-manager";
import { IEditTableDataItem } from "../../../ui/modules/art-creation/art-creation-store";


@Bean
export class JianYingService {

    private schema: JianYingSchema;
    @Autowired
    private settingService!: SettingService;


    @Autowired
    private metaSchemaService!: MetaSchemaService;


    public constructor() {
        this.schema = new JianYingSchema();
    }

    private getSrtList(path: string) {
        const srt = fs.readFileSync(path, 'utf8');
        // 读取字幕文件解析获取每一段字幕开始结束信息
        const srtList = parseSync(srt) as ISrt[];
        return srtList;
    }


    public async exportJianYingProjectWithMedia(mediaPaths: { srt: string; audio: string }) {
        const { srt: srtPath, audio: audioPath } = mediaPaths;
        const srtList = this.getSrtList(srtPath);
        // 读取音频文件获取音频文件播放时长
        const audio = await this.getAudioInfo(audioPath);
        const audioMsDuration = audio.duration;
        // 创建每一张图片与字幕的对应关系集合
        // const segments = this.createSegments();
        const metaSchema = this.metaSchemaService.getMetaSchema();
        // 创建 draft_meta_info.json 文件需要的资源
        const draftMaterials = await this.createSegmentsDraftMaterialValues(metaSchema?.editTableDataSource!, audioPath, audioMsDuration);
        const jianyingWorkspace = this.settingService.globalSetting.jianyingWorkspace;
        // 项目名
        const date = new Date();
        const projectName = `${date.getMonth() + 1}-${date.getDate()}`;
        // 创建 draft_meta_info.json 文件整个json结构
        const draftMetaInfo = this.schema.createDraftMetaInfoBase({
            draftRootPath: jianyingWorkspace,
            projectName: projectName,
            draftMaterials: draftMaterials
        });
        const audioDraftMaterialValue = this.findDraftMaterialValueByPath(draftMaterials[0].value, audioPath) as IValue;
        const { tracks, draftInfoMaterials, duration } = this.getTrackMaterialV2({
            editTableDataSources: metaSchema?.editTableDataSource!,
            audioDraftMaterialValue,
            srtList
        });
        // 创建整个 draft_info.json 文件的json
        const draftInfo = this.schema.createDraftInfoBase({
            materials: draftInfoMaterials,
            tracks,
            duration
        });
        const project = {
            draftMetaInfo,
            draftInfo,
        };
        this.saveProject(project);
    }


    private async createSegmentsDraftMaterialValues(editTableDataSources: IEditTableDataItem[], audioPath: string, audioMsDuration: number) {
        const draftMaterialValues: IValue[] = [];
        const draftMaterialsValue = this.createAudioDraftMaterialsValue(audioPath, audioMsDuration);
        draftMaterialValues.push(draftMaterialsValue);
        for (const item of editTableDataSources) {
            const duration = 0;
            const filePath = item.image?.path!;
            const imageMetadata = await this.getImageMetadata(filePath);
            // 图片的文件名
            const extraInfo = path.basename(filePath);
            const width = imageMetadata.width;
            const height = imageMetadata.height;
            const draftMaterialsValue = this.schema.createDraftMaterialsItem({
                duration: duration,
                // 资源名称
                extra_info: extraInfo,
                // 资源绝对路径
                file_Path: filePath,
                metetype: 'photo',
                roughcut_time_range: {
                    duration: duration,
                    start: 0
                },
                sub_time_range: {
                    duration: -1,
                    start: -1
                },
                height: height,
                width: width
            });
            draftMaterialValues.push(draftMaterialsValue);
        }
        const draftMaterials: IDraftMaterial[] = [
            {
                type: 0,
                value: draftMaterialValues
            }
        ];
        return draftMaterials;
    }

    private createAudioDraftMaterialsValue(audioPath: string, audioMsDuration: number) {
        // 创建音频资源
        const audioName = path.basename(audioPath) as string;
        return this.schema.createDraftMaterialsItem({
            duration: audioMsDuration,
            // 资源名称
            extra_info: audioName,
            // 资源绝对路径
            file_Path: audioPath,
            metetype: 'music',
            roughcut_time_range: {
                duration: audioMsDuration,
                start: 0
            },
            sub_time_range: {
                duration: -1,
                start: -1
            },
            height: 0,
            width: 0
        });
    }

    public getTrackMaterialV2(options: {
        editTableDataSources: IEditTableDataItem[];
        audioDraftMaterialValue: IValue;
        srtList: ISrt[];
    }) {
        const { editTableDataSources, audioDraftMaterialValue, srtList } = options;
        const draftInfoMaterials: IMaterials = this.schema.createMaterials();
        const videoTrack = this.schema.createTrack({ type: 'video' });
        const textTrack = this.schema.createTrack({ type: 'text' });
        const {
            audioTrack,
            audioSpeed,
            audioBeat,
            audioSoundChannelMapping,
            audioVocalSeparation,
            materialAudio
        } = this.createAudioTrackItem(audioDraftMaterialValue!);
        draftInfoMaterials.speeds.push(audioSpeed);
        draftInfoMaterials.beats.push(audioBeat);
        draftInfoMaterials.sound_channel_mappings.push(audioSoundChannelMapping);
        draftInfoMaterials.vocal_separations.push(audioVocalSeparation);
        draftInfoMaterials.audios.push(materialAudio);
        const audioTrackDuration = audioTrack.segments[0]['source_timerange']?.duration || 0;

        let fromValue = 0.35;
        let toValue = 0;
        let currentStart = 0;
        let currentSrtIndex = 0;
        for (const editTableDataItem of editTableDataSources) {
            let currentSegmentDuration = 0;
            const texts = editTableDataItem?.writingText?.toString()?.split('\n')?.filter(text => text?.trim() !== '') || [];
            for (let i = 0; i < texts.length; i++) {
                // text
                const text = texts[i];
                const srtInfo = srtList[currentSrtIndex];
                const nextSrtInfo = srtList[currentSrtIndex + 1];
                const {
                    textTrackItem,
                    materialText,
                    textMaterialAnimation
                } = this.createTextTrackItem(srtInfo, nextSrtInfo, audioTrackDuration, text);
                textTrack.segments.push(textTrackItem);
                draftInfoMaterials.texts.push(materialText);
                draftInfoMaterials.material_animations.push(textMaterialAnimation);
                currentSegmentDuration = add(currentSegmentDuration, textTrackItem['target_timerange'].duration);
                currentSrtIndex++;
                if (i === 0) {
                    currentStart = textTrackItem['target_timerange'].start;
                }
            }

            // video
            const {
                videoTrackItem,
                videoSpeed,
                videoCanvas,
                videoMaterialAnimation,
                videoSoundChannelMapping,
                videoVocalSeparation,
                materialVideo
            } = this.createVideoTrackItem(editTableDataItem, currentSegmentDuration, fromValue, toValue, currentStart);
            videoTrack.segments.push(videoTrackItem);
            draftInfoMaterials.speeds.push(videoSpeed);
            draftInfoMaterials.canvases.push(videoCanvas);
            draftInfoMaterials.material_animations.push(videoMaterialAnimation);
            draftInfoMaterials.sound_channel_mappings.push(videoSoundChannelMapping);
            draftInfoMaterials.vocal_separations.push(videoVocalSeparation);
            draftInfoMaterials.videos.push(materialVideo);
            /**
             * 1、0.5 > 0
             * 2、-0.5 > 0
             * 3、0.5 > 0
             */
            fromValue = -fromValue;
            toValue = 0;
        }

        // audio
        const tracks = [audioTrack, textTrack, videoTrack];
        // 剪映的总时长最好比所有素材时长多一点
        const extraDuration = 10000;
        return { tracks, draftInfoMaterials, duration: audioTrackDuration + extraDuration };
    }


    private createTextTrackItem(srtInfo: ISrt, nextSrtInfo: ISrt, audioTrackDuration: number, text: string) {
        const start = multiply(srtInfo.data.start, 1000);
        const end = nextSrtInfo ? subtract(multiply(nextSrtInfo.data.start, 1000), 1) : audioTrackDuration;
        const duration = subtract(end, start);

        const materialText = this.schema.createText({ text });

        const textMaterialAnimation = this.schema.createMaterialAnimation();
        const textTrackItem = this.schema.createTrackTextSegment({
            materialId: materialText.id,
            duration: duration,
            start: start,
            extraMaterialRefs: [
                textMaterialAnimation.id
            ]
        });
        return { textTrackItem, materialText, textMaterialAnimation };
    }

    private createVideoTrackItem(editTableDataSourceItem: IEditTableDataItem, currentSegmentDuration: number, fromValue: number, toValue: number, currentStart: number) {
        const imagePath = editTableDataSourceItem.image?.path!;
        const imageFileName = path.basename(imagePath);
        const materialVideo = this.schema.createVideo({
            materialName: imageFileName,
            path: imagePath
        });
        const videoSpeed = this.schema.createSpeed();
        const videoCanvas = this.schema.createCanvas();
        const videoMaterialAnimation = this.schema.createMaterialAnimation();
        const videoSoundChannelMapping = this.schema.createSoundChannelMapping();
        const videoVocalSeparation = this.schema.createVocalSeparation();

        const videoExtraMaterialRefs = [
            videoSpeed.id,
            videoCanvas.id,
            videoMaterialAnimation.id,
            videoSoundChannelMapping.id,
            videoVocalSeparation.id
        ];

        const videoTrackItem = this.schema.createTrackVideoSegment({
            // 物料id
            materialId: materialVideo.id,
            duration: currentSegmentDuration,
            keyframePropertyType: 'KFTypePositionY',
            fromValue,
            toValue,
            targetTimeRangeStart: currentStart,
            extraMaterialRefs: videoExtraMaterialRefs
        });

        return {
            videoTrackItem,
            videoSpeed,
            videoCanvas,
            videoMaterialAnimation,
            videoSoundChannelMapping,
            videoVocalSeparation,
            materialVideo
        };
    }

    private createAudioTrackItem(audioDraftMaterialValue: IValue) {
        const audioTrack = this.schema.createTrack({ type: 'audio' });
        const duration = multiply(audioDraftMaterialValue.duration || 0, 10);
        const materialAudio = this.schema.createAudio({
            duration: duration,
            name: audioDraftMaterialValue.extra_info,
            path: audioDraftMaterialValue.file_Path
        });
        const audioSpeed = this.schema.createSpeed();
        const audioBeat = this.schema.createBeat();
        const audioSoundChannelMapping = this.schema.createSoundChannelMapping();
        const audioVocalSeparation = this.schema.createVocalSeparation();
        const audioExtraMaterialRefs = [
            audioSpeed.id,
            audioBeat.id,
            audioSoundChannelMapping.id,
            audioVocalSeparation.id
        ];
        audioTrack.segments.push(this.schema.createTrackAudioSegment({
            materialId: materialAudio?.id || '',
            duration,
            start: 0,
            extraMaterialRefs: audioExtraMaterialRefs
        }));
        return { audioTrack, audioSpeed, audioBeat, audioSoundChannelMapping, audioVocalSeparation, materialAudio };
    }



    private findDraftMaterialValueByPath(draftMaterialValues: IValue[], filePath: string) {
        return draftMaterialValues.find(item => item.file_Path === filePath);
    }


    /**
     * 获取图片信息，宽高
     * @param filePath
     */
    public async getImageMetadata(filePath: string) {
        const metadata = await sharp(filePath).metadata();
        return {
            width: metadata.width || 0,
            height: metadata.height || 0
        };
    }


    /**
     * 获取音频信息
     * @param path
     */
    public getAudioInfo(path: string): Promise<{ duration: number }> {
        return new Promise((resolve, reject) => {
            return ffmpeg.ffprobe(path, (err, metadata) => {
                if (err) {
                    throw new Error(err);
                }
                const duration = metadata.format.duration || 0;
                const msDuration = multiply(duration, 100000);
                return resolve({ duration: msDuration });
            });
        });
    }

    public saveProject(project: IJianYingProject) {
        const draftInfoFileName = 'draft_info.json';
        const draftMetaInfoFileName = 'draft_meta_info.json';
        const foldPath = project?.draftMetaInfo.draft_fold_path;

        if (!foldPath) {
            throw new Error('未指定项目路径');
        }
        if (fs.existsSync(foldPath)) {
            fs.rmSync(foldPath, { recursive: true, force: true });
        }
        fs.mkdirSync(foldPath);
        const draftInfoJSON = JSON.stringify(project?.draftInfo);
        fs.writeFileSync(path.join(foldPath, draftInfoFileName), draftInfoJSON, 'utf8');
        const draftMetaInfoJSON = JSON.stringify(project?.draftMetaInfo);
        fs.writeFileSync(path.join(foldPath, draftMetaInfoFileName), draftMetaInfoJSON, 'utf8');
    }

}

