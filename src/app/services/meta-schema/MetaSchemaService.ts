import fs from 'fs';
import { IMetaSchema } from './interface';
import { SettingService } from '../setting/SettingService';
import { Autowired, Bean } from '../../../common/ioc-manager';
import path from 'path';
import { v4 } from 'uuid';
import { getImageProtocolUrl } from '../../main/img-protocol';


@Bean
export class MetaSchemaService {


  @Autowired
  private settingService!: SettingService;


  public saveMetaSchema(metaSchema: IMetaSchema) {
    const nextMetaSchema: IMetaSchema = {
      ...metaSchema,
      path: this.settingService.getWorkspaceMetaInfoFilePath()
    };
    return this.saveToFile(nextMetaSchema);
  }


  public getMetaSchema() {
    return this.getMetaSchemaFormDic();
  }

  public getMetaSchemaFormDic() {
    const filePath = this.settingService.getWorkspaceMetaInfoFilePath();
    if (!filePath) {
      return;
    }
    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      return this.createDefaultMetaSchema(filePath);
    }
    const res = fs.readFileSync(filePath, 'utf-8');
    if (!res) {
      return;
    }
    const metaSchema = JSON.parse(res) as IMetaSchema;
    if (!metaSchema) return;
    const editTableDataSource = metaSchema.editTableDataSource?.map(item => {
      if (item.image?.path && fs.existsSync(item.image.path)) {
        item.image.src = getImageProtocolUrl(item.image.path);
      }
      if (item?.multiGridSelect?.path) {
        item.multiGridSelect.imgSrc = getImageProtocolUrl(item.multiGridSelect.path);
      }
      return item;
    });
    return { ...metaSchema, editTableDataSource };
  }


  private createDefaultMetaSchema(filePath: string) {
    const metaSchema: IMetaSchema = {
      path: path.dirname(filePath),
      fileName: path.basename(filePath),
      editTableDataSource: [{ id: v4() }]
    };
    return metaSchema;
  }


  public onWindowClose() {
    // this.saveToFile();
  }

  public saveToFile(metaSchema: IMetaSchema) {
    fs.writeFileSync(metaSchema.path, JSON.stringify(metaSchema, null, 2), 'utf-8');
  }

}



