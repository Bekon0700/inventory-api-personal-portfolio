class APIFeature {
  constructor(query, queryObj) {
    this.query = query;
    this.queryObj = queryObj;
  }

  filter() {
    let advanceQuery = JSON.stringify(this.queryObj);
    advanceQuery = JSON.parse(
      advanceQuery.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`)
    );
    const queries = { ...advanceQuery };
    const excludedFields = ['page', 'sort', 'field', 'limit'];
    excludedFields.forEach((el) => delete queries[el]);

    this.query = this.query.find(queries);

    return this;
  }

  sort() {
    if (this.queryObj.sort) {
      const sortBy = this.queryObj.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      //query = query.sort('-price');
    }

    return this;
  }

  fieldLimit() {
    if (this.queryObj.fields) {
      const fields = this.queryObj.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  pagination() {
    let page = this.queryObj.page * 1 || 1;
    let limit = this.queryObj.limit * 1 || 15;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeature;
