import {
  Attributes,
  Filter,
  Repository,
  Service,
  ViewRepository,
} from "./core";

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
  // search(search: ResponseFilter): Promise<Response | null>;
}

export interface ResponseService
  extends Service<Response, ResponseId, ResponseFilter> {
  response(response: Response): Promise<boolean>;
  getResponse(id: string, author: string): Promise<Response | null>;
  updateResponse(response: Response): Promise<number>;
  setUseful(
    id: string,
    author: string,
    userId: string,
    ctx?: any
  ): Promise<number>;
  removeUseful(
    id: string,
    author: string,
    userId: string,
    ctx?: any
  ): Promise<number>;
  comment(comment: ResponseComment): Promise<number>;
  getComments(id: string, author: string, limit?: number): Promise<any>;
  removeComment(id: string, author: string, ctx?: any): Promise<number>;
  updateComment(comment: ResponseComment): Promise<number>;
}

export interface ResponseReactionRepository {
  remove(
    id: string,
    author: string,
    userId: string,
    ctx?: any
  ): Promise<number>;
  save(
    id: string,
    author: string,
    userId: string,
    type: number
  ): Promise<number>;
}

export interface ResponseCommentRepository
  extends Repository<ResponseComment, string> {
  remove(commentId: string, id: string, author: string): Promise<number>;
  getComments(
    id: string,
    author: string,
    limit?: number
  ): Promise<ResponseComment[] | null>;
}

export interface ResponseCommentService
  extends Service<ResponseComment, string, ResponseCommentFilter> {}

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

export interface ResponseComment {
  commentId: string;
  id: string;
  author: string;
  userId: string;
  comment: string;
  time: Date;
  updatedAt?: Date;
  histories?: ShortComment[];
}
export interface ShortComment {
  comment: string;
  time: Date;
}

export interface ResponseCommentFilter extends Filter {
  commentId?: string;
  id?: string;
  author?: string;
  userId?: string;
  comment?: string;
  time?: Date;
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
