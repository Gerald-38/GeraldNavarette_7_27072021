<template>
    <div class="wrapper">
        <img src="../assets/img/groupomania-logo.png" alt="logo Groupomania">
        <p>Bienvenue sur votre réseau social ! N'hésitez pas à partager et commenter. Connectez vous pour échanger ! :-)</p>
        <!-- <nav><router-link to="/" class="active">Se connecter</router-link> | <router-link to="/signup">S'inscrire</router-link></nav> -->
        <div class="form-frame">
            <form @submit.prevent = login()>
                <label for="login-email">Email :</label>
                <input id="login-email" type="text" placeholder="Email" required>
                
                <label for="login-password">Mot de passe :</label>
                <input id="login-password" type="password" placeholder="Mot de passe" required>

                <div class="error-message">{{message}}</div>

                <button id="login-btn" type="submit">Connexion</button>            
            </form>
            <p>vous n'avez pas encore de compte ?</p> <router-link to="/signup">Inscrivez vous ici</router-link>
        </div>      
    </div>
</template>

<script>
import axios from 'axios';
export default {
    name: 'LoginForm',
    data() {
        return {
            message: "",
        };
    },
    methods: {
        login(){
            const email = document.getElementById("login-email").value;
            const password = document.getElementById("login-password").value;
            axios.post(`${this.$apiUrl}/user/login`,
                {
                    email,
                    password
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )
            .then(res => {
                localStorage.setItem('user', JSON.stringify(res.data));
                location.reload();
            })
            .catch((error) => {
                if (error.response.status === 404) {
                    this.message = "Utilisateur inconnu.";
                }
                if (error.response.status === 401) {
                    this.message = "Email ou mot de passe invalide.";
                }
                if (error.response.status === 500) {
                    this.message = "Erreur serveur.";
                }
            });
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
    .form-frame {
        border-radius: 10px;
        padding : 20px;
        background-color: rgba(240, 84, 84, 0.75);     
    }
    form{
        display: flex;
        flex-direction: column;
    }
    form label{
        color: rgba(0, 0, 0, .5);
        margin: 10px;
    }
    form input{
        font-size: 1.05rem;
        padding: 10px;
        margin-bottom: 15px;
        text-align: center;
    }
    #login-btn{
        padding: 10px;
        font-size: 1.1rem;
        color: white;
        background-color: rgb(34, 40, 49);
        border: none;
        border-radius: 10px;
        transition-duration: 0.2s;
        cursor: pointer;
    }
    #login-btn:hover{
        transform: scale(1.025);
    }
    .error-message{
        background-color: rgba(255, 0, 0, 0.301);
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