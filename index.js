const express = require('express');
require('dotenv').config();
const cors = require('cors');
const port = process.env.PORT || 3000;
const app = express();
app.use(cors());
app.use(express.json());



app.listen(port);