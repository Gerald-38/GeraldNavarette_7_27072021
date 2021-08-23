<!-- COMPONENT CREATEPOST - Composants de la création d'un post -->

<template>
        <!-- <div class="post-wrapper" v-if="!modify">
            <h2 class="post-title">{{this.post.title}}</h2>
            <div class="post-content" v-html="this.post.content"></div>
            <img src="this.post.gifUrl" alt="">            
            <div class="post-content" v-html="this.post.gifUrl"></div>
            
        </div> -->
  <div class="post-wrapper">
    <form name="createPost">
      <!-- Textarea du post -->
      <input type="text" placeholder="entrez le titre" id="newpost-title">
      <br>
      <textarea
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
      <!-- Fin -->
      <!-- Sélection du Gif -->
      <div class="">
        <input
          name="image"
          type="file"
          class=""
          required          
          id="newpost-image"
        />
        <label class="" for="image">Choisir un fichier multimédia</label>
      </div>
      
      <!-- <div class="custom-file">
        <input
          name="inputFile"
          type="file"
          class="custom-file-input"
          id="newpost-image"
          @change="onFileChange"
        />
        <label class="custom-file-label" for="inputFile">Choose file</label>
      </div> -->



      <!-- Fin -->
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
        title: "",
        content: "", 
        gifUrl: null, 
    };
  },
  methods: {

    onFileChange(e) {
      console.log(e);
      // this.imageFile = e.target.files[0]      
    },
    // onFileChange(e) {
    //   console.log(e);
    //   const imageFile = e.target.files[0]
    //   const reader = new FileReader();
    //   reader.readAsDataURL(imageFile);      
    //   reader.onload = e =>{
    //       this.imageFile = e.target.result;
    //       console.log(this.imageFile);
    //   };
    //   console.log(this.imageFile);
    // },
    addPost(){
      const userID = this.$user.userID;      
      const title = document.getElementById("newpost-title").value;
      const content = document.getElementById("newpost-content").value;  
      console.log(userID);          
      const gifUrl = document.getElementById("newpost-image").value;
      // const gifUrl = this.imageFile;
      // console.log(gifUrl);
      
      axios.post(`${this.$apiUrl}/posts`,
          {
              userID,
              title,
              content,
              gifUrl
          },
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