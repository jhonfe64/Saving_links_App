//1.se debe requerir el modulo passport
//2. requerimos el modulo passport-local y la funcion Strategy
//3. Strategy es la forma de autenticar, si es con redes sociales puede ser diferente

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const sequelize = require('../database');
const bcrypt = require('./bcrypt');
//del archivo bcrypt traiga la funcion encriptedPassword
const {encripting_password} = require('./bcrypt');
const {matchPasswords} = require('./bcrypt');

// =================================================================================================================================
// REGISTRANDO NUEVOS USUARIOS
//==================================================================================================================================



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
}, async (req, username, password, done) =>{
   const {fullname} = req.body;
   const encripted_password = encripting_password(password);
   await sequelize.query('INSERT INTO users VALUES (?, ?, ?, ?)', {
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

passport.deserializeUser( async (id, done)=>{
  await sequelize.query('SELECT * FROM users where id = ?', {
    replacements: [id]
  }).then((res)=>{
    done(null, res[0]);
  })
});





// =================================================================================================================================
// INICIANDO SESION
//==================================================================================================================================


//new localStrategy recibe como parametro un objeto, y una funcion

passport.use('local.signin', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, async function (req, username, password, done){
    await sequelize.query('SELECT * FROM users WHERE username = ?', {
      type: sequelize.QueryTypes.SELECT,
      replacements: [username]
    }).then((user)=>{
        if(user){
          //comparando las contraseñas la que viene del form y la que veien de la bd
          const validPassword = matchPasswords(password, user[0].password);
          if(validPassword){
            //Esta variable user es la que se va a llamar en el index como variable global  app.locals.user = req.user;
            //y despues se mandará a la vista correspondiente
            done(null, user[0]);
          }else{
            done(null, false, req.flash('message', 'incorrect password'));
          }
        //Si no encontró nada  
        }
    }).catch((err)=>{
      if(err){
        done(null, false, req.flash('message', 'The user doesnt exist'));
      }
    })
}));








//OJO hay que llamar esto en el index.js

//1. se llama pasport en el index, pero no para hacer autenticaciones, eso se hace en este archivo, si no para ejecutar su código principal, ojo despues vamos a la seccion de middlewares