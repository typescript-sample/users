import shortid from "shortid";
import { Log } from "express-ext";
import { Manager, Search } from "onecore";
import { buildToSave } from "pg-extension";
import { DB, SearchBuilder, SqlLoadRepository } from "query-core";
import { TemplateMap, useQuery } from "query-mappers";
import { check } from "xvalidators";
import {
  commentModel,
  InfoRepository,
  rateReactionModel,
  SqlInfoRepository,
  SqlCommentRepository,
  SqlReactionRepository,
} from "reaction-query";
import {
  Comment,
  CommentFilter,
  CommentValidator,
  ReactionService,
} from "reaction-service";
import {
  RateController,
  RateCommentController,
  ReactionController,
} from "reaction-express";
import { CommentQuery } from "reaction-query";
import {
  Info10,
  rateModel,
  Rate,
  RateFilter,
  info10Model,
  RateService,
  RateValidator,
} from "rate-core";
import { SqlRateRepository } from "rate-query";

import {
  Film,
  FilmFilter,
  filmModel,
  FilmRepository,
  FilmService,
} from "./film";
import { FilmController } from "./film-controller";
import { SqlFilmRepositoy } from "./sql-film-repository";



export { FilmController };

export class FilmManager
  extends Manager<Film, string, FilmFilter>
  implements FilmService
{
  constructor(
    search: Search<Film, FilmFilter>,
    repository: FilmRepository,
    protected saveDirectors: (values: string[]) => Promise<number>,
    protected saveCast: (values: string[]) => Promise<number>,
    protected saveProductions: (values: string[]) => Promise<number>,
    protected saveCountries: (values: string[]) => Promise<number>,
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
            delete (info as any)["id"];
            film.info = info;
          }
          return film;
        });
      }
    });
  }

  insert(film: Film, ctx?: any): Promise<number> {
    if (film.directors && film.directors.length > 0) {
      this.saveDirectors(film.directors);
    }
    if (film.filmcast && film.filmcast.length > 0) {
      this.saveCast(film.filmcast);
    }
    if (film.productions && film.productions.length > 0) {
      this.saveProductions(film.productions);
    }
    if (film.countries && film.countries.length > 0) {
      this.saveCountries(film.countries);
    }
    return this.repository.insert(film, ctx);
  }
  update(film: Film, ctx?: any): Promise<number> {
    if (film.directors && film.directors.length > 0) {
      this.saveDirectors(film.directors);
    }
    if (film.filmcast && film.filmcast.length > 0) {
      this.saveCast(film.filmcast);
    }
    if (film.productions && film.productions.length > 0) {
      this.saveProductions(film.productions);
    }
    if (film.countries && film.countries.length > 0) {
      this.saveCountries(film.countries);
    }
    return this.repository.update(film, ctx);
  }
  patch(film: Film, ctx?: any): Promise<number> {
    if (film.directors && film.directors.length > 0) {
      this.saveDirectors(film.directors);
    }
    if (film.filmcast && film.filmcast.length > 0) {
      this.saveCast(film.filmcast);
    }
    if (film.productions && film.productions.length > 0) {
      this.saveProductions(film.productions);
    }
    if (film.countries && film.countries.length > 0) {
      this.saveCountries(film.countries);
    }
    return this.repository.patch
      ? this.repository.patch(film, ctx)
      : Promise.resolve(-1);
  }
}
export function useFilmService(
  db: DB,
  saveDirectors: (values: string[]) => Promise<number>,
  saveCast: (values: string[]) => Promise<number>,
  saveProductions: (values: string[]) => Promise<number>,
  saveCountries: (values: string[]) => Promise<number>,
  mapper?: TemplateMap
): FilmService {
  const query = useQuery("film", mapper, filmModel, true);
  const builder = new SearchBuilder<Film, FilmFilter>(
    db.query,
    "films",
    filmModel,
    db.driver,
    query
  );
  const repository = new SqlFilmRepositoy(db, "films");
  const infoRepository = new SqlInfoRepository<Info10>(
    db,
    "rates_film_info",
    info10Model,
    buildToSave
  );
  return new FilmManager(
    builder.search,
    repository,
    saveDirectors,
    saveCast,
    saveProductions,
    saveCountries,
    infoRepository
  );
}
export function useFilmController(
  log: Log,
  db: DB,
  saveDirectors: (values: string[]) => Promise<number>,
  saveCast: (values: string[]) => Promise<number>,
  saveProductions: (values: string[]) => Promise<number>,
  saveCountries: (values: string[]) => Promise<number>,
  mapper?: TemplateMap
): FilmController {
  return new FilmController(
    log,
    useFilmService(
      db,
      saveDirectors,
      saveCast,
      saveProductions,
      saveCountries,
      mapper
    )
  );
}

// Rate
export function useFilmReactionService(
  db: DB,
  mapper?: TemplateMap
): ReactionService<Rate, RateFilter> {
  const query = useQuery("rates_film", mapper, rateModel, true);
  const builder = new SearchBuilder<Rate, RateFilter>(
    db.query,
    "rates_film",
    rateModel,
    db.driver,
    query
  );

  const rateRepository = new SqlLoadRepository<Rate, string, string>(
    db.query,
    "rates_film",
    rateModel,
    db.param,
    "id",
    "author"
  );
  const rateReactionRepository = new SqlReactionRepository(
    db,
    "rates_film_reaction",
    rateReactionModel,
    "rates_film",
    "usefulCount",
    "author",
    "id"
  );
  const rateCommentRepository = new SqlCommentRepository<Comment>(
    db,
    "rates_film_comments",
    commentModel,
    "rates_film",
    "id",
    "author",
    "replyCount",
    "author",
    "time",
    "id"
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
  const rateValidator = new RateValidator(rateModel, check, 10);
  const commentValidator = new CommentValidator(commentModel, check);
  return new ReactionController(
    log,
    useFilmReactionService(db, mapper),
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

export function useFilmRateController(
  log: Log,
  db: DB,
  mapper?: TemplateMap
): RateController<Rate> {
  const rateRepository = new SqlRateRepository<Rate>(
    db,
    "rates_film",
    rateModel,
    buildToSave,
    10,
    "rates_film_info",
    "rate",
    "count",
    "score",
    "author",
    "id"
  );
  const infoRepository = new SqlInfoRepository<Info10>(
    db,
    "rates_film_info",
    info10Model,
    buildToSave
  );
  const rateValidator = new RateValidator(rateModel, check, 10);
  const rateService = new RateService(rateRepository, infoRepository);
  return new RateController(
    log,
    rateService.rate,
    rateValidator.validate,
    "author",
    "id"
  );
}

export function useFilmRateCommentService(
  db: DB,
  mapper?: TemplateMap
): CommentQuery<Comment, CommentFilter> {
  const query = useQuery("rates_film_comments", mapper, commentModel, true);
  const builder = new SearchBuilder<Comment, CommentFilter>(
    db.query,
    "rates_film_comments",
    commentModel,
    db.driver,
    query
  );
  const rateCommentRepository = new SqlCommentRepository<Comment>(
    db,
    "rates_film_comments",
    commentModel,
    "rates_film",
    "id",
    "author",
    "replyCount",
    "author",
    "time",
    "id"
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
