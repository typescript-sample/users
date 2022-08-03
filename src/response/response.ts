import {
  Attributes,
  Filter,
  Repository,
  ViewRepository,
} from "./core";

import { Comment } from 'rate-core';
import { ReactionService } from "rate-express";


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
}

export interface ResponseFilter extends Filter {
  id?: string;
  author?: string;
  description?: string;
  time?: Date;
  usefulCount?: number;
  replyCount?: number;
}

export interface ResponseRepository extends Repository<Response, ResponseId> {
  save(obj: Response, ctx?: any): Promise<number>;
  getResponse(id: string, author: string): Promise<Response | null>;
}

export interface ResponseService
  extends ReactionService<Response, ResponseFilter, Comment> {
  response(response: Response): Promise<boolean>;
  getResponse(id: string, author: string): Promise<Response | null>;
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

export const commentModel: Attributes = {
  comment: {
    length: 500,
  },
  time: {
    type: "datetime",
  },
};
export const responseCommentModel: Attributes = {
  commentId: {
    key: true,
  },
  id: {
    required: true,
    match: "equal",
  },
  author: {
    required: true,
    match: "equal",
  },
  userId: {
    required: true,
    match: "equal",
  },
  comment: {
    length: 500,
  },
  time: {
    type: "datetime",
  },
  updatedAt: {
    type: "datetime",
  },
  histories: {
    type: "array",
    typeof: commentModel,
  },
};
