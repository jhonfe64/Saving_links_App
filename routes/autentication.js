const express = require('express');
const router = express.Router();
const passport = require('passport');

//==> la ruta get signup solamente muestra el formulario de registro
router.get('/signup', (req, res)=>{
    res.render('auth/signup');
});

//==> la ruta la ruta post signup obtiene los datos del formulario y los envía a la base de datos
//==> recibe el metodo authenticate de passport que recibe local.signup de passport.js
router.post('/signup', passport.authenticate('local.signup', {
    //si el usuario se registra correctamente se redirije a la url /profile
    successRedirect: '/profile',
    //si el usuario no ha podido registrarse lo redirije al mismo form en la ruta signup
    failureRedirect: '/signup',
    //le decimos que vamso a permitir que muestre mensajes tipo flash
    failureFlash: true
}));


router.get('/profile', (req, res)=>{
    res.send("thi is your profile");
});







module.exports = router;