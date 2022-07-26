import { Controller, handleError, Log, queryParam } from "express-ext";
import { Request, Response } from "express";
import { CompanyCategory, CompanyCategoryFilter, CompanyCategoryService } from "./company-category";

export class CompanyCategoryController extends Controller<CompanyCategory, string, CompanyCategoryFilter> {
  constructor(log: Log, companyCategoryService: CompanyCategoryService) {
    super(log, companyCategoryService);
  }
}
