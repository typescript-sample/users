import { Log } from 'express-ext';
import { Search } from 'onecore';
import { buildToSave } from 'pg-extension';
import { DB, GenericRepository, SearchBuilder } from 'query-core';
import { TemplateMap, useQuery } from 'query-mappers';
import { Comment, CommentValidator, ReactionService } from 'review-reaction';
import { ReactionController } from 'review-reaction-express';
import { InfoRepository } from 'review-reaction-query';
import {
  commentModel,
  rateReactionModel,
  SqlCommentRepository,
  SqlInfoRepository,
  SqlReactionRepository,
} from 'review-reaction-query';
import shortid from 'shortid';
import { check, createValidator } from 'xvalidators';
import {
  Info,
  infoModel,
  Response,
  ResponseFilter,
  responseModel,
  ResponseRepository,
  ResponseService,
  ShortResponse,
} from './response';

import { Request as Req, Response as Res } from 'express';
import { getStatusCode, handleError } from 'express-ext';
import { Validator } from 'onecore';
export * from './response';

export class ResponseController {
  constructor(
    protected log: Log,
    protected responseService: ResponseService,
    public validator: Validator<Response>
  ) {
    this.reply = this.reply.bind(this);
  }

  reply(req: Req, res: Res) {
    const id: string = req.params.id || req.body.id || '';
    const author: string = req.params.author || req.body.author || '';
    const response: Response = { id, author, ...req.body };
    response.time = new Date();
    this.validator
      .validate(response)
      .then((errors) => {
        if (errors && errors.length > 0) {
          res.status(getStatusCode(errors)).json(errors).send();
        } else {
          this.responseService
            .response(response)
            .then((rs) => {
              return res.status(200).json(rs).send();
            })
            .catch((err) => handleError(err, res, this.log));
        }
      })
      .catch((err) => handleError(err, res, this.log));
  }
}


export function generate(): string {
  return shortid.generate();
}

// Response
export class ResponseManager implements ResponseService {
  constructor(
    protected find: Search<Response, ResponseFilter>,
    public repository: ResponseRepository,
    public infoRepository: InfoRepository<Info>
  ) {
    this.response = this.response.bind(this);
  }
  async response(response: Response): Promise<number> {
    response.time = new Date();
    const info = await this.infoRepository.exist?.(response.id);
    if (!info) {
      const r0 = await this.repository.insert(response, true);
      return r0;
    }
    const exist = await this.repository.load(response.id, response.author);
    console.log(exist);
    if (!exist) {
      const r1 = await this.repository.insert(response);
      return r1;
    }
    const sr: ShortResponse = { description: exist.description, time: exist.time };
    if (exist.histories && exist.histories.length > 0) {
      const history = exist.histories;
      console.log(history);
      history.push(sr);
      response.histories = history;
    } else {
      response.histories = [sr];
    }
    console.log(sr, response);
    const res = await this.repository.update(response);
    console.log(res);
    return res;
  }
}

export function useResponseService(
  db: DB,
  mapper?: TemplateMap
): ResponseService {
  const query = useQuery('itemresponse', mapper, responseModel, true);
  const builder = new SearchBuilder<Response, ResponseFilter>(
    db.query,
    'itemresponse',
    responseModel,
    db.driver,
    query
  );
  const repository = new GenericRepository<Response, string, string>(
    db,
    'itemresponse',
    responseModel,
    'id',
    'author'
  );
  const infoRepository = new SqlInfoRepository<Info>(
    db,
    'iteminfo',
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
  const query = useQuery('itemresponse', mapper, responseModel, true);
  const builder = new SearchBuilder<Response, ResponseFilter>(
    db.query,
    'itemresponse',
    responseModel,
    db.driver,
    query
  );
  const repository = new GenericRepository<Response, string, string>(
    db,
    'itemresponse',
    responseModel,
    'id',
    'author'
  );
  const responseReactionRepository = new SqlReactionRepository(
    db,
    'itemresponsereaction',
    rateReactionModel,
    'itemresponse',
    'usefulCount',
    'author',
    'id'
  );
  const responseCommentRepository = new SqlCommentRepository<Comment>(
    db,
    'itemcomment',
    commentModel,
    'itemresponse',
    'id',
    'author',
    'replyCount',
    'author',
    'time',
    'id'
  );

  return new ReactionService<Response, ResponseFilter>(
    builder.search,
    repository,
    responseReactionRepository,
    responseCommentRepository
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
    ['time'],
    ['response', 'usefulCount', 'replyCount', 'count', 'score'],
    generate,
    'commentId',
    'userId',
    'author',
    'id'
  );
}
