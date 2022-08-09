import { StorageRepository } from 'google-storage';
import { GenericSearchStorageService, ModelConf, StorageConf, UploadInfo } from 'one-storage';
import { BuildUrl, Delete, Generate, Log, Search } from 'onecore';
import { DB, postgres, Repository, SearchBuilder } from 'query-core';
import { TemplateMap, useQuery } from 'query-mappers';
import { Item, ItemFilter, itemModel, ItemRepository, ItemService } from './item';
import { MyItemController, MyItemUploadController } from './item-controller';
export * from './item';
export { MyItemController };


export class ItemManager extends GenericSearchStorageService<Item, string, ItemFilter> implements ItemService {
  constructor(search: Search<Item, ItemFilter>, repository: ItemRepository,
    storage: StorageRepository,
    protected save: (values: string[]) => Promise<number>,
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

  insert(item: Item, ctx?: any): Promise<number> {
    if (item.brand && item.brand.length > 0) {
      this.save([item.brand]);
    }
    return this.repository.insert(item, ctx);
  }
  update(item: Item, ctx?: any): Promise<number> {
    if (item.brand && item.brand.length > 0) {
      this.save([item.brand]);
    }
    return this.repository.update(item, ctx);
  }
  patch(item: Partial<Item>, ctx?: any): Promise<number> {
    if (item.brand && item.brand.length > 0) {
      this.save([item.brand]);
    }
    return (this.repository.patch ? this.repository.patch(item, ctx) : Promise.resolve(-1));
  }
}

export function useMyItemService(db: DB, storage: StorageRepository, save: (values: string[]) => Promise<number>, deleteFile: Delete, generateId: Generate, buildUrl: BuildUrl, sizesCover: number[],
  sizesImage: number[], config?: StorageConf, model?: ModelConf, mapper?: TemplateMap): ItemService {
  const queryItems = useQuery('item', mapper, itemModel, true);
  const builder = new SearchBuilder<Item, ItemFilter>(db.query, 'item', itemModel, postgres, queryItems);
  const repository = new Repository<Item, string>(db, 'item',itemModel);
  return new ItemManager(builder.search, repository, storage, save, deleteFile, generateId, buildUrl, sizesCover, sizesImage, config, model);
}
export function useMyItemController(log: Log, db: DB, storage: StorageRepository, save: (values: string[]) => Promise<number>, deleteFile: Delete, generateId: Generate, buildUrl: BuildUrl, sizesCover: number[],
  sizesImage: number[], config?: StorageConf, model?: ModelConf, mapper?: TemplateMap): MyItemController {
  return new MyItemController(log, useMyItemService(db, storage, save, deleteFile, generateId, buildUrl, sizesCover, sizesImage, config, model, mapper));
}

export function useMyItemUploadController(log: Log, db: DB, storage: StorageRepository, save: (values: string[]) => Promise<number>, deleteFile: Delete, generateId: Generate, buildUrl: BuildUrl, sizesCover: number[],
  sizesImage: number[], config?: StorageConf, model?: ModelConf, mapper?: TemplateMap): MyItemUploadController {
  return new MyItemUploadController(log, useMyItemService(db, storage, save, deleteFile, generateId, buildUrl, sizesCover, sizesImage, config, model, mapper), generateId, sizesCover, sizesImage);
}
