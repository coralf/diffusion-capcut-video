export interface IGlobalSetting {
    jianyingWorkspace: string;
    workspace: IWorkspace;
    gptApiKey: string;
    stableDiffusionBaseUrl: string;
    serverId: string;
    channelId: string;
    salaiToken: string;
    kolorsBaseUrl: string;
}

export interface IWorkspace {
    workspaceDicName: string;
    metaInfoFileName: string;
    imagesDicName: string;
    audiosDicName: string;
    srtsDicName: string;
}
