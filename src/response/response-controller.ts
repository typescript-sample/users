import { Request as Req, Response as Res } from "express";
import { Controller, getStatusCode, handleError, Log } from "express-ext";
import { Validator } from "onecore";
import { createValidator } from "xvalidators";
import {
  Response,
  ResponseComment,
  responseCommentModel,
  ResponseFilter,
  ResponseId,
  responseModel,
  ResponseService,
} from "./response";
export class ResponseController extends Controller<
  Response,
  ResponseId,
  ResponseFilter
> {
  validator: Validator<Response>;
  responseCommentValidator: Validator<ResponseComment>;

  constructor(protected log: Log, protected responseService: ResponseService) {
    super(log, responseService);
    this.response = this.response.bind(this);
    this.load = this.load.bind(this);
    // this.search = this.search.bind(this);
    this.updateResponse = this.updateResponse.bind(this);
    this.setUseful = this.setUseful.bind(this);
    this.removeUseful = this.removeUseful.bind(this);
    this.comment = this.comment.bind(this);
    this.getComments = this.getComments.bind(this);
    this.removeComment = this.removeComment.bind(this);
    this.updateComment = this.updateComment.bind(this);
    this.validator = createValidator<Response>(responseModel);
    this.responseCommentValidator =
      createValidator<ResponseComment>(responseCommentModel);
  }

  load(req: Req, res: Res) {
    const id = req.params.id;
    const author = req.params.author;
    const responseId: ResponseId = { id, author };
    this.responseService
      .load(responseId)
      .then((responses: any) => {
        if (responses) {
          return res.status(200).json(responses).end();
        } else {
          return res.status(200).json({}).end();
        }
      })
      .catch((err: any) => handleError(err, res, this.log));
  }

  // search(req: Req, res: Res) {
  //   const id = req.params.id;
  //   const response: ResponseFilter = { id };
  //   this.responseService
  //     .search(response)
  //     .then((responses: any) => {
  //       if (responses) {
  //         return res.status(200).json(responses).end();
  //       } else {
  //         return res.status(200).json({}).end();
  //       }
  //     })
  //     .catch((err: any) => handleError(err, res, this.log));
  // }

  response(req: Req, res: Res) {
    const response: Response = req.body;
    response.time = new Date();
    this.validator
      .validate(response)
      .then((errors) => {
        if (errors && errors.length > 0) {
          res.status(getStatusCode(errors)).json(errors).end();
        } else {
          this.responseService
            .response(response)
            .then((rs) => {
              return res.status(200).json(rs).end();
            })
            .catch((err) => handleError(err, res, this.log));
        }
      })
      .catch((err) => handleError(err, res, this.log));
  }

  updateResponse(req: Req, res: Res) {
    const id = req.params.id;
    const author = req.params.author;
    const response: Response = { id, author, ...req.body };
    this.validator
      .validate(response)
      .then((errors) => {
        if (errors && errors.length > 0) {
          res.status(getStatusCode(errors)).json(errors).end();
        } else {
          this.responseService
            .updateResponse(response)
            .then((reply) => {
              return res.status(200).json(reply).end();
            })
            .catch((err) => handleError(err, res, this.log));
        }
      })
      .catch((err) => handleError(err, res, this.log));
  }

  setUseful(req: Req, res: Res) {
    const id = req.params.id;
    const author = req.params.author;
    const userId = req.params.userid;
    console.log(req.params);

    this.responseService
      .setUseful(id, author, userId)
      .then((rs) => {
        return res.status(200).json(rs).end();
      })
      .catch((err) => handleError(err, res, this.log));
  }

  removeUseful(req: Req, res: Res) {
    const id = req.params.id;
    const author = req.params.author;
    const userId = req.params.userid;
    this.responseService
      .removeUseful(id, author, userId)
      .then((rs) => {
        return res.status(200).json(rs).end();
      })
      .catch((err) => handleError(err, res, this.log));
  }

  comment(req: Req, res: Res) {
    const id = req.params.id;
    const author = req.params.author;
    const userId = req.params.userid;
    const comment: ResponseComment = { id, author, userId, ...req.body };
    this.responseCommentValidator
      .validate(comment)
      .then((errors) => {
        if (errors && errors.length > 0) {
          res.status(getStatusCode(errors)).json(errors).end();
        } else {
          this.responseService
            .comment(comment)
            .then((rep) => {
              return res.status(200).json(rep).end();
            })
            .catch((err) => handleError(err, res, this.log));
        }
      })
      .catch((err) => handleError(err, res, this.log));
  }

  getComments(req: Req, res: Res) {
    const id = String(req.query.id);
    const author = String(req.query.author);
    if (req.query.limit && Number(req.query.limit) > 0) {
      const limit = Number(req.query.limit);
      this.responseService
        .getComments(id, author, limit)
        .then((rep) => {
          return res.status(200).json(rep).end();
        })
        .catch((err) => handleError(err, res, this.log));
    }
    this.responseService
      .getComments(id, author)
      .then((rep) => {
        return res.status(200).json(rep).end();
      })
      .catch((err) => handleError(err, res, this.log));
  }

  removeComment(req: Req, res: Res) {
    const commentId = req.params.commentid;
    const author = req.params.author;
    this.responseService
      .removeComment(commentId, author)
      .then((reply) => {
        return res.status(200).json(reply).end();
      })
      .catch((err) => handleError(err, res, this.log));
  }

  updateComment(req: Req, res: Res) {
    const commentId = req.params.commentid;
    const id = req.params.id;
    const author = req.params.author;
    const userId = req.params.userid;
    const comment: ResponseComment = {
      commentId,
      id,
      author,
      userId,
      ...req.body,
    };
    this.responseCommentValidator
      .validate(comment)
      .then((errors) => {
        if (errors && errors.length > 0) {
          res.status(getStatusCode(errors)).json(errors).end();
        } else {
          this.responseService
            .updateComment(comment)
            .then((rep) => {
              return res.status(200).json(rep).end();
            })
            .catch((err) => handleError(err, res, this.log));
        }
      })
      .catch((err) => handleError(err, res, this.log));
  }
}
