const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ingredientSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        lowercase: true // later can add actual case insensitivity
    },
    expiration: {
        type: Number,
        optional: true
    },
}, {
    timestamps: true,
});

const Ingredient = mongoose.model('Ingredient', ingredientSchema);

module.exports = Ingredient;