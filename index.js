const express = require('express');
const morgan = require('morgan');
const ejs = require('ejs');
const path = require('path');


//==>Inicializaciones

const app = express();

//==> Configuraciones del servidor

app.set('port', process.env.PORT || 4000);
//inicializando el motor de ejs
app.set("view engine", "ejs");
//obteniendo la ruta del a carpeta views
app.set('views', path.join(__dirname, 'views'));





//==>Middlewares
app.use(morgan('dev'));
//es como body parser solo para texto o para json no anidados
app.use(express.urlencoded({extended: false}));
//use body parser para todas las rutas
app.use(express.json());

//==>Variables globales

//==>Rutas
app.use(require('./routes/index'));
app.use(require('./routes/autentication'));
app.use('/links', require('./routes/links'));



//==>Public
app.use(express.static(path.join(__dirname, 'public')));



//==>Comenzando el servidor

app.listen(app.get('port'), function(){
    console.log('server running on port', app.get('port'));
});

console.log("hola");