const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const productRouter = require('./routes/productRoute')
const authRouter = require('./routes/authRoute')

const app = express()

app.use(cors())

app.use(express.json({ limit: '10kb' }))
app.use(morgan('dev'))


app.use('/api/v1/products', productRouter);
app.use('/api/v1/users', authRouter);


module.exports = app