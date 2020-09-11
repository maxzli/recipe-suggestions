const router = require('express').Router();
let Ingredient = require('../models/ingredient.model');

router.route('/').get((req, res) => {
    Ingredient.find()
        .then(ingredient => res.json(ingredient))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
    if (!req.body.expiration){
        req.body.expiraton = null
    }
    const name = req.body.name;
    const expiration = Number(req.body.expiration);

    const newIngredient = new Ingredient({
        name,
        expiration,
    });

    newIngredient.save()
        .then(() => res.json('Ingredient added!'))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
    Ingredient.findById(req.params.id)
        .then(ingredient => res.json(ingredient))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
    Ingredient.findByIdAndDelete(req.params.id)
        .then(() => res.json('Ingredient deleted.'))
        .catch(err => res.status(400).json('Error: ' + err));
});

// possibly refactor update later to accept just one parameter
router.route('/update/:id').post((req, res) => {
    Ingredient.findById(req.params.id)
        .then(ingredient => { // Ingredient we just got from database
            ingredient.name = req.body.name;
            ingredient.expiration = Number(req.body.expiration);

            ingredient.save()
                .then(() => res.json('Exercise updated!'))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;