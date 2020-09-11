const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const foodSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        lowercase: true // later can add actual case insensitivity
    },
    quantity: {
        type: Number,
        optional: true
    },
    date: {
        type: Date,
    },
    expirationdate: {
        type: Date,
    }
}, {
    timestamps: true,
});

const Food = mongoose.model('Food', foodSchema);

module.exports = Food;