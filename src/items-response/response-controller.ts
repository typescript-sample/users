import { Request as Req, Response as Res } from 'express';
import { getStatusCode, handleError, Log } from 'express-ext';
import { Validator } from 'onecore';
import { Response, ResponseService } from './response';

export class ResponseController {
  constructor(
    protected log: Log,
    protected responseService: ResponseService,
    public validator: Validator<Response>
  ) {
    this.reply = this.reply.bind(this);
  }

  reply(req: Req, res: Res) {
    const id: string = req.params.id || req.body.id || "";
    const author: string = req.params.author || req.body.author || "";
    const response: Response = { id, author, ...req.body };
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
}
