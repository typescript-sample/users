import shortid from "shortid";
import { Log } from "express-ext";
import { buildToSave } from "pg-extension";
import { DB, SearchBuilder } from "query-core";
import { TemplateMap, useQuery } from "query-mappers";
import { check, createValidator } from "xvalidators";
import {
  infoModel,
  Info,
  Response,
  ResponseFilter,
  ResponseService,
  responseModel,
  responseCommentModel,
} from "./response";
import { ResponseController } from "./response-controller";
import { ResponseManager } from "./service";
import { SqlResponseRepository } from "./sql-response-repository";
import {
  rateReactionModel,
  SqlInfoRepository,
  SqlCommentRepository,
  SqlReactionRepository,
} from "reaction-query";
import { Comment, CommentValidator } from "rate-core";

export * from "./response-controller";
export * from "./response";
export * from "./service";
export * from "./sql-response-repository";

export { ResponseController };

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
  const repository = new SqlResponseRepository(
    db,
    "item_response",
    responseModel,
    buildToSave
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
    responseCommentModel,
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
  const commentValidator = new CommentValidator(responseCommentModel, check);
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
