const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema(
    {
        productName: {
            type: String,
            required: [true, 'A name is required'],
            unique: true,
            trim: true,
            maxlength: [60, 'name must be less than or equal 40'],
        },
        slug: String,
        description: {
            type: String,
            trim: true,
        },
        price: {
            type: Number,
            required: [true, 'Product must have a price']
        },
        discountPercentage: {
            type: Number,
            validate: function (value) {
                return value < 100 && value > 0
            },
            message: 'Discount percentage must be lesser than 100 and greater than 0'
        },
        rating: {
            type: Number,
            default: 4.5,
            validate: {
                validator: function (val) {
                    return val < 5 && val > 0;
                },
                message:
                    'rating average {VALUE} must be lesser than 5 and grater than 0',
            },
        },
        stock: {
            type: Number
        },
        brand: {
            type: String,
            required: [true, 'A Brand is required'],
        },
        category: {
            type: String,
            required: [true, 'A Category is required'],
        },
        thumbnail: {
            type: String,
            default: 'https://www.highsnobiety.com/static-assets/thumbor/DvJs-DPb1VwUMMWrbgKbKnc1eno=/1500x1000/whatdropsnow.s3.amazonaws.com/product_images/images/149599/9200b5fffe05781fc4709e4fa41eb9f7a3359254.jpg'
        },
        images: [String]
    }
)

productSchema.pre('save', function (next) {
    this.slug = slugify(this.productName, { lower: true });
    next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;