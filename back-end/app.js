const express = require('express');
const postRoutes = require('./routes/post');
const userRoutes = require("./routes/user");

const session = require('cookie-session');
const nocache = require('nocache');
const path = require('path');
"use strict"

// utilisation du module 'helmet' pour la sécurité en protégeant l'application de certaines vulnérabilités
const helmet = require('helmet');

const app = express();

// Middleware Header pour contourner les erreurs en débloquant certains systèmes de sécurité CORS, afin que tout le monde puisse faire des requetes depuis son navigateur
app.use((req, res, next) => {  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

//httpOnly - Garantit que le cookie n’est envoyé que sur HTTP(S), pas au JavaScript du client, ce qui renforce la protection contre les attaques de type cross-site scripting.
const expiryDate = new Date(Date.now() + 3600000); // 1 heure (60 * 60 * 1000)
app.use(session ({
  secret: "s3Cur3",
  cookie: {
    secure: true,
    httpOnly: true,
    domain: 'http://localhost:3000',
    expires: expiryDate
  }
})
);

// Sécuriser avec Helmet
app.use(helmet());

// Désactive la mise en cache du navigateur
app.use(nocache());

app.use(express.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use("/api/user", userRoutes);
app.use("/api/posts", postRoutes);

module.exports = app;