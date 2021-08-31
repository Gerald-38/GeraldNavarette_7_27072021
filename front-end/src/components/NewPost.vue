  
<template>
  <div class="newPost">
    <div class="newPost-create-btn" @click="visible = true">Ajouter un nouveau post</div>

    <transition name="fade">
      <div class="overlay" v-if="visible">
          <div class="form-wrapper">
            <span class="form-close"  @click="visible = false">Annuler</span>
            <br>
            <form class="newPost-form" @submit.prevent="addPost()">
              <input 
                type="text" 
                placeholder="entrez le titre" 
                id="newpost-title" 
                required>
            <br>
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
            <!-- Sélection du Gif -->
            <div id='main'>
              <input type="file" name="image" id="newpost-image" required> 
            </div>
            <br>                  

          <button id="newPost-btn" type="submit" >Publier</button>          

            </form>
          </div>
      </div>
    </transition>

  </div>
</template>

<script>
import axios from 'axios';
export default {
    name: 'NewPost',
    components: {
    },
    data(){
        return{
            visible: false,
            content: '',
            title: "",
            image: "",
        }
    },
    methods: {
      addPost(){
        const userID = this.$user.userID;            
        const title = document.getElementById("newpost-title").value;
        const content = document.getElementById("newpost-content").value; 
        let image = document.getElementById('newpost-image').files[0] 
        var formData = new FormData()
        
        formData.append('userID', userID)
        formData.append('title', title)
        formData.append('image', image)
        formData.append('content', content) 

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
    }
}
</script>

<style scoped> 
    .newPost{
        padding: 20px 20px 0px 20px ;   
    }
    .newPost-create-btn{
        margin: 30px auto;
        padding: 20px;
        border-radius: 30px;
        background-color: rgb(43, 42, 42);
        color: white;
        max-width: 300px;
        font-size: 1.5rem;
        transition-duration: 0.2s;
        cursor: pointer;
    }
    .newPost-create-btn:hover{
        transform: scale(1.02);
    }
    .overlay{
        position: fixed;
        display: flex;
        justify-content: center;
        align-items: center;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(31, 30, 30, 0.678);
        z-index: 1;
    }
    .form-wrapper{
        box-sizing: border-box;
        background-color: white;
        display: flex;
        flex-direction: column;
        padding: 5%;
        width: 800px;
        height: 80%;
        border-radius: 30px;
    }
    .form-close{
        color: red;
        cursor: pointer;
        align-self: flex-end;
    }
    .newPost-form{
        display: flex;
        flex-direction: column;
        text-align: left;
    }
    form input{
        font-size: 1.05rem;
        padding: 10px;
        margin-bottom: 15px;
        text-align: center;
        text-align: left;
        margin-bottom: 30px;    
    }
    form label{
        color: red;
        font-weight: bold;
        font-size: 1.3rem;
        margin-bottom: 10px;
    }
    #newPost-content{
        height: 200px;
        width: calc(100% - 20px);
        padding: 10px;
        resize: none;
        overflow-y: scroll;
    }
    #newPost-btn{
        margin-top: 20px;
        padding: 10px;
        font-size: 1.1rem;
        color: white;
        background-color: rgb(43, 42, 42);
        border: none;
        border-radius: 10px;
        transition-duration: 0.2s;
        cursor: pointer;
    }
    .fade-enter-active, .fade-leave-active {
    transition: opacity .8s;
    }
    .fade-enter, .fade-leave-to {
    opacity: 0;
    }
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