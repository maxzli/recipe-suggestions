const router = require('express').Router();
let Food = require('../models/food.model');

router.route('/').get((req, res) => {
    Food.find()
        .then(food => res.json(food))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
    const name = req.body.name;
    const quantity = Number(req.body.quantity);
    const date = Date.parse(req.body.date);
    const expirationdate = Date.parse(req.body.expirationdate);


    const newFood = new Food({
        name,
        quantity,
        date,
        expirationdate
    });

    newFood.save()
        .then(() => res.json('Food added!'))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
    Food.findById(req.params.id)
        .then(food => res.json(food))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
    Food.findByIdAndDelete(req.params.id)
        .then(() => res.json('Food deleted.'))
        .catch(err => res.status(400).json('Error: ' + err));
});

// possibly refactor update later to accept just one parameter
router.route('/update/:id').post((req, res) => {
    Food.findById(req.params.id)
        .then(food => { // food we just got from database
            food.name = req.body.name;
            food.quantity = Number(req.body.quantity);
            food.date = Date.parse(req.body.date);
            food.expirationdate = Date.parse(req.body.expirationdate);
        
            food.save()
                .then(() => res.json('Exercise updated!'))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;