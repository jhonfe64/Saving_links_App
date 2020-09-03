const express = require('express');
const router = express.Router();
const db_connection = require('../database');

//Aqui creamos las rutas para crear los links y guardarlos

router.get('/add', (req, res)=>{
    res.render('links/add');
});

//recibe los datos del form que se llamo en la ruta anterior
router.post('/add', (req, res)=>{
    res.send("datos enviados");
});






module.exports = router;