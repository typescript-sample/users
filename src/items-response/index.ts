import { Search } from "onecore";
import {
  InfoRepository,
  ReactionRepository,
  CommentRepository,
} from "reaction-query";
import { ShortComment } from "rate-core";
import { SearchResult } from "onecore";
import shortid from "shortid";
import { Log } from "express-ext";
import { buildToSave } from "pg-extension";
import { DB, GenericRepository, SearchBuilder } from "query-core";
import { TemplateMap, useQuery } from "query-mappers";
import { check, createValidator } from "xvalidators";
import {
  infoModel,
  Info,
  Response,
  ResponseFilter,
  ResponseService,
  responseModel,
  ResponseRepository,
} from "./response";
import { ResponseController } from "./response-controller";
// import { SqlResponseRepository } from "./sql-response-repository";
import {
  rateReactionModel,
  SqlInfoRepository,
  SqlCommentRepository,
  SqlReactionRepository,
  commentModel,
} from "reaction-query";
import { Comment, CommentValidator } from "rate-core";

export * from "./response-controller";
export * from "./response";

export { ResponseController };

export class ResponseManager implements ResponseService {
  constructor(
    protected find: Search<Response, ResponseFilter>,
    public repository: ResponseRepository,
    private infoRepository: InfoRepository<Info>,
    private responseCommentRepository: CommentRepository<Comment>,
    private responseReactionRepository: ReactionRepository
  ) {
    this.response = this.response.bind(this);
    this.updateResponse = this.updateResponse.bind(this);
    this.comment = this.comment.bind(this);
    this.getComments = this.getComments.bind(this);
    this.removeComment = this.removeComment.bind(this);
    this.updateComment = this.updateComment.bind(this);
  }
  search(
    s: ResponseFilter,
    limit?: number,
    offset?: number | string,
    fields?: string[]
  ): Promise<SearchResult<Response>> {
    return this.find(s, limit, offset, fields);
  }
  load(id: string, author: string): Promise<Response | null> {
    return this.repository.load(id, author);
  }
  async response(response: Response): Promise<boolean> {
    let info = await this.infoRepository.load(response.id);
    if (!info) {
      info = {
        id: response.id,
        viewCount: 0,
      };
    }
    info.viewCount++;
    response.usefulCount = 0;
    await this.infoRepository.save(info);
    await this.repository.insert(response);
    return true;
  }
  getResponse(id: string, author: string): Promise<Response | null> {
    return this.repository.load(id, author);
  }
  updateResponse(response: Response): Promise<number> {
    return this.repository.load(response.id, response.author).then((exist) => {
      if (exist) {
        response.time
          ? (response.time = response.time)
          : (response.time = new Date());
        return this.repository.update(response);
      } else {
        return 0;
      }
    });
  }
  setUseful(id: string, author: string, userId: string): Promise<number> {
    return this.responseReactionRepository.save(id, author, userId, 1);
  }
  removeUseful(id: string, author: string, userId: string): Promise<number> {
    return this.responseReactionRepository.remove(id, author, userId);
  }
  comment(comment: Comment): Promise<number> {
    return this.repository
      .load(comment.id, comment.author)
      .then((checkResponse) => {
        if (!checkResponse) {
          return 0;
        } else {
          comment.time
            ? (comment.time = comment.time)
            : (comment.time = new Date());
          return this.responseCommentRepository.insert(comment);
        }
      });
  }
  getComment(id: string): Promise<Comment | null> {
    return this.responseCommentRepository.load(id);
  }
  getComments(id: string, author: string, limit?: number): Promise<Comment[]> {
    if (limit && limit > 0) {
      return this.responseCommentRepository.getComments(id, author, limit);
    }
    return this.responseCommentRepository.getComments(id, author);
  }
  removeComment(commentId: string, userId: string): Promise<number> {
    return this.responseCommentRepository.load(commentId).then((comment) => {
      if (comment) {
        if (userId === comment.author || userId === comment.userId) {
          return this.responseCommentRepository.remove(
            commentId,
            comment.id,
            comment.author
          );
        } else {
          return -2;
        }
      } else {
        return -1;
      }
    });
  }
  updateComment(comment: Comment): Promise<number> {
    return this.responseCommentRepository
      .load(comment.commentId)
      .then((exist) => {
        if (!exist) {
          return 0;
        } else {
          comment.updatedAt = new Date();
          const c: ShortComment = { comment: exist.comment, time: exist.time };
          if (!comment.histories || comment.histories.length === 0) {
            comment.histories = [c];
          } else {
            comment.histories.push(c);
          }
          return this.responseCommentRepository.update(comment);
        }
      });
  }
}

export function useResponseService(
  db: DB,
  mapper?: TemplateMap
): ResponseService {
  const query = useQuery("item_response", mapper, responseModel, true);
  const builder = new SearchBuilder<Response, ResponseFilter>(
    db.query,
    "item_response",
    responseModel,
    db.driver,
    query
  );
  const repository = new GenericRepository<Response, string, string>(
    db,
    "item_response",
    responseModel,
    "id",
    "author"
  );
  const infoRepository = new SqlInfoRepository<Info>(
    db,
    "item_info",
    infoModel,
    buildToSave
  );
  const responseReactionRepository = new SqlReactionRepository(
    db,
    "item_response_reaction",
    rateReactionModel,
    "item_response",
    "usefulCount",
    "author",
    "id"
  );
  const responseCommentRepository = new SqlCommentRepository<Comment>(
    db,
    "item_comment",
    commentModel,
    "item_response",
    "id",
    "author",
    "replyCount",
    "author",
    "time",
    "id"
  );

  return new ResponseManager(
    builder.search,
    repository,
    infoRepository,
    responseCommentRepository,
    responseReactionRepository
  );
}

export function useResponseController(
  log: Log,
  db: DB,
  mapper?: TemplateMap
): ResponseController {
  const responseValidator = createValidator<Response>(responseModel);
  const commentValidator = new CommentValidator(commentModel, check);
  return new ResponseController(
    log,
    useResponseService(db, mapper),
    responseValidator,
    commentValidator,
    ["time"],
    ["rate", "usefulCount", "replyCount", "count", "score"],
    generate,
    "commentId",
    "userId",
    "author",
    "id"
  );
}

export function generate(): string {
  return shortid.generate();
}
