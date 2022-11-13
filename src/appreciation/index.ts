import { Request as Req, Response as Res } from 'express';
import { getStatusCode, handleError, Log } from 'express-ext';
import { Search, Validator } from 'onecore';
import { useUrlQuery } from 'pg-extension';
import { DB, GenericRepository, SearchBuilder, SqlLoadRepository } from 'query-core';
import { TemplateMap, useQuery } from 'query-mappers';
import { Rate, RateFilter, rateModel } from 'rate-core';
import { Comment, CommentFilter, CommentValidator, ReactionService } from 'review-reaction';
import { RateCommentController, ReactionController } from 'review-reaction-express';
import { commentModel, CommentQuery, rateReactionModel, SqlCommentRepository, SqlReactionRepository } from 'review-reaction-query';
import { check, createValidator } from 'xvalidators';
import { Appreciation, AppreciationFilter, appreciationModel, AppreciationRepository, AppreciationService, Histories } from './appreciation';

export * from './appreciation';

export class AppreciationController {
  constructor(protected log: Log, protected responseService: AppreciationService, public validator: Validator<Appreciation>) {
    this.reply = this.reply.bind(this);
  }

  reply(req: Req, res: Res) {
    const id: string = req.params.id || req.body.id || '';
    const author: string = req.params.author || req.body.author || '';
    const response: Appreciation = { id, author, ...req.body };
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

export class AppreciationManager implements AppreciationService {
  constructor(
    protected find: Search<Appreciation, AppreciationFilter>,
    public repository: AppreciationRepository,
  ) {
    this.response = this.response.bind(this);
  }
  async response(response: Appreciation): Promise<number> {
    response.time = new Date();
    const exist = await this.repository.load(response.id, response.author);
    if (!exist) {
      const r1 = await this.repository.insert(response);
      return r1;
    }
    const sr: Histories = { review: exist.review, time: exist.time };
    if (exist.histories && exist.histories.length > 0) {
      const history = exist.histories;
      history.push(sr);
      response.histories = history;
    } else {
      response.histories = [sr];
    }
    const res = await this.repository.update(response);
    return res;
  }
}

export function useAppreciationService(db: DB, mapper?: TemplateMap): AppreciationService {
  const query = useQuery('appreciation', mapper, appreciationModel, true);
  const builder = new SearchBuilder<Appreciation, AppreciationFilter>(db.query, 'appreciation', appreciationModel, db.driver, query);
  const repository = new GenericRepository<Appreciation, string, string>(db, 'appreciation', appreciationModel, 'id', 'author');
  return new AppreciationManager(builder.search, repository);
}

export function useAppreciationController(log: Log, db: DB, mapper?: TemplateMap): AppreciationController {
  const responseValidator = createValidator<Appreciation>(appreciationModel);
  return new AppreciationController(log, useAppreciationService(db, mapper), responseValidator);
}

export function useAppreciationReactionController(log: Log, db: DB, generate: () => string, mapper?: TemplateMap): ReactionController<Rate, RateFilter, Comment> {
  const query = useQuery('appreciation', mapper, rateModel, true);
  const builder = new SearchBuilder<Rate, RateFilter>(db.query, 'appreciation', rateModel, db.driver, query);
  const rateRepository = new SqlLoadRepository<Rate, string, string>(db.query, 'appreciation', rateModel, db.param, 'id', 'author');
  const rateReactionRepository = new SqlReactionRepository(db, 'appreciationreaction', rateReactionModel, 'appreciation', 'usefulCount', 'author', 'id');
  const rateCommentRepository = new SqlCommentRepository<Comment>(db, 'appreciationcomment', commentModel, 'appreciation', 'id', 'author', 'replyCount', 'author', 'time', 'id');
  const queryUrl = useUrlQuery<string>(db.query, 'users', 'imageURL', 'id');
  const service = new ReactionService<Rate, RateFilter>(builder.search, rateRepository, rateReactionRepository, rateCommentRepository, queryUrl);
  const commentValidator = new CommentValidator(commentModel, check);
  return new ReactionController(log, service, commentValidator, ['time'], ['rate', 'usefulCount', 'replyCount', 'count', 'score'],
    generate, 'commentId', 'userId', 'author', 'id');
}

export function useAppreciationCommentController(log: Log, db: DB, mapper?: TemplateMap): RateCommentController<Comment> {
  const query = useQuery('appreciationcomment', mapper, commentModel, true);
  const builder = new SearchBuilder<Comment, CommentFilter>(db.query, 'appreciationcomment', commentModel, db.driver, query);
  const rateCommentRepository = new SqlCommentRepository<Comment>(db, 'appreciationcomment', commentModel, 'appreciation', 'id', 'author', 'replyCount', 'author', 'time', 'id');
  const queryUrl = useUrlQuery<string>(db.query, 'users', 'imageURL', 'id');
  const service = new CommentQuery<Comment, CommentFilter>(builder.search, rateCommentRepository, queryUrl);
  return new RateCommentController(log, service);
}
