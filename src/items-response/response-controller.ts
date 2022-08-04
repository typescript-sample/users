import { Request as Req, Response as Res } from "express";
import { getStatusCode, handleError, Log } from "express-ext";
import { Validator } from "onecore";
import { Response, ResponseFilter, ResponseService } from "./response";
import { Comment } from "rate-core";
import { ReactionController } from "reaction-express";
export class ResponseController extends ReactionController<
  Response,
  ResponseFilter,
  Comment
> {
  constructor(
    log: Log,
    protected responseService: ResponseService,
    public validator: Validator<Response>,
    commentValidator: Validator<Comment>,
    dates: string[],
    numbers: string[],
    generate: () => string,
    commentId?: string,
    userId?: string,
    author?: string,
    id?: string
  ) {
    super(
      log,
      responseService,
      commentValidator,
      dates,
      numbers,
      generate,
      commentId,
      userId,
      author,
      id
    );
    this.load = this.load.bind(this);
    this.response = this.response.bind(this);
    this.updateResponse = this.updateResponse.bind(this);
  }

  response(req: Req, res: Res) {
    const response: Response = req.body;
    response.time = new Date();
    this.validator
      .validate(response)
      .then((errors) => {
        if (errors && errors.length > 0) {
          res.status(getStatusCode(errors)).json(errors).send();
        } else {
          this.responseService
            .response(response)
            .then((rs) => {
              return res.status(200).json(rs).send();
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
          res.status(getStatusCode(errors)).json(errors).send();
        } else {
          this.responseService
            .updateResponse(response)
            .then((reply) => {
              return res.status(200).json(reply).send();
            })
            .catch((err) => handleError(err, res, this.log));
        }
      })
      .catch((err) => handleError(err, res, this.log));
  }
}
