import { Request, Response } from 'express';
import { handleError } from 'express-ext';

export type Log = (msg: string) => void;
export interface FollowService {
    follow(id: string, target: string): Promise<number>;
    unfollow(id: string, target: string): Promise<number>;
}
export class FollowController {
    constructor(public log: Log, public service: FollowService, public target: string, id: string) {
        this.id = (id && id.length > 0 ? id : 'id');
        this.follow = this.follow.bind(this);
        this.unfollow = this.unfollow.bind(this);
    }
    id: string;
    follow(req: Request, res: Response): void {
        // const id = req.params[this.id];
        const id = req.params.id;
        const target = req.params.target;
        console.log(req.params)
        if (!id || id.length === 0) {
            res.status(400).end(`'${this.id}' cannot be empty`);
            return;
        }
        if (!target || target.length === 0) {
            res.status(400).end(`'${this.target}' cannot be empty`);
            return;
        }
        this.service.follow(id, target).then(count => {
            return res.status(200).json(count).end();
          }).catch(err => handleError(err, res, this.log));
    }
    unfollow(req: Request, res: Response): void {
        const id = req.params.id;
        const target = req.params.target;
        if (!id || id.length === 0) {
            res.status(400).end(`'${this.id}' cannot be empty`);
            return;
        }
        if (!target || target.length === 0) {
            res.status(400).end(`'${this.target}' cannot be empty`);
            return;
        }
        this.service.unfollow(id, target).then(count => {
            return res.status(200).json(count).end();
          }).catch(err => handleError(err, res, this.log));
    }
}
