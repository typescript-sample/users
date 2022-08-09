import { Log } from 'express-ext';
import { Search, ViewSearchManager } from 'onecore';
import { buildToSave } from 'pg-extension';
import { DB, Repository, SearchBuilder, SqlLoadRepository } from 'query-core';
import { TemplateMap, useQuery } from 'query-mappers';
import {
  Info10,
  info10Model,
  Rate,
  RateFilter,
  rateModel,
  RateService,
  RateValidator,
} from 'rate-core';
import { SqlRateRepository } from 'rate-query';
import {
  Comment,
  CommentFilter,
  CommentValidator,
  ReactionService,
} from 'review-reaction';
import {
  RateCommentController,
  RateController,
  ReactionController,
} from 'review-reaction-express';
import {
  commentModel,
  InfoRepository,
  rateReactionModel,
  SqlCommentRepository,
  SqlInfoRepository,
  SqlReactionRepository,
} from 'review-reaction-query';
import { CommentQuery } from 'review-reaction-query';
import shortid from 'shortid';
import { check } from 'xvalidators';

import {
  Film,
  FilmFilter,
  filmModel,
  FilmRepository,
  FilmQuery,
} from './film';
import { FilmController } from './film-controller';

export { FilmController };

export class FilmService
  extends ViewSearchManager<Film, string, FilmFilter>
  implements FilmQuery {
  constructor(
    search: Search<Film, FilmFilter>,
    protected repository: FilmRepository,
    private infoRepository: InfoRepository<Info10>
  ) {
    super(search, repository);
  }
  load(id: string): Promise<Film | null> {
    return this.repository.load(id).then((film) => {
      if (!film) {
        return null;
      } else {
        return this.infoRepository.load(id).then((info) => {
          if (info) {
            delete (info as any)['id'];
            film.info = info;
          }
          return film;
        });
      }
    });
  }
}
export function useFilmController(
  log: Log,
  db: DB,
  mapper?: TemplateMap
): FilmController {
  const query = useQuery('film', mapper, filmModel, true);
  const builder = new SearchBuilder<Film, FilmFilter>(
    db.query,
    'film',
    filmModel,
    db.driver,
    query
  );
  const repository = new Repository<Film, string>(db, 'film', filmModel);
  const infoRepository = new SqlInfoRepository<Info10>(
    db,
    'filmrateinfo',
    info10Model,
    buildToSave
  );
  const service = new FilmService(
    builder.search,
    repository,
    infoRepository
  );

  return new FilmController(
    log,
    service
  );
}

// Rate
export function useFilmRateController(
  log: Log,
  db: DB,
  mapper?: TemplateMap
): RateController<Rate> {
  const rateRepository = new SqlRateRepository<Rate>(
    db,
    'filmrate',
    rateModel,
    buildToSave,
    10,
    'filmrateinfo',
    'rate',
    'count',
    'score',
    'author',
    'id'
  );
  const infoRepository = new SqlInfoRepository<Info10>(
    db,
    'filmrateinfo',
    info10Model,
    buildToSave
  );
  const rateValidator = new RateValidator(rateModel, check, 10);
  const rateService = new RateService(rateRepository, infoRepository);
  return new RateController(
    log,
    rateService.rate,
    rateValidator.validate,
    'author',
    'id'
  );
}

// Reaction
export function useFilmReactionService(
  db: DB,
  mapper?: TemplateMap
): ReactionService<Rate, RateFilter> {
  const query = useQuery('filmrate', mapper, rateModel, true);
  const builder = new SearchBuilder<Rate, RateFilter>(
    db.query,
    'filmrate',
    rateModel,
    db.driver,
    query
  );
  const rateRepository = new SqlLoadRepository<Rate, string, string>(
    db.query,
    'filmrate',
    rateModel,
    db.param,
    'id',
    'author'
  );
  const rateReactionRepository = new SqlReactionRepository(
    db,
    'filmratereaction',
    rateReactionModel,
    'filmrate',
    'usefulCount',
    'author',
    'id'
  );
  const rateCommentRepository = new SqlCommentRepository<Comment>(
    db,
    'filmratecomment',
    commentModel,
    'filmrate',
    'id',
    'author',
    'replyCount',
    'author',
    'time',
    'id'
  );
  return new ReactionService<Rate, RateFilter>(
    builder.search,
    rateRepository,
    rateReactionRepository,
    rateCommentRepository
  );
}

export function useFilmReactionController(
  log: Log,
  db: DB,
  mapper?: TemplateMap
): ReactionController<Rate, RateFilter, Comment> {
  const commentValidator = new CommentValidator(commentModel, check);
  return new ReactionController(
    log,
    useFilmReactionService(db, mapper),
    commentValidator,
    ['time'],
    ['rate', 'usefulCount', 'replyCount', 'count', 'score'],
    generate,
    'commentId',
    'userId',
    'author',
    'id'
  );
}

// Comment
export function useFilmRateCommentService(
  db: DB,
  mapper?: TemplateMap
): CommentQuery<Comment, CommentFilter> {
  const query = useQuery('filmratecomment', mapper, commentModel, true);
  const builder = new SearchBuilder<Comment, CommentFilter>(
    db.query,
    'filmratecomment',
    commentModel,
    db.driver,
    query
  );
  const rateCommentRepository = new SqlCommentRepository<Comment>(
    db,
    'filmratecomment',
    commentModel,
    'filmrate',
    'id',
    'author',
    'replyCount',
    'author',
    'time',
    'id'
  );
  return new CommentQuery<Comment, CommentFilter>(
    builder.search,
    rateCommentRepository
  );
}

export function useFilmRateCommentController(
  log: Log,
  db: DB,
  mapper?: TemplateMap
): RateCommentController<Comment> {
  return new RateCommentController(log, useFilmRateCommentService(db, mapper));
}

export function generate(): string {
  return shortid.generate();
}
