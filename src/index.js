'use strict';

import express from 'express';
import opn from 'opn';

const app = express();
app.use(express.static(`${__dirname}/public/`));

app.listen(3000); //listen to port 3000

opn('http://localhost:3000'); //open browser
