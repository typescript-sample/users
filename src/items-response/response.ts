import { Attributes, Filter, ViewRepository } from "onecore";

export interface ResponseId {
  id: string;
  author: string;
}

export interface Response {
  id: string;
  author: string;
  description: string;
  time: Date;
  usefulCount: number;
  replyCount: number;
  authorURL?: string;
  rate: number;
}

export interface ResponseFilter extends Filter {
  id?: string;
  author?: string;
  description?: string;
  time?: Date;
  usefulCount?: number;
  replyCount?: number;
}

export interface ResponseRepository {
  load(id: string, author: string): Promise<Response | null>;
  insert(obj: Response, ctx?: any): Promise<number>;
  update(obj: Response, ctx?: any): Promise<number>;
  delete(id: string, author: string, ctx?: any): Promise<number>;
}

export interface ResponseService {
  response(response: Response): Promise<boolean>;
  updateResponse(response: Response): Promise<number>;
}

export const responseModel: Attributes = {
  id: {
    key: true,
    required: true,
    match: "equal",
  },
  author: {
    key: true,
    required: true,
    match: "equal",
  },
  description: {},
  time: {
    type: "datetime",
  },
  review: {
    q: true,
  },
  usefulCount: {
    type: "integer",
    min: 0,
  },
  replyCount: {
    type: "integer",
    min: 0,
  },
};

export const infoModel: Attributes = {
  id: {
    key: true,
  },
  viewCount: {
    type: "number",
  },
};

export interface Info {
  id: string;
  viewCount: number;
}

export interface InfoRepository extends ViewRepository<Info, string> {
  save(obj: Info, ctx?: any): Promise<number>;
}