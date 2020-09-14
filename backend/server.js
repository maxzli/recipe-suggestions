const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000

var path = require('path');

app.use(cors());
app.use(express.json());
app.use('/static', express.static(path.join(__dirname, '../build')));
// app.get('/*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../build', 'index.html'));
// });

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }
);
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})

const ingredientsRouter = require('./routes/ingredients');
const recipesRouter = require('./routes/recipes');
const foodsRouter = require('./routes/foods')

app.use('/ingredients', ingredientsRouter);
app.use('/recipes', recipesRouter);
app.use('/foods', foodsRouter);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});