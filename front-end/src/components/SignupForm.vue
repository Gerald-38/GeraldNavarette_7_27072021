<template>
    <div class="wrapper">
        <form @submit.prevent = signup()>
            <img src="../assets/img/groupomania-logo.png" alt="logo Groupomania">
            <p>L'inscription est très simple et se fait en quelques clics !</p>

            <label for="signup-email">Email :</label>
            <input id="signup-email"  type="email" placeholder="Email" required>
            
            <label for="signup-prenom">Prenom :</label>
            <input id="signup-prenom" type="text" placeholder="Prenom" required>
            
            <label for="signup-nom">Nom :</label>
            <input id="signup-nom" type="text" placeholder="Nom" required>

            <label for="signup-password">Mot de passe :</label>
            <input id="signup-password" type="password" placeholder="Mot de passe" required>

            <label for="signup-password-verification">Vérification du mot de passe :</label>
            <input id="signup-password-verification" type="password" placeholder="Vérifier mot de passe" required>   

            <div class="error-message">{{message}}</div>

            <button id="signup-btn" type="submit">S'inscrire</button>
            <br>
            <router-link to="/">Retour à l'accueil</router-link>
        </form>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    name: 'SignupForm',
    data() {
        return {
            message: "",
        };
    },
    methods: {
        signup(){
            const firstName = document.getElementById("signup-prenom").value;
            const lastName = document.getElementById("signup-nom").value;            
            const password = document.getElementById("signup-password").value;
            const passwordVerif = document.getElementById("signup-password-verification").value;
            const email = document.getElementById("signup-email").value;
            if( password != passwordVerif ){                
                this.message = "Vérifier le mot de passe : il doit être identique dans les deux champs de saisie";
            } else {
                axios.post(`${this.$apiUrl}/user/signup`,
                    {
                        email,
                        firstName,                        
                        lastName,
                        password, 
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                )
                .then(res => {
                    if(res.status === 201) {
                        alert('utilisateur créé ! Vous pouvez vous connecter !')
                        location.href = '/';
                    }
                })
                .catch((error) => {
                    if (error.response.status === 401) {
                        this.message = error.response.data.message;                                             
                    }  
                    if (error.response.status === 400) {
                        this.message = error.response.data.message;                                             
                    }  
                });
            }         
        }
    }
}
</script>

<style scoped>
    .wrapper{
        max-width: 500px;
        margin: 90px auto;
    }
    img{
        width: 100%;
    }
    nav{
        font-size: 1.05rem;
        margin: 20px;
    }
    .active{
        color: rgb(240, 84, 84);
        font-weight: bold;
    }
    form{
        display: flex;
        flex-direction: column;
    }
    form label{
        color: rgba(0, 0, 0, .5);
        margin: 10px;
    }
    .error-message{
        background-color: rgba(255, 0, 0, 0.301);
    }
    form input{
        font-size: 1.05rem;
        padding: 10px;
        margin-bottom: 15px;
        text-align: center;
    }
    #signup-btn{
        padding: 10px;
        font-size: 1.1rem;
        color: white;
        background-color: rgb(34, 40, 49);
        border: none;
        border-radius: 10px;
        transition-duration: 0.2s;
        cursor: pointer;
    }
    #signup-btn:hover{
        transform: scale(1.025);
    }
    label{
        font-size: 0.8rem;
        font-weight: bold;
        color: rgb(109, 109, 109);
        text-align: left;
        border: 0;
        clip: rect(0 0 0 0);
        height: 1px;
        margin: -1px;
        overflow: hidden;
        padding: 0;
        position: absolute;
        width: 1px;
    }
    
</style>