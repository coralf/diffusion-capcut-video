import axios from "axios";
import path from "path";
import fs from "fs";
import { Autowired, Bean } from "../../../common/ioc-manager";
import { SettingService } from "../setting/SettingService";
import { log } from "console";
import { imageToBase64 } from "../../utils/common";

export interface ITextToImageOptions {
    prompt: string;
    width?: number;
    height?: number;
}

@Bean
export class KolorsService {
    @Autowired
    private settingService!: SettingService;

    private get request() {
        const request = axios.create({
            baseURL: this.settingService.globalSetting.kolorsBaseUrl,
            maxBodyLength: Infinity,
            maxContentLength: Infinity
        });
        request.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
        return request;
    }

    public textToImage = async (options: ITextToImageOptions) => {
        console.log("textToImage", options);
        const { data } = await this.request.post("/generate", options);
        return data;
    };

    public upscale = async (options: { path: string }) => {
        console.log("up", options);
        const base64Image = await imageToBase64(options.path);
        const { data } = await this.request.post("/upscale", {
            image: base64Image
        });
        return data;
    };

    public upscaleBase64Image = async (options: { image: string }) => {
        const { data } = await this.request.post("/upscale", {
            image: options.image
        });
        return data;
    };
}
