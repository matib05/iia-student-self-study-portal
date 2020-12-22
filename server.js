const express = require('express');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const utils = require('./utils/utils');
dotenv.config();

const userRouter = require('./routes/user.router');
const assignmentRouter = require('./routes/assignment.router');

const app = express();
utils.connectToDatabase(process.env.DB_URI);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static( __dirname + '/frontend/dist/frontend'));

app.use('/api/user', userRouter);
app.use('/api/assignments', assignmentRouter);
const port  = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})

module.exports = app;
