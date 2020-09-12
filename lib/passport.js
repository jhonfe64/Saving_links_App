//1.se debe requerir el modulo passport
//2. requerimos el modulo passport-local y la funcion Strategy
//3. Strategy es la forma de autenticar, si es con redes sociales puede ser diferente

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const sequelize = require('../database');
//del archivo bcrypt traiga la funcion encriptedPassword
const {encripting_password} = require('./bcrypt');





//Vamos a decirle a passport que utilice .use, le colocamos el nombre al metodo de autenticacion local-signup (puede ser cualquiera)
//new localStrategy recibe dos parametros un objeto 
  //el objeto recibe los datos del usuario, email y password son los name del form
//La function es para decirle que vamos a hacer con esos datos  
  //

  passport.use('local.signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
    //este strategy recibe solo el email y el password, si yo quiero registar el usuario con otro datos com el fullname en este caso le debo colocar passReqToCallback: true, Esto quere decir que voy a recibir mas datos a traves del request.body en la funcion callback

    //el callback recibe el objeto req, el username del form y el password del password, y el callback donde que permite seguir (despues de hacer el registro) que se llama done
},(req, username, password, done) =>{
   const {fullname} = req.body;
   const encripted_password = encripting_password(password);
   sequelize.query('INSERT INTO users VALUES (?, ?, ?, ?)', {
      replacements: ['NULL', username, encripted_password, fullname]
    }).then((new_user)=>{
      req.body.id = new_user[0];
      var new_user = req.body;
      return done(null, new_user);
    });
}));

passport.serializeUser((user, done)=>{
  done(null, user.id);
});

passport.deserializeUser((id, done)=>{
  sequelize.query('SELECT * FROM users where id = ?', {
    replacements: [id]
  }).then((res)=>{
    done(null, res[0]);
  })
});






//OJO hay que llamar esto en el index.js

//1. se llama pasport en el index, pero no para hacer autenticaciones, eso se hace en este archivo, si no para ejecutar su código principal, ojo despues vamos a la seccion de middlewares