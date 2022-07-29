import { ShortComment } from "response";
import { Manager, Search } from "./core";
import {
  InfoRepository,
  Response,
  ResponseComment,
  ResponseCommentFilter,
  ResponseCommentRepository,
  ResponseCommentService,
  ResponseFilter,
  ResponseId,
  ResponseReactionRepository,
  ResponseRepository,
  ResponseService,
} from "./response";
export * from "./response";

export class ResponseManager
  extends Manager<Response, ResponseId, ResponseFilter>
  implements ResponseService
{
  constructor(
    search: Search<Response, ResponseFilter>,
    public repository: ResponseRepository,
    private infoRepository: InfoRepository,
    private responseCommentRepository: ResponseCommentRepository,
    private responseReactionRepository: ResponseReactionRepository
  ) {
    super(search, repository);
    this.response = this.response.bind(this);
    this.update = this.update.bind(this);
    this.save = this.save.bind(this);
    this.comment = this.comment.bind(this);
    this.load = this.load.bind(this);
    this.removeComment = this.removeComment.bind(this);
    this.updateComment = this.updateComment.bind(this);
    this.updateResponse = this.updateResponse.bind(this);
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
    return this.repository.getResponse(id, author);
  }

  setUseful(id: string, author: string, userId: string): Promise<number> {
    return this.responseReactionRepository.save(id, author, userId, 1);
  }
  removeUseful(id: string, author: string, userId: string): Promise<number> {
    return this.responseReactionRepository.remove(id, author, userId);
  }
  comment(comment: ResponseComment): Promise<number> {
    return this.repository
      .getResponse(comment.id, comment.author)
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
  updateComment(comment: ResponseComment): Promise<number> {
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
  updateResponse(response: Response): Promise<number> {
    return this.repository
      .getResponse(response.id, response.author)
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
}
// tslint:disable-next-line:max-classes-per-file
export class ResponseCommentManager
  extends Manager<ResponseComment, string, ResponseCommentFilter>
  implements ResponseCommentService
{
  constructor(
    search: Search<ResponseComment, ResponseCommentFilter>,
    protected replyRepository: ResponseCommentRepository
  ) {
    super(search, replyRepository);
  }
}
