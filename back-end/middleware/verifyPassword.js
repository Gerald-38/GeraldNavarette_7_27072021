// MIDDLEWARE POUR VALIDER LE MOT DE PASSE LORS DE L'INSCRIPTION

const passwordValidator = require('password-validator');
 
const schema = new passwordValidator(); 

schema
.is().min(8)                                    // Minimum length 8
.is().max(100)                                  // Maximum length 100
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits(2)                                // Must have at least 2 digits
.has().not().spaces()                           // Should not have spaces
.is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values
 
module.exports = (req, res, next) => {    
    if(!schema.validate(req.body.password))  {
        res.status(400).json({
            message: 'Mot de passe requis : 8 caractères minimun, 100 caractères maximum. Au moins 1 majuscule, 2chiffre, 1 minuscule. Sans espaces'
        });   
        // res.end('Mot de passe requis : 8 caractères minimun, 100 caractères maximum. Au moins 1 majuscule, 2chiffre, 1 minuscule. Sans espaces');
    } else {
        next();
    }
};



