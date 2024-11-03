export enum ImageProtocol {
    Name = 'image'
}

export const getImageProtocolUrl = (path: string) => {
    return `${ImageProtocol.Name}://${path}`;
};
