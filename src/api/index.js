'use strict';

import express from 'express';
import opn from 'opn';

const app = express();

app.get('/', (req, res) => { //get ajax request and response
  res.send(); //send to browser
  console.log(res);

});

app.listen(3000); //listen to port 3000

opn('http://localhost:3000'); //open browser
