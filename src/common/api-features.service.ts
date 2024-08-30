import mongoose, { Query, Types } from 'mongoose';

class APIFeatures<T> {
  public query: Query<T[], T>;
  private queryObj: Record<string, string>;
  public q: Record<string, any>;

  constructor(query: Query<T[], T>, queryObj: Record<string, string>) {
    this.query = query;
    this.queryObj = queryObj;
  }

  filter() {
    const queryObj = { ...this.queryObj };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];

    excludedFields.forEach(el => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);

    queryStr = queryStr.replace(
      /\b(gte|gt|lte|lt|regex|options)\b/g,
      match => `$${match}`,
    );

    queryStr = queryStr.replace(/__/g, '.');

    const newQueryObj: Record<string, any> = JSON.parse(queryStr);

    this.convertMongoIds(newQueryObj);
    this.handleArrayFilters(newQueryObj, 'in', '$all');
    this.handleArrayFilters(newQueryObj, 'oneOf', '$in');
    this.applyTextSearch(newQueryObj);

    this.q = newQueryObj;
    this.query = this.query.find(newQueryObj);

    return this;
  }

  sort() {
    if (this.queryObj.sort) {
      const sortBy = this.queryObj.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limitFields() {
    if (this.queryObj.fields) {
      const fields = this.queryObj.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    const page = Math.max(1, Number(this.queryObj.page) || 1);
    const limit = Math.max(1, Number(this.queryObj.limit) || 10);
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }

  private convertMongoIds(queryObj: Record<string, any>) {
    for (const key in queryObj) {
      if (Types.ObjectId.isValid(queryObj[key])) {
        queryObj[key] = new mongoose.Schema.Types.ObjectId(queryObj[key]);
      }
    }
  }

  private handleArrayFilters(
    queryObj: Record<string, any>,
    filterKey: string,
    mongoOperator: '$in' | '$all',
  ) {
    if (queryObj[filterKey]) {
      Object.keys(queryObj[filterKey]).forEach(key => {
        queryObj[key] = {
          [mongoOperator]: queryObj[filterKey][key]
            .split(',')
            .map((el: string) => new RegExp(el.trim(), 'gi')),
        };
      });

      delete queryObj[filterKey];
    }
  }

  private applyTextSearch(queryObj: Record<string, any>) {
    if (queryObj.q) {
      queryObj['$text'] = { $search: queryObj.q };
      delete queryObj.q;
    }
  }
}

export default APIFeatures;
