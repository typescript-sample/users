import { Log, SavedController } from 'express-ext';

import { SavedService, Search, ViewSearchManager } from 'onecore';
import { ArrayRepository, buildToSave } from 'pg-extension';
import { DB, QueryRepository, Repository, SearchBuilder, SqlLoadRepository } from 'query-core';
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
import { QueryController } from 'express-ext';


export class FilmController extends QueryController<Film, string, FilmFilter> {
  constructor(log: Log, filmService: FilmQuery) {
    super(log, filmService);
  }
}

export class FilmService extends ViewSearchManager<Film, string, FilmFilter> implements FilmQuery {
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



export function useFilmController(log: Log, db: DB, mapper?: TemplateMap): FilmController {
  const query = useQuery('film', mapper, filmModel, true);
  const builder = new SearchBuilder<Film, FilmFilter>(db.query, 'film', filmModel, db.driver, query);
  const repository = new Repository<Film, string>(db, 'film', filmModel);
  const infoRepository = new SqlInfoRepository<Info10>(db, 'filmrateinfo', info10Model, buildToSave);
  const service = new FilmService(builder.search, repository, infoRepository);
  return new FilmController(log, service);
}

export function useFilmRateController(log: Log, db: DB, mapper?: TemplateMap): RateController<Rate> {
  const rateRepository = new SqlRateRepository<Rate>(db, 'filmrate', rateModel, buildToSave, 10, 'filmrateinfo', 'rate', 'count', 'score', 'author', 'id');
  const infoRepository = new SqlInfoRepository<Info10>(db, 'filmrateinfo', info10Model, buildToSave);
  const rateValidator = new RateValidator(rateModel, check, 10);
  const rateService = new RateService(rateRepository, infoRepository);
  return new RateController(log, rateService.rate, rateValidator.validate, 'author', 'id');
}

export function useFilmReactionController(log: Log, db: DB, mapper?: TemplateMap): ReactionController<Rate, RateFilter, Comment> {
  const query = useQuery('filmrate', mapper, rateModel, true);
  const builder = new SearchBuilder<Rate, RateFilter>(db.query, 'filmrate', rateModel, db.driver, query);
  const rateRepository = new SqlLoadRepository<Rate, string, string>(db.query, 'filmrate', rateModel, db.param, 'id', 'author');
  const rateReactionRepository = new SqlReactionRepository(db, 'filmratereaction', rateReactionModel, 'filmrate', 'usefulCount', 'author', 'id');
  const rateCommentRepository = new SqlCommentRepository<Comment>(db, 'filmratecomment', commentModel, 'filmrate', 'id', 'author', 'replyCount', 'author', 'time', 'id');
  const service = new ReactionService<Rate, RateFilter>(builder.search, rateRepository, rateReactionRepository, rateCommentRepository);
  const commentValidator = new CommentValidator(commentModel, check);
  return new ReactionController(log, service, commentValidator, ['time'], ['rate', 'usefulCount', 'replyCount', 'count', 'score'],
    generate, 'commentId', 'userId', 'author', 'id');
}

export function useFilmRateCommentController(log: Log, db: DB, mapper?: TemplateMap): RateCommentController<Comment> {
  const query = useQuery('filmratecomment', mapper, commentModel, true);
  const builder = new SearchBuilder<Comment, CommentFilter>(db.query, 'filmratecomment', commentModel, db.driver, query);
  const rateCommentRepository = new SqlCommentRepository<Comment>(db, 'filmratecomment', commentModel, 'filmrate', 'id', 'author', 'replyCount', 'author', 'time', 'id');
  const service = new CommentQuery<Comment, CommentFilter>(builder.search, rateCommentRepository);
  return new RateCommentController(log, service);
}

export function generate(): string {
  return shortid.generate();
}

export function useSavedFilmsController(log: Log, db: DB): SavedController<Film> {
  const savedRepository = new ArrayRepository<string, string>(db.query, db.exec, 'savedfilm', 'items', 'id');
  const repository = new QueryRepository<Film, string>(db, 'film', filmModel);
  const service = new SavedService<string, Film>(savedRepository, repository.query, 50);
  return new SavedController<Film>(log, service, 'itemId', 'id');
}
