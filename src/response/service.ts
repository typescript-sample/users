import { Manager, Search } from "./core";
import {
  Info,
  Response,
  ResponseFilter,
  ResponseId,
  ResponseRepository,
  ResponseService,
} from "./response";

import { Comment } from "rate-core";
import {
  InfoRepository,
  ReactionRepository,
  CommentRepository,
} from "reaction-query";

import { ShortComment } from "rate-core";
import { SearchResult } from "onecore";
export * from "./response";

export class ResponseManager
  implements ResponseService
{
  constructor(
    protected find: Search<Response, ResponseFilter>,
    public repository: ResponseRepository,
    private infoRepository: InfoRepository<Info>,
    private responseCommentRepository: CommentRepository<Comment>,
    private responseReactionRepository: ReactionRepository
  ) {
    this.response = this.response.bind(this);
    this.updateResponse = this.updateResponse.bind(this);
    this.comment = this.comment.bind(this);
    this.getComments = this.getComments.bind(this);
    this.removeComment = this.removeComment.bind(this);
    this.updateComment = this.updateComment.bind(this);
  }
  search(s: ResponseFilter, limit?: number, offset?: number | string, fields?: string[]): Promise<SearchResult<Response>> {
    return this.find(s, limit, offset, fields);
  }
  load(id: string, author: string): Promise<Response|null> {
    return this.repository.load(id, author);
  }
  async response(response: Response): Promise<boolean> {
    let info = await this.infoRepository.load(response.id);
    if (!info) {
      info = {
        id: response.id,
        viewCount: 0,
      };
    }
    info.viewCount++;
    response.usefulCount = 0;
    await this.infoRepository.save(info);
    await this.repository.save(response);
    return true;
  }
  getResponse(id: string, author: string): Promise<Response | null> {
    return this.repository.load(id, author);
  }
  updateResponse(response: Response): Promise<number> {
    return this.repository
      .load(response.id, response.author)
      .then((exist) => {
        if (exist) {
          response.time
            ? (response.time = response.time)
            : (response.time = new Date());
          return this.repository.update(response);
        } else {
          return 0;
        }
      });
  }
  setUseful(id: string, author: string, userId: string): Promise<number> {
    return this.responseReactionRepository.save(id, author, userId, 1);
  }
  removeUseful(id: string, author: string, userId: string): Promise<number> {
    return this.responseReactionRepository.remove(id, author, userId);
  }
  comment(comment: Comment): Promise<number> {
    return this.repository
      .load(comment.id, comment.author)
      .then((checkResponse) => {
        if (!checkResponse) {
          return 0;
        } else {
          comment.time
            ? (comment.time = comment.time)
            : (comment.time = new Date());
          return this.responseCommentRepository.insert(comment);
        }
      });
  }
  getComment(id: string): Promise<Comment | null> {
    return this.responseCommentRepository.load(id);
  }
  getComments(
    id: string,
    author: string,
    limit?: number
  ): Promise<Comment[]> {
    if (limit && limit > 0) {
      return this.responseCommentRepository.getComments(id, author, limit);
    }
    return this.responseCommentRepository.getComments(id, author);
  }
  removeComment(commentId: string, userId: string): Promise<number> {
    return this.responseCommentRepository.load(commentId).then((comment) => {
      if (comment) {
        if (userId === comment.author || userId === comment.userId) {
          return this.responseCommentRepository.remove(
            commentId,
            comment.id,
            comment.author
          );
        } else {
          return -2;
        }
      } else {
        return -1;
      }
    });
  }
  updateComment(comment: Comment): Promise<number> {
    return this.responseCommentRepository
      .load(comment.commentId)
      .then((exist) => {
        if (!exist) {
          return 0;
        } else {
          comment.updatedAt = new Date();
          const c: ShortComment = { comment: exist.comment, time: exist.time };
          if (!comment.histories || comment.histories.length === 0) {
            comment.histories = [c];
          } else {
            comment.histories.push(c);
          }
          return this.responseCommentRepository.update(comment);
        }
      });
  }
}
