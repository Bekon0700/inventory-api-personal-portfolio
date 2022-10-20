const Product = require("../models/productModel")

const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')
const APIFeature = require("../utils/apiFeatures")

exports.createNewProduct = catchAsync(async (req, res, next) => {
    const { productName, description, price, discountPercentage, rating,
        stock, brand, category, thumbnail, images } = req.body

    const createNew = await Product.create(
        {
            productName, description, price, discountPercentage, rating,
            stock, brand, category, thumbnail, images
        }
    )
    res.json({
        status: 'success',
        product: createNew
    })
})

exports.topDeals = catchAsync(async (req, res, next) => {
    // limit=10&rating[gte]=4.7&sort=price,-rating
    req.query.limit = 10;
    req.query.rating = { gte: 4.7 };
    req.query.sort = 'price,-rating';
    next()
})

exports.getAllProducts = catchAsync(async (req, res, next) => {
    const query = Product.find()
    const features = new APIFeature(query, req.query).filter().sort().fieldLimit().pagination()
    const products = await features.query
    res.json({
        status: 'success',
        length: products.length,
        products
    })
})
exports.getSpecificProduct = catchAsync(async (req, res, next) => {
    const id = req.params.id
    const product = await Product.findById(id)

    if (!product) {
        return next(new AppError('Not a valid item to show', 404))
    }
    res.json({
        status: 'success',
        product
    })
})

exports.updateProduct = catchAsync(async (req, res, next) => {
    const id = req.params.id

    const product = await Product.findByIdAndUpdate(id, req.body)

    if (!product) {
        return next(new AppError('Not a valid item to update', 404))
    }

    res.json({
        status: 'update success',
    })
})

exports.deleteProduct = catchAsync(async (req, res, next) => {
    const id = req.params.id

    const product = await Product.findByIdAndDelete(id)

    if (!product) {
        return next(new AppError('Not a valid item to delete', 404))
    }

    res.json({
        status: 'delete success',
    })
})

exports.productCategory = catchAsync(async (req, res, next) => {
    const categories = await Product.aggregate([
        {
            $group: {
                _id: '$category',
                // count: {$count : {}},
                totalSum: { $sum: 1 },
                brands: {
                    $push: '$brand'
                }
            },
        },
        {
            $addFields: {
                "category": '$_id'
            }
        }
    ])


    res.json({
        status: 'category success',
        length: categories.length,
        categories
    })
})

exports.allProductInCategory = catchAsync(async (req, res, next) => {
    const category = req.params;
    const products = await Product.find(category)

    res.json({
        status: 'category success',
        length: products.length,
        products
    })
})

exports.allProductInBrand = catchAsync(async (req, res, next) => {
    const brand = req.params;
    const products = await Product.find(brand)

    res.json({
        status: 'category success',
        length: products.length,
        products
    })
})

exports.searchProduct = catchAsync(async (req, res, next) => {
    const { item } = req.query
    const reg = new RegExp(`${item}`)
    const products = await Product.find({
        $or: [
            {
                description: {
                    $regex: reg,
                    $options: 'i'
                },
            },
            {
                productName: {
                    $regex: reg,
                    $options: 'i'
                },
            },
            {
                category: {
                    $regex: reg,
                    $options: 'i'
                },
            },
            {
                brand: {
                    $regex: reg,
                    $options: 'i'
                },
            },

        ]
    })
    res.json({
        status: 'search success',
        length: products.length,
        products
    })
})