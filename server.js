const express = require('express');
const router = require('./routers');
const app = express();
const PORT = 4000;

app.use(express.json());
app.use('/', router);

app.listen(PORT, () => {console.log(`App is listening on port ${PORT}`)})