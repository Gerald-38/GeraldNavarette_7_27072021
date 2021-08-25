<template>
    <div class="UserProfile">
        <div class="profile-info">
            <h1>Bonjour,</h1>
            <p>{{ user.firstName }} {{ user.lastName }}</p>
            <p>{{ user.dateCreation }}</p>
            <p>{{ user.pseudo }}</p>
            <p>{{ user.email }}</p>
            <p> {{ user.bio }} </p>            
        </div>
        <div class="delete-profile" @click="deleteUser()">Supprimer le compte</div>

        <!-- <h3>Vos posts :</h3> -->
    </div>
</template>

<script>
import axios from 'axios';
export default {
    name: 'UserProfile',
    data(){
      return {
          visible: false,
          user: []
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
      })
      
    },
    deleteUser(){
      const userId = this.$user.userID;
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
  }
}
</script>

<style scoped>
    .profile-info{
        margin: 50px auto;
        max-width: 800px;
        /* text-align: left; */
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
    .delete-profile{
      color: red;
      margin-bottom: 30px;
      font-size: 24px;
      cursor: pointer;
    }
</style>