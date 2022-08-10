import { Build, Log } from 'express-ext';
import { Manager, Search } from 'onecore';
import { buildToSave } from 'pg-extension';
import { DB, SearchBuilder, SqlLoadRepository } from 'query-core';
import { TemplateMap, useQuery } from 'query-mappers';
import { Info10, info10Model, Rate, RateFilter, rateModel, RateService, RateValidator } from 'rate-core';
import { SqlRateRepository } from 'rate-query';
import { Comment, CommentFilter, CommentValidator, ReactionService } from 'review-reaction';
import { RateCommentController, RateController, ReactionController } from 'review-reaction-express';
import { commentModel, CommentQuery, rateReactionModel, SqlCommentRepository, SqlInfoRepository, SqlReactionRepository } from 'review-reaction-query';
import { check } from 'xvalidators';
import { Appreciation, AppreciationFilter, AppreciationId, appreciationModel, AppreciationRepository, AppreciationService, Reply, ReplyFilter, ReplyId, replyModel, ReplyRepository, ReplyService, Useful, usefulModel, UsefulRepository } from './appreciation';
import { AppreciationController } from './appreciation-controller';
import { AppreciationReplyController } from './reply-controller';
import { SqlAppreciationRepository } from './sql-appreciation-repository';
import { SqlReplyRepository } from './sql-reply-repository';
import { SqlUsefulRepository } from './sql-useful-repository';

export * from './appreciation-controller';
export * from './reply-controller';
export * from './appreciation';
export { AppreciationController };
export { AppreciationReplyController };

export class AppreciationManager extends Manager<Appreciation, AppreciationId, AppreciationFilter> implements AppreciationService {
  constructor(search: Search<Appreciation, AppreciationFilter>,
    public repository: AppreciationRepository, private replyRepository: ReplyRepository, private usefulRepository: UsefulRepository) {
    super(search, repository);
    this.reply = this.reply.bind(this);
    this.removeReply = this.removeReply.bind(this);
    this.updateReply = this.updateReply.bind(this);
    this.setUseful = this.setUseful.bind(this);
  }

  async getReplys(id: string, author: string, ctx?: any): Promise<Reply[]> {
    const data = await this.replyRepository.getReplys(id, author);
    return data;
  }

  async reply(reply: Reply): Promise<boolean> {
    const checkReply = await this.replyRepository.getReply(reply.id, reply.author, reply.userId);
    const checkAppreciation = await this.repository.getAppreciation(reply.id, reply.author);

    if (!checkAppreciation) { // cmt not exist in db -> cant rep
      return false;
    } else {
      if (checkReply) {
        return false;
      } else {
        reply.time ? reply.time = reply.time : reply.time = new Date();
        reply.updateAt ? reply.updateAt = reply.updateAt : reply.updateAt = new Date();
        const wait = await this.replyRepository.insert(reply);
        await this.repository.increaseReplyCount(reply.id, reply.author);
        console.log(reply);
        return true;
      }
    }
  }

  removeReply(id: string, author: string, userId: string, ctx?: any): Promise<number> {
    return this.replyRepository.getReply(id, author, userId).then(exist => {
      if (exist) {
        return this.replyRepository.removeReply(id, author, userId).then(res => {
          if (res > 0) {
            return this.repository.decreaseReplyCount(id, author);
          } else {
            return 0;
          }
        });
      } else {
        return 0;
      }
    });
  }

  async updateReply(reply: Reply): Promise<number> {
    const exist = await this.replyRepository.getReply(reply.id, reply.author, reply.userId);
    if (!exist) {
      return 0;
    } else {
      return await this.replyRepository.update(reply);
    }
  }

  async setUseful(id: string, author: string, userId: string, ctx?: any): Promise<number> {
    const check = await this.usefulRepository.getUseful(id, author, userId);
    console.log(check);
    if (check) {
      return 0;
    } else {
      const useful: Useful = { id, author, userId, reviewTime: new Date };
      const rs = await this.usefulRepository.save(useful);
      console.log(rs);
      if (rs > 0) {
        const res = await this.replyRepository.increaseUsefulCount(id, author, userId);
        console.log(res);
        return 1;
      } else {
        return 0;
      }
    }
  }
}



export class ReplyManager extends Manager<Reply, ReplyId, ReplyFilter> implements ReplyService {
  constructor(search: Search<Reply, ReplyFilter>,
    protected replyRepository: ReplyRepository) {
    super(search, replyRepository);
  }
}

export function useReplyService(db: DB, mapper?: TemplateMap): ReplyService {
  const repQuery = useQuery('reply', mapper, replyModel, true);
  const builder = new SearchBuilder<Reply, ReplyFilter>(db.query, 'reply', replyModel, db.driver, repQuery);
  const replyRepository = new SqlReplyRepository(db, 'reply', buildToSave);
  return new ReplyManager(builder.search, replyRepository);
}

export function useAppreciationReplyController(log: Log, db: DB, mapper?: TemplateMap): AppreciationReplyController {
  return new AppreciationReplyController(log, useReplyService(db, mapper));
}

export function useAppreciationController(log: Log, db: DB, mapper?: TemplateMap): RateController<Rate> {
  const rateRepository = new SqlRateRepository<Rate>(db, 'appreciation', rateModel, buildToSave, 10, 'appreciationinfo', 'rate', 'count', 'score', 'author', 'id');
  const infoRepository = new SqlInfoRepository<Info10>(db, 'appreciationinfo', info10Model, buildToSave);
  const rateValidator = new RateValidator(rateModel, check, 10);
  const rateService = new RateService(rateRepository, infoRepository);
  return new RateController(log, rateService.rate, rateValidator.validate, 'author', 'id');
}

export function useAppreciationReactionController(log: Log, db: DB,generate:()=>string, mapper?: TemplateMap): ReactionController<Rate, RateFilter, Comment> {
  const query = useQuery('appreciation', mapper, rateModel, true);
  const builder = new SearchBuilder<Rate, RateFilter>(db.query, 'appreciation', rateModel, db.driver, query);
  const rateRepository = new SqlLoadRepository<Rate, string, string>(db.query, 'appreciation', rateModel, db.param, 'id', 'author');
  const rateReactionRepository = new SqlReactionRepository(db, 'appreciationreaction', rateReactionModel, 'appreciation', 'usefulCount', 'author', 'id');
  const rateCommentRepository = new SqlCommentRepository<Comment>(db, 'appreciationcomment', commentModel, 'appreciation', 'id', 'author', 'replyCount', 'author', 'time', 'id');
  const service = new ReactionService<Rate, RateFilter>(builder.search, rateRepository, rateReactionRepository, rateCommentRepository);
  const commentValidator = new CommentValidator(commentModel, check);
  return new ReactionController(log, service, commentValidator, ['time'], ['rate', 'usefulCount', 'replyCount', 'count', 'score'],
    generate, 'commentId', 'userId', 'author', 'id');
}

export function useAppreciationCommentController(log: Log, db: DB, mapper?: TemplateMap): RateCommentController<Comment> {
  const query = useQuery('appreciationcomment', mapper, commentModel, true);
  const builder = new SearchBuilder<Comment, CommentFilter>(db.query, 'appreciationcomment', commentModel, db.driver, query);
  const rateCommentRepository = new SqlCommentRepository<Comment>(db, 'appreciationcomment', commentModel, 'appreciation', 'id', 'author', 'replyCount', 'author', 'time', 'id');
  const service = new CommentQuery<Comment, CommentFilter>(builder.search, rateCommentRepository);
  return new RateCommentController(log, service);
}
