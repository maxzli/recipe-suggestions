const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }
);
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})

// just added
if (process.env.NODE_ENV === 'production') {
	app.use(express.static('../build'));
}
app.get('*', (request, response) => {
	response.sendFile(path.join(__dirname, '../build', 'index.html'));
});

const ingredientsRouter = require('./routes/ingredients');
const recipesRouter = require('./routes/recipes');
const foodsRouter = require('./routes/foods')

app.use('/ingredients', ingredientsRouter);
app.use('/recipes', recipesRouter);
app.use('/foods', foodsRouter);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});