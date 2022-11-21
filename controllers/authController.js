const User = require("../models/userModel");
const jwt = require('jsonwebtoken');
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { promisify } = require('util');

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET);
};


const createToken = (user, statusCode, res) => {
    const token = signToken(user._id);

    const cookieOptions = {
        httpOnly: true,
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
    };

    if (process.env.NODE_ENV === 'production') cookieOptions['secure'] = true;

    res.cookie('jwt', token, cookieOptions);

    user.password = undefined;

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user,
        },
    });
};

exports.registration = catchAsync(async (req, res, next) => {
    const { name, password, role } = req.body;
    const createUser = await User.create({
        name,
        password,
        role
    })
    res.status(201).json({
        status: 'success',
        user: createUser
    });
})

exports.login = catchAsync(async (req, res, next) => {
    const { name, password } = req.body;

    // 1) check if name and password is exists
    if (!name || !password) {
        return next(new AppError('please provide name and password', 400));
    }

    const user = await User.findOne({ name }).select('+password');

    // 2) check if user exists and password match
    if (!user || !(await user.checkPassword(password, user.password))) {
        return next(new AppError('Invalid name or password', 401));
    }

    // if everything ok, send the data
    createToken(user, 201, res);
});


exports.protected = catchAsync(async (req, res, next) => {
    // 1) get the token and check if it's there
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new AppError('Please login', 401));
    }

    // 2) verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) check if user still exist
    const freshUser = await User.findById(decoded.id);
    if (!freshUser) {
        return next(
            new AppError('The token belong to the user does not exist', 400)
        );
    }
    if (!freshUser.active) {
        return next(new AppError('Your account is not active', 401))
    }

    req.user = freshUser;

    // console.log(req.user);
    //Grant access to the next middleware
    next();
});

exports.restrictedTo = (...roles) => {
    // roles is an array -> ['admin', 'super-admin']
    return (req, res, next) => {
        console.log(roles)
        console.log(req.user);
        if (!roles.includes(req.user.role)) {
            return next(
                new AppError('You do not have the permission to do this operation', 403)
            );
        }
        next();
    };
};


exports.changeActiveStatus = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const active = req.body

    const user = await User.findByIdAndUpdate(id, active)

    res.status(201).json({
        status: 'success',
        user
    });
})

exports.deleteAccount = catchAsync(async (req, res, next) => {
    const id = req.params.id;

    await User.findByIdAndDelete(id)

    res.status(201).json({
        status: 'delete success',
    });
})

exports.allAccount = catchAsync(async (req, res, next) => {
    const users = await User.find().select('-password -__v')

    res.status(201).json({
        status: 'success',
        users
    });
})