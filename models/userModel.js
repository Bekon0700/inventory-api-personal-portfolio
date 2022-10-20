const mongoose = require('mongoose');
const brcypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'officer'],
        default: 'officer'
    },
    active: {
        type: Boolean,
        default: false
    }
})

userSchema.pre('save', async function (next) {

    this.password = await brcypt.hash(this.password, 12);

    next();
});

userSchema.methods.checkPassword = async function (
    candidatePassword,
    userPassword
) {
    return await brcypt.compare(candidatePassword, userPassword);
};


const User = mongoose.model('User', userSchema);

module.exports = User;