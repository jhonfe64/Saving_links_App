const express = require('express');
const morgan = require('morgan');
const ejs = require('ejs');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
//requerimos passport
const passport = require('passport');
const MySQLStore = require('express-mysql-session');
const bodyParser = require('body-parser');
//del archivo ./keys llamamos el objeto database 
const {database} = require('./keys');

//==>Inicializaciones

const app = express();
//requerimos el modulo entero de passport para traer la autenticación
require('./lib/passport');
//inicializando el motor de ejs
app.set("view engine", "ejs");
//obteniendo la ruta del a carpeta views
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.json());

//=================> Configuraciones del servidor

app.set('port', process.env.PORT || 4000);



//=================> Middlewares


app.use(morgan('dev'));
//es como body parser solo para texto o para json no anidados
app.use(express.urlencoded({extended: false}));
//La sesión se configura como un objeto
//como quiero guardar la sesion en la base de datos, no en el servidor requiero el otro modulo arriba MySQLStore
app.use(session({
    secret: 'faztmysqlnodemysql',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
  }));

//Use connect-flash para todas las rutas para mostrar mensajes cuando se cree borre o elimine algun link
app.use(flash()); 

//use body parser para todas las rutas
app.use(express.json());
//inicializamos passport
app.use(passport.initialize());
//le decios a pasport que guarde los datos en una sesion
app.use(passport.session());



//=================> Variables globales

app.use((req, res, next) => {
    app.locals.message = req.flash('message');
    app.locals.success = req.flash('success');
    app.locals.user = req.user;
    console.log(app.locals.user);
    next();
  });



//=================> Rutas
//app.use(require('./routes/index'));
app.use(require('./routes/autentication'));
app.use('/links', require('./routes/links'));
//=================>Public
app.use(express.static(path.join(__dirname, 'public')));



//=================> Comenzando el servidor
app.listen(app.get('port'), function(){
    console.log('server running on port', app.get('port'));
});







