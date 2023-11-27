var express = require('express');
const cors = require('cors');
require('dotenv').config();
var app = express();
app.use(express.json());
app.use(cors());
let queries = require('./routes/queries');
let authenticate = require('./routes/authentication');
app.use('/queries',queries);
app.use('/authenticate',authenticate);
let PORT=process.env.PORT;


app.listen(PORT,()=>{
   console.log(`Listening on PORT:${PORT}`)
});