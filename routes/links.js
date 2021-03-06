const express = require('express');
const router = express.Router();
const sequelize = require('../database');
//requerimos el archivo lib desde donde se vana a manejar las librerias
const lib = require('../lib/lib');
//de ese archivo necesitamos la librería time ago
const timeago = lib.timeago;
const {isLoggedIn} = require('../lib/logout');







//Aqui creamos las rutas para crear los links y guardarlos

//==> la ruta muestra el form para agragar un link
router.get('/add', isLoggedIn, (req, res)=>{
    res.render('links/add');
});


//==> La ruta permite enviar los datos del nuevo link registrado a la base de datos
//recibe los datos del form que se llamo en la ruta anterior
router.post('/add', isLoggedIn, async (req, res)=>{
    const {title, url, description} = req.body;
    //ojo este user_id se obtiene cuando s e inicia sesion, por eso antes esta que insertara la infos in el user_id
    //antes de modificarlo y dejarlo asi hay que hacer el proceso de registro y loggin
    const user_id = req.app.locals.user[0].id;
    await sequelize.query(`INSERT INTO links (id, title, url, description, user_id, created_at) VALUES (?,?,?,?,?,?)`,{
        replacements: [null, title, url, description, user_id, null]
    }).then((addedLink)=>{
        if(addedLink){
            //una vez los envie redireccione get /links la de abajo que trae todos los links
            req.flash('success', 'Link Saved Successfully');
            res.redirect('/links');
        }
    })
   
});


//==> la ruta permite ver todos los links guardados del usuario
//Todas las rutas tienen el prefijo links quiero que la rutas /links me muestre cada uno de los links que ha creado ese usuario 
router.get('/', isLoggedIn, (req, res)=>{
    sequelize.query('SELECT * FROM links WHERE user_id = ?', {
        type: sequelize.QueryTypes.SELECT,
        replacements: [req.app.locals.user[0].id]
    }).then((links)=>{
        //envaimos time ago que se saco arriba para usarlo en la vista links
        res.render('links/list', {links: links, timeago: timeago});
    });
});


//===> la ruta permite eliminar el link cuando se le de clik al boton eliminar por id de la vista links list.ejs
router.get('/delete/:id', isLoggedIn, async (req, res)=>{
    const id = req.params.id;
    await sequelize.query('DELETE FROM links WHERE id = ?', {
        replacements: [id]
    }).then((deleted_item)=>{
        if(deleted_item){
            req.flash('success', 'link deleted successfully');
            res.redirect('/links')
        }
    })
});

//==> La ruta permite cuando se le de click al botón editar el link al que se le dio click, se mostrará el form que está en links/edit
router.get('/edit/:id', isLoggedIn, async (req, res)=>{
    const id = req.params.id;
    await sequelize.query('SELECT * FROM links WHERE id = ?', {
        type: sequelize.QueryTypes.SELECT,
        replacements: [id]
    }).then((link)=>{
        res.render('links/edit', {link: link[0]});
    });
});


//==> La ruta permite enviar a la base de datos el elemento que se va a editar
router.post('/edit/:id', isLoggedIn, (req, res)=>{
    const id = req.params.id;
    const {title, url, description} = req.body
    sequelize.query('UPDATE links SET title = ?, url = ?, description = ?  WHERE id = ?', {
        replacements: [title, url, description, id]
    }).then((updated_link)=>{
        if(updated_link){
            req.flash('success', 'link updated successfully');
            //Una vez haya echo la inserción redirecciones a la pagina donde estan todos los links
            res.redirect('/links');
        }
    });

});


module.exports = router;