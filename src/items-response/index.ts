import { Search } from "onecore";
import {
  InfoRepository,
  ReactionRepository,
  CommentRepository,
  ShortComment,
} from "reaction-query";
import { SearchResult } from "onecore";
import shortid from "shortid";
import { Log } from "express-ext";
import { buildToSave } from "pg-extension";
import { DB, GenericRepository, SearchBuilder } from "query-core";
import { TemplateMap, useQuery } from "query-mappers";
import { check, createValidator } from "xvalidators";
import {
  rateReactionModel,
  commentModel,
  SqlInfoRepository,
  SqlCommentRepository,
  SqlReactionRepository,
} from "reaction-query";
import { Comment, CommentValidator, ReactionService } from "reaction-service";
import { ReactionController } from "reaction-express";
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

export * from "./response-controller";
export * from "./response";

export { ResponseController };

export function generate(): string {
  return shortid.generate();
}

// Response
export class ResponseManager implements ResponseService {
  constructor(
    protected find: Search<Response, ResponseFilter>,
    public repository: ResponseRepository,
    private infoRepository: InfoRepository<Info>
  ) {
    this.response = this.response.bind(this);
    this.updateResponse = this.updateResponse.bind(this);
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

  return new ResponseManager(builder.search, repository, infoRepository);
}

export function useResponseController(
  log: Log,
  db: DB,
  mapper?: TemplateMap
): ResponseController {
  const responseValidator = createValidator<Response>(responseModel);
  return new ResponseController(
    log,
    useResponseService(db, mapper),
    responseValidator
  );
}

// Reaction
export function useResponseReactionService(
  db: DB,
  mapper?: TemplateMap
): ReactionService<Response, ResponseFilter> {
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

  return new ReactionService<Response, ResponseFilter>(
    builder.search,
    repository,
    responseReactionRepository,
    responseCommentRepository,
  );
}

export function useResponseReactionController(
  log: Log,
  db: DB,
  mapper?: TemplateMap
): ReactionController<Response, ResponseFilter, Comment> {
  const commentValidator = new CommentValidator(commentModel, check);
  return new ReactionController(
    log,
    useResponseReactionService(db, mapper),
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
