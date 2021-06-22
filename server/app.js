require("dotenv").config({ path:'./config.env'});
const express = require('express');
 require('./db/db')

const Port  = process.env.PORT || 8000

const app = express();
app.use(express.json());

app.use(require('./router/auth'))

const middleware = (req,res, next) => {
    console.log(`Hello my Middleware`);
    next();
}

app.listen(Port, () => {
    console.log(`Server started on port${Port}`);
});