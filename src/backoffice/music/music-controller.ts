import { Controller, Log } from "express-ext";
import { Music, MusicFilter, MusicService } from "./music";

export class BackOfficeMusicController extends Controller<Music, string, MusicFilter> {
  constructor(log: Log, private musicService: MusicService) {
    super(log, musicService);
  }
}
