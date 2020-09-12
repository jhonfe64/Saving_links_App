const express = require('express');
const morgan = require('morgan');
const ejs = require('ejs');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const MySQLStore = require('express-mysql-session');
//del archivo ./keys llamamos el objeto database 
const {database} = require('./keys');
//requerimos passport
const passport = require('passport');




//==>Inicializaciones

const app = express();
//requerimos el modulo entero de passport para traer la autenticación
require('./lib/passport');
//inicializando el motor de ejs
app.set("view engine", "ejs");
//obteniendo la ruta del a carpeta views
app.set('views', path.join(__dirname, 'views'));

//=================> Configuraciones del servidor

app.set('port', process.env.PORT || 4000);



//=================> Middlewares

//La sesión se configura como un objeto
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    //como quiero guardar la sesion en la base de datos, no en el servidor requiero el otro modulo arriba MySQLStore
    store: new MySQLStore(database)
}));
//Use connect-flash para todas las rutas para mostrar mensajes cuando se cree borre o elimine algun link
app.use(flash());
//app.use(morgan('dev'));
//es como body parser solo para texto o para json no anidados
app.use(express.urlencoded({extended: false}));
//use body parser para todas las rutas
app.use(express.json());
//inicializamos passport
app.use(passport.initialize());
//le decios a pasport que guarde los datos en una sesion
app.use(passport.session());


//=================> Variables globales

app.use((req, res, next)=>{   
    app.locals.success = req.flash('success');
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







