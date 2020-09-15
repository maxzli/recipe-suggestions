const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');


require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000


const buildPath = path.join(__dirname, '../build');
console.log(buildPath)
app.use(express.static(buildPath));
app.use(cors());


app.use(cors());
app.use(express.json());

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

app.use('/api/ingredients', ingredientsRouter);
app.use('/api/recipes', recipesRouter);
app.use('/api/foods', foodsRouter);

app.get('*', (request, response) => {
	response.sendFile(path.join(__dirname, '../build', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});