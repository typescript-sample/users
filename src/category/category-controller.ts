import { Controller, handleError, Log, queryParam } from "express-ext";
import { Request, Response } from "express";
import { Category, CategoryFilter, CategoryService } from "./category";

export class CategoryController extends Controller<
  Category,
  string,
  CategoryFilter
> {
  constructor(log: Log, private categoryService: CategoryService) {
    super(log, categoryService);
    this.array = ["status"];
  }
}
