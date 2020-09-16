//Si el usuario ya inico sesión:

function isLoggedIn(req,  res, next){
    if(req.isAuthenticated()){
        return next();
    }else{
        return res.redirect('/signin');
    }
}

//que rutas queremos evitar si el usuario ya esta logueado
function isnotLoggedIn(req, res, next){
    if(!req.isAuthenticated()){
        return next();
    }else{
        //si está logueado y quiere visitar cierta ruta como la de iniciar sesion lo enviara al profile
        return res.redirect('/profile');
    }
}


module.exports = {isLoggedIn, isnotLoggedIn}