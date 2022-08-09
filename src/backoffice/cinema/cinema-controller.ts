import { Request, Response } from "express";
import { Controller, handleError, Log } from "express-ext";
import { Cinema, CinemaFilter, CinemaService } from "./cinema";

export class BackOfficeCinemaController extends Controller<Cinema, string, CinemaFilter> {
  constructor(log: Log, private cinemaService: CinemaService) {
    super(log, cinemaService);
  }
}
