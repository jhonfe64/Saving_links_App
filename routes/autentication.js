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
    res.render('profile');
});



//=============================================================================================================================
    //iniciando sesion
//=============================================================================================================================


//===> la ruta get signin muestra el formulario de inicio de sesión
router.get('/signin', (req, res)=>{
    res.render('auth/signin')
});


//===> la ruta post muestra el redireccionamiento
router.post('/signin', (req, res, next)=>{
    //usamos el metodo metodo authenticate de passport que recibe local.signin de passport.js
    passport.authenticate('local.signin', {
        successRedirect: '/profile',
        failureRedirect: '/signin',
        failureFlash: true
    })(req, res, next);
});











module.exports = router;