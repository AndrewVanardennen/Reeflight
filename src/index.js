'use strict';

import express from 'express';
import opn from 'opn';

const app = express();
const port = process.env.port || 3005;
app.use(express.static(`${__dirname}/public/`));

app.listen(port); //listen to port 3000

opn(`http://localhost:${port}`); //open browser
