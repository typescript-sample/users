import { Request, Response } from 'express';

export function handleError(
  err: any,
  res: Response,
  log?: (msg: string) => void
) {
  if (log) {
    log(toString(err));
    res.status(500).end('Internal Server Error');
  } else {
    res.status(500).end(toString(err));
  }
}
export const error = handleError;
export function toString(v: any): string {
  if (typeof v === 'string') {
    return v;
  } else {
    return JSON.stringify(v);
  }
}
type Log = (msg: string) => void;
export interface UploadInfo {
  source?: string;
  type?: string;
  url: string;
}
export interface Upload {
  id: string;
  source?: string;
  name: string;
  data: Buffer;
  type: string;
}

export interface UploadData {
  name: string;
  data: string | Buffer;
}

export interface UploadService {
  uploadCoverImage(id: string, data: UploadData[], sizes?: number[]): Promise<string>;
  uploadImage(id: string, data: UploadData[], sizes?: number[]): Promise<string>;
  uploadGalleryFile(upload: Upload): Promise<UploadInfo[]>;
  updateGallery(id: string, data: UploadInfo[]): Promise<boolean>;
  deleteGalleryFile(id: string, url: string): Promise<boolean>;
  getGallery(id: string): Promise<UploadInfo[]>;
  addExternalResource(id: string, data: UploadInfo): Promise<boolean>;
  deleteExternalResource(id: string, url: string): Promise<boolean>;
  getGallery(id: string): Promise<UploadInfo[]>
}

export class UploadController {
  constructor(
    public log: Log,
    public uploadService: UploadService,
    public generateId: () => string,
    public sizesCover: number[],
    public sizesImage: number[],
    id?: string,
  ) {
    this.id = id && id.length > 0 ? id : 'id';
    this.uploadCover = this.uploadCover.bind(this);
    this.getGallery = this.getGallery.bind(this);
    this.updateGallery = this.updateGallery.bind(this);
    this.uploadGallery = this.uploadGallery.bind(this);
    this.deleteGalleryFile = this.deleteGalleryFile.bind(this);
    this.uploadImage = this.uploadImage.bind(this);
    this.addExternalResource = this.addExternalResource.bind(this);
    this.deleteExternalResource = this.deleteExternalResource.bind(this);
    this.getGallery=this.getGallery.bind(this)
  }
  id: string;

  getGallery(req: Request, res: Response) {
    const id = req.params[this.id];
    if (!id || id.length === 0) {
      res.status(400).end('id cannot be empty');
    } else {
      this.uploadService.getGallery(id)
        .then((obj) => {
          if (obj) {
            res.status(200).json(obj).end();
          } else {
            res.status(404).json(null).end();
          }
        })
        .catch((err) => handleError(err, res, this.log));
    }
  }
  uploadCover(req: Request, res: Response) {
    if (!req || !req.files || req.files.length < 1) {
      res.status(400).end('require file');
    } else {
      const id = req.params[this.id];
      if (!id || id.length === 0) {
        res.status(400).end('id cannot be empty');
      } else {
        const listFile: UploadData[] = [];
        const generateStr = this.generateId();
        (req.files as any).forEach((file: any) => {
          const fileName = file.originalname;
          const data = file.buffer;
          const name = `${id.toString()}_${generateStr}_${fileName}`;
          listFile.push({ name, data });
        });

        this.uploadService
          .uploadCoverImage(id, listFile)
          .then((result) => res.status(200).json(result).end())
          .catch((e) => handleError(e, res, this.log));
      }
    }
  }
  uploadImage(req: Request, res: Response) {
    if (!req || !req.files || req.files.length < 1) {
      res.status(400).end('require file');
    } else {
      const id = req.params[this.id];
      if (!id || id.length === 0) {
        res.status(400).end('id cannot be empty');
      } else {
        const listFile: UploadData[] = [];
        const generateStr = this.generateId();
        (req.files as any).forEach((file: any) => {
          const fileName = file.originalname;
          const data = file.buffer;
          const name = `${id.toString()}_${generateStr}_${fileName}`;
          listFile.push({ name, data });
        });

        this.uploadService
          .uploadImage(id, listFile)
          .then((result) => res.status(200).json(result).end())
          .catch((e) => handleError(e, res, this.log));
      }
    }
  }
  uploadGallery(req: Request, res: Response) {
    if (!req || !req.file) {
      res.status(400).end('require file');
    } else {
      const id = req.params[this.id];
      if (!id || id.length === 0) {
        res.status(400).end('id cannot be empty');
      } else {
        const data = req.file.buffer;
        const fileType = req.file.mimetype;
        const type = fileType.split('/')[0];
        const { source } = req.body;
        const upload: Upload = {
          id,
          source,
          name: `${id.toString()}_${this.generateId()}`,
          data,
          type,
        };
        if (!upload) {
          res.status(400).end('data cannot be empty');
        } else {
          this.uploadService
            .uploadGalleryFile(upload)
            .then((result) => res.status(200).json(result).end())
            .catch((e) => handleError(e, res, this.log));
        }
      }
    }
  }
  updateGallery(req: Request, res: Response) {
    const id = req.params[this.id];
    if (!id || id.length === 0) {
      res.status(400).end('data cannot be empty');
    } else {
      const  data  = req.body;
      this.uploadService
        .updateGallery(id, data)
        .then((result) => res.status(200).json(result))
        .catch((err) => handleError(err, res, this.log));
    }
  }
  deleteGalleryFile(req: Request, res: Response) {
    const id = req.params[this.id];
    if (!id || id.length === 0) {
      res.status(400).end('id cannot be empty');
    } else {
      const url = req.query.url?.toString();
      if (!url || url.length === 0) {
        res.status(400).end('url cannot be empty');
      } else {
        this.uploadService
          .deleteGalleryFile(id, url)
          .then((result) => res.status(200).json(result))
          .catch((err) => handleError(err, res, this.log));
      }
    }
  }
  addExternalResource(req: Request, res: Response) {
    const type = req.query.type;
    const url = req.query.url;
    const id = req.params[this.id];
    if (!id || id.length === 0 || !type || !url) {
      res.status(400).end('id cannot be empty');
    } else {
      this.uploadService
        .addExternalResource(id, { type: type.toString(), url: url.toString() })
        .then((result) => res.status(200).json(result))
        .catch((e) => handleError(e, res, this.log));
    }
  }
  deleteExternalResource(req: Request, res: Response) {
    const id = req.params[this.id];
    const url = req.query.url;
    if (url && id) {
      this.uploadService
        .deleteExternalResource(id.toString(), url.toString())
        .then((result) => res.status(200).json(result))
        .catch((e) => handleError(e, res, this.log));
    } else {
      return res.status(400).end('data cannot be empty');
    }
  }
}
export const UploadHandler = UploadController;
