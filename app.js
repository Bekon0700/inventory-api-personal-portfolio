const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const dotenv = require('dotenv')

dotenv.config({
    path: './config.env'
})

const stripe = require("stripe")(process.env.STRIPE_SECRET);


const productRouter = require('./routes/productRoute')
const authRouter = require('./routes/authRoute')

const app = express()

app.use(cors())

app.use(express.json({ limit: '10kb' }))
app.use(morgan('dev'))

app.get('/', (req, res) => {
    res.status(200).send('API IS RUNNING....')
})


app.post('/create-payment-intent', async (req, res) => {
    const totalBill = req.body.totalBill * 100
    const paymentIntent = await stripe.paymentIntents.create({
        amount: parseInt(totalBill),
        currency: "usd",
        payment_method_types: [
            'card'
        ]
    });

    res.status(200).json({
        status: 'success',
        client_secret: paymentIntent.client_secret
    })
})

app.use('/api/v1/products', productRouter);
app.use('/api/v1/users', authRouter);


module.exports = app