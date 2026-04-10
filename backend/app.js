require('dotenv').config();

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');

const api = process.env.API_URL;
const port = process.env.PORT || 3000;
const connectionString = process.env.CONNECTION_STRING;

// middleware
app.use(bodyParser.json());
app.use(morgan('tiny'));

mongoose.connect(connectionString)
.then(() => console.log('Database connection is ready'))
.catch(err => console.log(err));


app.listen(port, () => {
    console.log(`API URL is set to: ${api}`);
    console.log(`Server is running on port ${port}`);
});