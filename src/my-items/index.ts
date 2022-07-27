import { StorageRepository } from 'google-storage';
import { GenericSearchStorageService, ModelConf, StorageConf, UploadInfo } from 'one-storage';
import { BuildUrl, Delete, Generate, Log, Manager, Search } from 'onecore';
import { DB, postgres, SearchBuilder } from 'query-core';
import { TemplateMap, useQuery } from 'query-mappers';
import { Item, ItemFilter, itemModel, ItemRepository, ItemService } from './item';
import { MyItemController, MyItemUploadController } from './item-controller';
export * from './item';
export { MyItemController };

import { SqlItemRepository } from './sql-item-repository';

export class ItemManager extends GenericSearchStorageService<Item, string, ItemFilter> implements ItemService {
  constructor(search: Search<Item, ItemFilter>, repository: ItemRepository,
    storage: StorageRepository,
    deleteFile: Delete,
    generateId: Generate,
    buildUrl: BuildUrl,
    sizesCover: number[],
    sizesImage: number[],
    config?: StorageConf,
    model?: ModelConf) {
    super(search, repository, storage, deleteFile, generateId, buildUrl, sizesCover, sizesImage, config, model);
    this.uploadCoverImage = this.uploadCoverImage.bind(this);
    this.uploadGalleryFile = this.uploadGalleryFile.bind(this);
    this.updateGallery = this.updateGallery.bind(this);
    this.deleteGalleryFile = this.deleteGalleryFile.bind(this);
    this.uploadImage = this.uploadImage.bind(this);
    this.getGalllery = this.getGalllery.bind(this);
  }
  async getGalllery(id: string): Promise<UploadInfo[]> {
    return this.repository.load(id).then((item) => {
      if (item) {
        return (item as any)[this.model.gallery];
      }
      return [];
    });
  }
  
}

export function useItemService(db: DB, storage: StorageRepository, deleteFile: Delete, generateId: Generate, buildUrl: BuildUrl, sizesCover: number[],
  sizesImage: number[], config?: StorageConf, model?: ModelConf, mapper?: TemplateMap): ItemService {
  const queryItems = useQuery('item', mapper, itemModel, true);
  const builder = new SearchBuilder<Item, ItemFilter>(db.query, 'items', itemModel, postgres, queryItems);
  const repository = new SqlItemRepository(db); 
  return new ItemManager(builder.search, repository,storage,deleteFile,generateId,buildUrl,sizesCover,sizesImage,config,model);
}
export function useItemController(log: Log, db: DB, storage: StorageRepository, deleteFile: Delete, generateId: Generate, buildUrl: BuildUrl, sizesCover: number[],
  sizesImage: number[], config?: StorageConf, model?: ModelConf, mapper?: TemplateMap): MyItemController {
  return new MyItemController(log, useItemService(db,storage,deleteFile,generateId,buildUrl,sizesCover,sizesImage,config,model, mapper));
}

export function useItemUploadController(log: Log, db: DB, storage: StorageRepository, deleteFile: Delete, generateId: Generate, buildUrl: BuildUrl, sizesCover: number[],
  sizesImage: number[], config?: StorageConf, model?: ModelConf, mapper?: TemplateMap): MyItemUploadController {
  return new MyItemUploadController(log, useItemService(db,storage,deleteFile,generateId,buildUrl,sizesCover,sizesImage,config,model, mapper),generateId,sizesCover,sizesImage);
}
