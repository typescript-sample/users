import { Log } from "express-ext";
import { buildToSave } from "pg-extension";
import { DB, SearchBuilder } from "query-core";
import { TemplateMap, useQuery } from "query-mappers";
import {
  infoModel,
  Response,
  ResponseFilter,
  ResponseService,
  responseModel,
  ResponseComment,
  ResponseCommentFilter,
  ResponseCommentService,
  responseCommentModel,
} from "./response";
import { ResponseController } from "./response-controller";
import { ResponseManager } from "./service";
import {
  responseReactionModel,
  SqlInfoRepository,
  SqlResponseCommentRepository,
  SqlResponseReactionRepository,
  SqlResponseRepository,
} from "./sql-response-repository";

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
  const infoRepository = new SqlInfoRepository(
    db,
    "item_info",
    infoModel,
    buildToSave
  );
  const responseReactionRepository = new SqlResponseReactionRepository(
    db,
    "item_response_reaction",
    responseReactionModel,
    "item_response",
    "usefulCount",
    "author",
    "id"
  );

  const responseCommentRepository = new SqlResponseCommentRepository(
    db,
    "item_comment",
    responseCommentModel,
    "item_response",
    "replyCount",
    "author",
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
  return new ResponseController(log, useResponseService(db, mapper));
}
