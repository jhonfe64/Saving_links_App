const express = require('express');
const router = express.Router();
const sequelize = require('../database');
//requerimos el archivo lib desde donde se vana a manejar las librerias
const lib =  require('../lib/lib');
const { route } = require('./autentication');
//de ese archivo necesitamos la librería time ago
const timeago = lib.timeago;


//Aqui creamos las rutas para crear los links y guardarlos

//==> la ruta muestra el form para agragar un link
router.get('/add', (req, res)=>{
    res.render('links/add');
});


//==> La ruta permite enviar los datos del nuevo link registrado a la base de datos
//recibe los datos del form que se llamo en la ruta anterior
router.post('/add', (req, res)=>{
    const {title, url, description} = req.body;
    sequelize.query(`INSERT INTO links (title, url, description) VALUES (?,?,?)`,{
        replacements: [title, url, description]
    });
    //una vez los envie redireccione get /links la de abajo que trae todos los links
    res.redirect('/links');
});


//==> la ruta permite ver todos los links guardados del usuario
//Todas las rutas tienen el prefijo links quiero que la rutas /links me muestre cada uno de los links que ha creado ese usuario 
router.get('/', (req, res)=>{
    sequelize.query('SELECT * FROM links', {
        type: sequelize.QueryTypes.SELECT
    }).then((links)=>{
        //envaimos time ago que se saco arriba para usarlo en la vista links
        res.render('links/list', {links: links, timeago: timeago});
    });
});


//===> la ruta permite eliminar el link cuando se le de clik al boton eliminar por id de la vista links list.ejs
router.get('/delete/:id', async (req, res)=>{
    const id = req.params.id;
    await sequelize.query('DELETE FROM links WHERE id = ?', {
        replacements: [id]
    }).then((deleted_item)=>{
        if(deleted_item){
            res.redirect('/links')
        }
    })
});


router.get('/edit/:id', async (req, res)=>{
    const id = req.id;
    res.render('links/edit');
});



module.exports = router;