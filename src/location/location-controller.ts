import { Request, Response } from 'express';
import { Controller, handleError, Log } from 'express-ext';
import { Validator } from 'onecore';
import { createValidator } from 'xvalidators';
import { Location, LocationFilter, LocationService } from './location';
import { Rate, rateModel } from "../rate";

export class LocationController extends Controller<Location, string, LocationFilter> {
  validator: Validator<Rate>;
  constructor(log: Log, public locationService: LocationService) {
    super(log, locationService);
    this.validator = createValidator<Rate>(rateModel);
  }
}
