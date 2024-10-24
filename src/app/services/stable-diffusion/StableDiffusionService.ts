import axios from "axios";
import path from "path";
import fs from "fs";
import { Autowired, Bean } from "../../../common/ioc-manager";
import { SettingService } from "../setting/SettingService";


export interface ITextToImageOptions {
    prompt: string;
    width?: number;
    height?: number;
}

@Bean
export class StableDiffusionService {

    @Autowired
    private settingService!: SettingService;


    private get request() {
        const request = axios.create({
            baseURL: this.settingService.globalSetting.stableDiffusionBaseUrl,
        });
        request.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
        return request;
    }

    public textToImage = async (options: ITextToImageOptions) => {
        const url = '/sdapi/v1/txt2img';
        const { data } = await this.request.post(url, options);
        return data;
    };

    public getTextToImageProgress = async () => {
        const { data } = await this.request.get('/sdapi/v1/progress');
        return data;
    };
    public extraSingleImage = async (params: any) => {
        const { data } = await this.request.post('/sdapi/v1/extra-single-image', params);
        return data;
    };

    public async saveImageToFile(options: { fileName: string; imageBase64: string; }) {
        const { fileName, imageBase64 } = options;
        const imagesFoldPath = this.settingService.getImagesFoldPath();
        const filePath = path.join(imagesFoldPath, fileName);
        fs.writeFileSync(filePath, imageBase64, 'base64');
        return { path: filePath };
    }

    public async getSdModelList() {
        const { data } = await this.request.get('/sdapi/v1/sd-models');
        // models/Lora/guofenghuiben_v1.png
        // models/Stable-diffusion/guofenghuiben_v1.png
        // home/stable-diffusion-webui/models/Stable-diffusion/AnythingV5Ink_ink.preview.png
        for (const item of data) {
            // models/Stable-diffusion/AnythingV5Ink_ink.preview.png
            const imagePath = `models/Stable-diffusion/${item['model_name']}.preview.png`;
            // const response = await request.get(`/file=${imagePath}`);
            // console.log('===>', item['model_name'], response.data);
            item.imageUrl = `${this.settingService.globalSetting.stableDiffusionBaseUrl}/file=${imagePath}`;
            item.modelName = item['model_name'];
        }
        return data;
    }


    public async getSdConfig() {
        const { data } = await this.request.get('/sdapi/v1/options');
        return data;
    }

    public async getLoraModelList() {
        const { data } = await this.request.get('/sdapi/v1/loras');
        for (const item of data) {
            const imagePath = `models/Lora/${item['name']}.preview.png`;
            item.imageUrl = `https://coralf-x9vwthmexur0.gear-c1.openbayes.net/file=${imagePath}`;
        }
        return data;
    }


    public async updateSdConfig(options: any) {
        const { data } = await this.request.post('/sdapi/v1/options', options);
        return data;
    }


}



