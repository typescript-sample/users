
import { Log } from 'express-ext';
import { Manager, Search } from 'onecore';
import { DB, SearchBuilder } from 'query-core';
import { TemplateMap, useQuery } from 'query-mappers';
import {
  Film,
  FilmFilter,
  filmModel,
  FilmRepository,
  FilmService
} from './film';
import { BackOfficeFilmController } from './film-controller';
import { SqlFilmRepositoy } from './sql-film-repository';

export { BackOfficeFilmController };

export class FilmManager
  extends Manager<Film, string, FilmFilter>
  implements FilmService {
  constructor(
    search: Search<Film, FilmFilter>,
    repository: FilmRepository,
    protected saveDirectors: (values: string[]) => Promise<number>,
    protected saveCast: (values: string[]) => Promise<number>,
    protected saveProductions: (values: string[]) => Promise<number>,
    protected saveCountries: (values: string[]) => Promise<number>
  ) {
    super(search, repository);
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
  const query = useQuery('film', mapper, filmModel, true);
  const builder = new SearchBuilder<Film, FilmFilter>(
    db.query,
    'films',
    filmModel,
    db.driver,
    query
  );
  const repository = new SqlFilmRepositoy(db, 'films');

  return new FilmManager(
    builder.search,
    repository,
    saveDirectors,
    saveCast,
    saveProductions,
    saveCountries
  );
}
export function useBackOfficeFilmController(
  log: Log,
  db: DB,
  saveDirectors: (values: string[]) => Promise<number>,
  saveCast: (values: string[]) => Promise<number>,
  saveProductions: (values: string[]) => Promise<number>,
  saveCountries: (values: string[]) => Promise<number>,
  mapper?: TemplateMap
): BackOfficeFilmController {
  return new BackOfficeFilmController(
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
