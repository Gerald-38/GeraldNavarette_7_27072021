<template>
    <div class="UserProfile">
        <div class="profile-info">
            <h1>Mon profil</h1>
            <p class="profile-welcome">Bienvenue dans votre profil ! Vous avez la possibilité de modifier vos nom, prénom, email et mot de passe</p>
            <p class="profile-user">Identité : </p><p>{{ user.firstName }} {{ user.lastName }}</p>
            <p>{{ user.dateCreation }}</p>
            <!-- <p class="profile-user">Pseudo : </p><p>{{ user.pseudo }}</p>       -->
            <p class="profile-user">email : </p><p>{{ user.email }}</p>
            <!-- <p> {{ user.bio }} </p>             -->
        </div>
        <div class="wrapper" v-if="modify">
          <p>Modification du profil</p>
          <form @submit.prevent = modifyUser()>
            <label for="new-email">Email :</label>
            <input id="new-email" type="email" placeholder="Email" required :value=this.user.email>
            
            <label for="new-firstName">Prenom :</label>
            <input id="new-firstName" type="text" placeholder="Prenom" required :value=this.user.firstName>
            
            <label for="new-lastName">Nom :</label>
            <input id="new-lastName" type="text" placeholder="Nom" required :value=this.user.lastName>

            <label for="new-password">Mot de passe :</label>
            <input id="new-password" type="password" placeholder="Nouveau mot de passe (facultatif)">

            <label for="new-password-verification">Vérification du mot de passe :</label>
            <input id="new-password-verification" type="password" placeholder="Si nouveau, vérifier votre mot de passe">

            <!-- <label for="new-pseudo">Pseudo :</label>
            <input id="new-pseudo" type="text" placeholder="Pseudo" required :value=this.user.pseudo> -->

            <div class="error-message">{{message}}</div>

            <button class="new-btn" type="submit">Valider les modifications</button>
            <br>  
            <button class="new-btn" type="submit" @click="modify = flase" >Annuler les modifications</button>
          </form>
        </div>
        <!-- <div class="delete-profile" @click="deleteUser()">Supprimer le compte</div> -->
        <button class="new-btn-red" @click="deleteUser()">Supprimer le profil</button>  
        <br>
        <br>      
        <!-- <div class="modify-profile" v-if="!modify" @click="modify = true" >Modifier le compte</div> -->
        <button class="new-btn-red" v-if="!modify" @click="modify = true" >Modifier le profil</button>

        <!-- <h3>Vos posts :</h3> -->
    </div>
</template>

<script>
import axios from 'axios';
export default {
    name: 'UserProfile',
    data(){
      return {        
        modify: false,
        visible: false,
        user: [],
        email: "",
        firstName: "",
        lastName: "",
        password:"",
        newPassword: "",
        admin: "",
        pseudo: "",
        message: "",
      }
  },
  mounted() {
      if(localStorage.user != undefined){
          this.getUser();
      }
      //Export de la fonction
      this.$root.$on('user', () => {
          this.getUser();          
      });
  },
  methods: {
    getUser() {
      const userId = this.$user.userId;
      axios.get(`${this.$apiUrl}/user/${userId}/profile`,
        {
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.$token}`
            }
        }
      )
      .then(res => {
          this.user = res.data[0]; 
          console.log(res.data[0]);      
      })
      
      
    },
    deleteUser(){
      const userId = this.$user.userID;
      var r = confirm("Etes vous sur de vouloir supprimer ce compte ? Si vous cliquez sur OK ce compte sera définitivement supprimé");
      if (r == true) {
              axios.delete(`${this.$apiUrl}/user/${userId}/delete`,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.$token}`
            }
          }
      )
      .then(localStorage.removeItem('user'))
      .then(location.href = "/");
        
      } 
    },

    modifyUser() {
      const userId = this.$user.userID;
      const email = document.getElementById('new-email').value;
      const firstName = document.getElementById('new-firstName').value;
      const lastName = document.getElementById('new-lastName').value;
      // const pseudo = document.getElementById('new-pseudo').value;         
      const newPassword = document.getElementById("new-password").value;
      const newPasswordVerif = document.getElementById("new-password-verification").value;

      var passwordSchema = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

        if (newPassword === "") {
          var userData = {
            userId,
            email,
            firstName,
            lastName,
            // pseudo    
          }
          axios.put(`${this.$apiUrl}/user/${userId}/modify`, 
          userData,
            {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.$token}`
              }
            }
          )
          location.reload();   
        } else {
          if( newPassword != newPasswordVerif || !(newPassword.match(passwordSchema))){
          this.message = "Vérifier le mot de passe : il doit contenir entre 6 et 20 caracteres, une lettre minuscule et un chiffre, et doit être identique dans les deux champs de saisie";
          } else {
            userData = {
              userId,
              email,
              newPassword,
              firstName,
              lastName,
              // pseudo    
            }
            axios.put(`${this.$apiUrl}/user/${userId}/modify`, 
              userData,
                {
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.$token}`
                  }
                }
              )
              location.reload();   
          }
        }            
      }
    }
  }
</script>

<style scoped>
    .profile-welcome {
      color: red;
    }
    .profile-info{
        margin: 50px auto;
        max-width: 800px;
        padding: 20px 20px 20px 30px;
        background-color: rgba(228,230,235,0.6);
        border-radius: 10px;
        margin-top: 20px;
        box-shadow: 0px 0px 50px -7px rgba(0,0,0,0.1);
        text-align: left;
    }
    .profile-info h2 {
        margin-bottom: 20px;
        font-size: 3rem;
    }
    .profile-info h3 {
        /* text-align: left; */
    }
    .profile-info span {
        font-size: 3rem;
    }
    .profile-user {
      font-weight: bold;
    }
    .delete-profile, .modify-profile{
      color: red;
      margin-bottom: 30px;
      font-size: 24px;
      cursor: pointer;
    }
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
        color: rgb(255, 2, 2);
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
    .new-btn{
        padding: 10px;
        font-size: 1.1rem;
        color: white;
        background-color: rgb(43, 42, 42);
        border: none;
        border-radius: 10px;
        transition-duration: 0.2s;
        cursor: pointer;
    }
    .new-btn-red{
      padding: 10px;
      font-size: 1.1rem;
      color: white;
      background-color: red;
      border: none;
      border-radius: 10px;
      transition-duration: 0.2s;
      cursor: pointer;
    }
    .new-btn:hover{
      transform: scale(1.025);
    }
    .new-btn-red:hover{
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

