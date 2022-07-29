import { Controller, Log } from 'express-ext';
import { ResponseComment, ResponseCommentFilter, ResponseCommentService } from './response';

export class ResponseCommentController extends Controller<ResponseComment, string, ResponseCommentFilter> {
  constructor(log: Log, protected responseCommentService: ResponseCommentService) {
    super(log, responseCommentService);
  }
}

