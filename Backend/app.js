const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');
const connectToDb = require('./db/db');
const userRoutes = require('./Routes/user.routes');
const captainRoutes = require('./routes/captain.routes');



connectToDb();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use('/api/captains', captainRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.use('/api/users', userRoutes);

module.exports = app;