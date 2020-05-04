const express = require("express");
const path = require('path');
const bodyParser = require("body-parser");

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const helmet = require('helmet');
const compression = require('compression');
const exphbs = require('express-handlebars');
const Handlebars = require('handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');

const app = express();
const db = require("./models");
db.sequelize.sync();
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
// });


const hbs = exphbs.create({
  defaultLayout: "main",
  extname: 'hbs',
  handlebars: allowInsecurePrototypeAccess(Handlebars),
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views','views' );

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'Musician API',
      description: 'API for creating and managing relationships between artists and genres of music',
      contact: {
        name: 'Viktor Shchekotikhin'
      },
      servers: ['http://localhost:3000', 'https://protected-tundra-62545.herokuapp.com/']
    }
  },
  apis: [
      './controllers/*js'
  ]
};

const swaggerrDocs = swaggerJsDoc(swaggerOptions);

app.use(helmet());
app.use(compression());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerrDocs));
// app.use(function (req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS,PATCH');
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
//   next();
// });


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '/public')));
app.use('/', require('./controllers/home.controller'));
app.use('/users', require('./controllers/user.controller'));
app.use('/groups', require('./controllers/group.controller'));
app.use('/assigns', require('./controllers/assign.controller'));

// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
