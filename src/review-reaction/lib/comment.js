"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateInfoModel = {
  id: {
    key: true
  },
  rate: {
    type: 'number',
  },
  count: {
    type: 'integer',
  },
  score: {
    type: 'number',
  }
};
exports.ratesModel = {
  id: {
    key: true,
    match: 'equal'
  },
  author: {
    key: true,
    match: 'equal'
  },
  rate: {
    type: 'number'
  },
  rates: {
    required: true,
    type: 'integers'
  },
  time: {
    type: 'datetime'
  },
  review: {},
};
