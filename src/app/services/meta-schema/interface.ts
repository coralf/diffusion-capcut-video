import { IEditTableDataItem } from '../../../ui/modules/art-creation/art-creation-store';

export interface IMetaSchema {
  path: string;
  fileName: string;
  editTableDataSource: IEditTableDataItem[];
}
