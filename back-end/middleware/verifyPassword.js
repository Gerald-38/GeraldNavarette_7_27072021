// MIDDLEWARE POUR VALIDER LE MOT DE PASSE LORS DE L'INSCRIPTION

module.exports = (req, res, next) => {
    var passwordSchema = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    if(!(req.body.password.match(passwordSchema)))  {        
        res.writeHead(400, '{"message":"Mot de passe requis : 6 caractères minimun. Au moins 1 Majuscule, 1chiffre, 1 minuscule. Sans espaces"}', {
            'content-type': 'application/json'
        });
        res.end('Format de mot de passe incorrect');
    } else {
        next();
    }
};



