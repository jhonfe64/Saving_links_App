const bcrypt = require('bcrypt');

//==> Encriptar la contraseña

function encripting_password(password){
    return bcrypt.hashSync(password, 10);
}


//==> Comparar passwords

function matchPasswords(password, db_password){
    return bcrypt.compareSync(password, db_password);
    
}


module.exports = {encripting_password, matchPasswords};