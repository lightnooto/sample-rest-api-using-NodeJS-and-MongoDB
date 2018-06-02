const express = require('express'),
    bodyParser = require('body-parser'),
    dbConfig = require('./config/database.config.js'),
    mongoose = require('mongoose'),
    session = require('express-session'),
    path = require('path'),
    app = express();

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, X-Access-Token, X-Key");
    next();
});
app.use(session({
    secret: 'rest API',
    resave: true,
    saveUninitialized: false
}));
app.use(bodyParser.urlencoded({ 
    extended: true
}))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'app')))

app.listen(3000, () => {
    console.log('listening on 3000')
})

mongoose.Promise = global.Promise
mongoose.connect(dbConfig.url).then(() => {
    console.log('success connected to database')
}).catch(err => {
    console.log('couldnt connect to database')
    process.exit()
})

app.get('/', (req, res) => {
    res.json({
        "message": "welcome to my rest api"
    })
})

require('./app/routes/user.routes.js')(app)
require('./app/routes/role.routes.js')(app)
require('./app/routes/book.routes.js')(app)
require('./app/routes/label.routes.js')(app)