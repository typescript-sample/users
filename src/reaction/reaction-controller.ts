import { handleError, Log } from "express-ext";
import { Request, Response } from 'express';

export interface ReactService {
  react(id: string, author: string, reaction:string): Promise<number>;
  unreact(id: string, author: string, reaction:string): Promise<number>;
  checkReaction(id: string, author: string): Promise<number>;
  }
  // tslint:disable-next-line:max-classes-per-file
  export class UserReactionController {
    constructor(public log: Log, public service: ReactService, public author: string, id: string,public reaction:string) {
      this.id = (id && id.length > 0 ? id : 'id');
      this.react = this.react.bind(this);
      this.unreact = this.unreact.bind(this);
      this.checkReaction = this.checkReaction.bind(this);
    }
    id: string;
    react(req: Request, res: Response): void {
      const id = req.params.id;
      const author = req.params.author;
      const reaction = req.params.reaction;
      if (!id || id.length === 0) {
        res.status(400).end(`'${this.id}' cannot be empty`);
        return;
      }
      if (!author || author.length === 0) {
        res.status(400).end(`'${this.author}' cannot be empty`);
        return;
      }
      if (!reaction || reaction.length === 0) {
        res.status(400).end(`'${this.reaction}' cannot be empty`);
        return;
      }
      this.service.react(id,author,reaction).then(count => {
        return res.status(200).json(count).end();
      }).catch(err => handleError(err, res, this.log));
    }
    unreact(req: Request, res: Response): void {
      const id = req.params.id;
      const author = req.params.author;
      const reaction = req.params.reaction;
      if (!id || id.length === 0) {
        res.status(400).end(`'${this.id}' cannot be empty`);
        return;
      }
      if (!author || author.length === 0) {
        res.status(400).end(`'${this.author}' cannot be empty`);
        return;
      }
      if (!reaction || reaction.length === 0) {
        res.status(400).end(`'${this.reaction}' cannot be empty`);
        return;
      }
      this.service.unreact(id,author,reaction).then(count => {
        return res.status(200).json(count).end();
      }).catch(err => handleError(err, res, this.log));
    }
    checkReaction(req: Request, res: Response): void {
      const id = req.params.id;
      const author = req.params.author;
      if (!id || id.length === 0) {
        res.status(400).end(`'${this.id}' cannot be empty`);
        return;
      }
      if (!author || author.length === 0) {
        res.status(400).end(`'${this.author}' cannot be empty`);
        return;
      }
      this.service.checkReaction(id,author).then(count => {
        return res.status(200).json(count).end();
      }).catch(err => handleError(err, res, this.log));
    }
  }