import { exec } from 'child_process';
import fs from 'fs';
import { v4 } from 'uuid';
import path from 'path';
export const delay = (executeFn: Function, time = 3000) => {
    return new Promise((resolve, reject) => {
        setTimeout(async () => {
            const res = await executeFn();
            resolve(res);
        }, time);
    });
};

export const getTime = () => {
    return new Date().getTime();
};

export function recognizeTextFromBase64Image(base64Data: string) {
    // 生成临时图片文件路径
    const tempImagePath = `/tmp/${v4()}.png`;
    const tempResultPath = `/tmp/${v4()}`;
    const tempResultFullPath = `${tempResultPath}.txt`;

    // 将 Base64 图片数据写入临时图片文件
    writeBase64ImageToFile(base64Data, tempImagePath);

    // 调用 Tesseract 进行图像识别
    return new Promise((resolve, reject) => {
        exec(
            `tesseract ${tempImagePath} ${tempResultPath}`,
            (error, stdout, stderr) => {
                if (error) {
                    reject(`Tesseract error: ${error}`);
                    return;
                }
                if (stderr) {
                    reject(`Tesseract stderr: ${stderr}`);
                    return;
                }
                console.log('Image recognition completed');
                // 读取识别结果
                readRecognizedText(tempResultFullPath)
                    .then((text) => {
                        // 删除临时图片文件
                        deleteTempFile(tempImagePath);
                        deleteTempFile(tempResultFullPath);
                        resolve(text);
                    })
                    .catch(reject);
            },
        );
    });
}

// 将 Base64 图片数据写入文件
function writeBase64ImageToFile(base64Data: string, filename: string) {
    const buffer = Buffer.from(base64Data, 'base64');
    fs.writeFileSync(filename, buffer);
}

// 读取识别结果
function readRecognizedText(path: string) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf8', (err, data) => {
            if (err) {
                reject(`Error reading recognized text: ${err}`);
                return;
            }
            console.log('Recognized text:', data);
            resolve(data);
        });
    });
}

// 删除临时图片文件
function deleteTempFile(filepath: string) {
    fs.unlinkSync(filepath);
    console.log('Temp image deleted');
}

export const imageToBase64 = (imagePath: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        try {
            // 确保文件路径存在
            const absolutePath = path.resolve(imagePath);
            if (!fs.existsSync(absolutePath)) {
                reject(new Error('文件不存在'));
                return;
            }

            // 读取文件
            const imageBuffer = fs.readFileSync(absolutePath);
            // 转换为base64
            const base64String = imageBuffer.toString('base64');
            resolve(base64String);
        } catch (error) {
            reject(error);
        }
    });
};
