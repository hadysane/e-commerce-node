const Product = require('../models/productModel')

class APIFeatures {
    constructor(query, queryString) {
        this.query = query; // query = promise from mongoDB
        this.queryString = queryString; //req.query
    }

    // 1. Filter
    filter() {
        // 1) Copy query parameters 
        const queryObj = { ...this.queryString }

        // 2) List fields to exclude to the query prarameters
        const excludeFields = ['page', 'sort', 'limit', 'fields']

        // 3) Remove fields from the qur parameters
        excludeFields.forEach((field) => delete queryObj[field])


        // 1.2 Advanced filtering
        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

        this.query = Product.find(JSON.parse(queryStr))
        return this;
    }

    // 2. Sort
    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ')
            console.log(sortBy)
            this.query = this.query.sort(sortBy)
        } else {
            this.query = this.query.sort('-quantity')
        }

        return this;
    }

    // 3. Fields
    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ')
            this.query = this.query.select(fields)
        } else {
            this.query = this.query.select('-__v')
        }

        return this;
    }

    //4.Paginations
    paginate() {
        const page = Number(this.queryString.page) || 1;
        const limit = Number(this.queryString.limit) || 20;
        const skip = (page - 1) * limit;

        // page3&limit=10, 1-10(page 1), 11,20(page 2), 21,30(page 3)
        this.query = this.query.skip(skip).limit(limit);

        return this;

    }

}

module.exports = APIFeatures