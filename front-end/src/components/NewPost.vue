<!-- COMPONENT CREATEPOST - Composants de la création d'un post -->

<template>
  <div class="post-wrapper">
    <form name="createPost">
      
      <!-- Textarea du post -->
      <input 
      type="text" 
      placeholder="entrez le titre" 
      id="newpost-title" 
      required>
      <br>
      <span id='missTitle'></span>
      <br>
      <textarea
        type = "text"
        name="message"
        class=""
        cols="130"
        rows="3"
        maxlength="180"
        required 
        placeholder="entrez le contenu"
        v-model="content"
        id="newpost-content"
      ></textarea>
      <br>
      <span id='missContent'></span>
      <!-- Fin -->

      <!-- Sélection du Gif -->
      <div id='main'>
        <input type="file" name="image" id="newpost-image" required> 
      </div>
      <span id='missImage'></span>
      <br>
 
      <!-- Bouton pour le publier -->
      <button
        class=""
        type="submit"
        v-on:click.prevent="addPost()"
      >Publier</button>
      <!-- Fin -->

    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "CreatePost",
  data: () => {
    return {
        // alt_text,
        title: "",
        content: "", 
        // gifUrl: null, 
        image: "",
    };
  },
  methods: {
    addPost(){

      // VALIDATION DE LA SAISIE
      
      const titleValid = document.getElementById('newpost-title').checkValidity();
      const contentValid = document.getElementById('newpost-content').checkValidity();
      const imageValid = document.getElementById('newpost-image').checkValidity();       
      const missTitle = document.getElementById('missTitle');
      const missContent = document.getElementById('missContent');
      const missImage = document.getElementById('missImage');

      if (!titleValid){
        missTitle.textContent = 'Titre manquant';
        missTitle.style.color = 'red' ;      
      } else{ 
        missTitle.textContent = " ";
      }

      if (!contentValid){
        missContent.textContent = 'Contenu manquant';
        missContent.style.color = 'red' ;      
      } else{ 
        missContent.textContent = " ";
      }

      if (!imageValid){
        missImage.textContent = 'Image manquante';
        missImage.style.color = 'red' ;      
      } else{ 
        missImage.textContent = " ";
      }
      // FIN VALIDATION 

      const userID = this.$user.userID;            
      const title = document.getElementById("newpost-title").value;
      const content = document.getElementById("newpost-content").value; 
      let image = document.getElementById('newpost-image').files[0] 
      var formData = new FormData()
      
      formData.append('userID', userID)
      formData.append('title', title)
      formData.append('image', image)
      formData.append('content', content) 


      if (titleValid && contentValid && imageValid) {
        axios.post(`${this.$apiUrl}/posts`, 
          formData,
          {
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${this.$token}`
              }
          }
          )
          .then(res => {
              if(res.status === 201) {
                    location.href = '/';
              }
          })
          .catch((error) => {
              if (error.response.status === 401) {
                  this.message = "Email non disponible.";
              }  
        });         
      }
      else {
        alert('saisie incomplete');
      }                   
    }    
  },
};
</script>

<style scoped>
    /* Post style */
    /* .post-wrapper{
        margin: 50px auto 30px auto;
        padding: 30px;
        max-width: 800px;
        text-align: left;
        box-shadow: 0px 0px 50px -7px rgba(0,0,0,0.1);
        border-bottom: solid red 5px;
    }
    .newpost-title {
        margin: 0;
        color: red;
        font-size: 2rem;
    }
    .newpost-content{
        margin-top: 20px;
    } */
    /* Modify style */
    .post-wrapper{
        display: flex;
        flex-direction: column;
        margin: 50px auto;
        padding: 30px;
        max-width: 800px;
        text-align: left;
        box-shadow: 0px 0px 50px -7px rgba(0,0,0,0.1);
        border-bottom: solid red 5px;
    }
    #nexpost-title {
        margin: 0;
        margin-bottom: 20px;
        color: red;
        font-size: 2rem;
    }
    #newpost-content{
        margin-top: 20px;
        height: 200px;
        width: calc(100% - 22px);
        padding: 10px;
        resize: none;
        overflow-y: scroll;
    }
    .onePost button{
        margin-top: 20px;
        padding: 10px;
        font-size: 1.1rem;
        color: white;
        background-color: rgb(43, 42, 42);
        border: none;
        border-radius: 10px;
        transition-duration: 0.2s;
        cursor: pointer;
        margin: 0px 20px 50px 20px;
    }
    .delete-btn{
        background-color: red !important;
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