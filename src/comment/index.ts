import { Log, Manager, Search } from 'onecore';
import { DB, Repository, SearchBuilder } from 'query-core';
import { TemplateMap, useQuery } from 'query-mappers';
import { Comment, CommentFilter, commentModel, CommentRepository, CommentService } from './comment';
import { buildQuery } from './query';
export * from './comment';

import { Controller} from 'express-ext';

export class CommentController extends Controller<Comment, string, CommentFilter> {
  constructor(log: Log, public service: CommentService) {
    super(log, service);
  }
}
export class CommentManager extends Manager<Comment, string, CommentFilter> implements CommentService {
  constructor(search: Search<Comment, CommentFilter>, repository: CommentRepository) {
    super(search, repository);
  }
}

export function useCommentService(db: DB, mapper?: TemplateMap): CommentService {
  const queryComment = useQuery('comment', mapper, commentModel, true);
  const builder = new SearchBuilder<Comment, CommentFilter>(db.query, 'comments', commentModel, db.driver, buildQuery);
  const repository = new Repository<Comment, string>(db,'comments', commentModel);
  return new CommentManager(builder.search, repository);
}
export function useCommentController(log: Log, db: DB, mapper?: TemplateMap): CommentController {
  return new CommentController(log, useCommentService(db, mapper));
}
