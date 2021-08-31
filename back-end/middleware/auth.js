const jwt = require("jsonwebtoken"); // Crée et check un token d'identification sécurisé


module.exports = (req, res, next) => { 
    try { 
        const token = req.headers.authorization.split(" ")[1]; 
        const decodedToken = jwt.verify(token,"RANDOM_TOKEN_SECRET"); 
        res.locals.userID = decodedToken.userID; 
        next();
    } catch{ 
        res.status(401).json({message: 'Requête non authentifiée !'});
    }
};
