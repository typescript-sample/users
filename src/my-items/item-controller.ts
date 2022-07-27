import { Controller, Log } from 'express-ext';
import { Item, ItemFilter, ItemService } from './item';
import { UploadController } from 'upload-express';
export type Save = (values: string[]) => Promise<number>;
export class MyItemController extends Controller<Item, string, ItemFilter> {
  constructor(log: Log, itemService: ItemService) {
    super(log, itemService);
  }
}


export class MyItemUploadController extends UploadController {
  constructor(log: Log, service: ItemService, generateId: () => string, sizesCover: number[], sizesImage: number[]) {
    super(log, service, service.getGalllery, generateId, sizesCover, sizesImage, 'id');
  }
}
