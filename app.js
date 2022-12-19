const express = require('express');
const cors = require('cors');
const app = express();
const helmet = require('helmet');
const path = require('path')

// Middlewares 
app.use(express.json());
app.use(cors());
// app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(cors(""))

// Routes 
const routes = require('./routes/index');
app.use('/api', routes);

// Base Route

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/client/build', 'index.html'));
});
// app.get('/', (req, res) => {
//     res.send('Hello 👋')
// });

// Serve Static Files 
app.use('/', express.static(path.join(__dirname, 'client/build')));
module.exports = app

// dotenv cors helmet 