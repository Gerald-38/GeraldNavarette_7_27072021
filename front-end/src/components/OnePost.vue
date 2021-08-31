<template>
    <div class="onePost">
        <div class="post-wrapper" v-if="!modify">
            <h2 class="post-title">{{this.post.title}}</h2>
            <div class="post-content" v-html="this.post.content"></div>            
            <img :src="this.post.gifUrl" alt="" class="post-image" id="posted-image">            
        </div>

        <div class="modify-wrapper" v-if="modify">
            <label for="modify-title">Modifier le titre :</label>
            <input type="text" id="modify-title" :value=this.post.title>            
            <label for="modify-content">Modifier le contenu :</label>            
            <textarea id="modify-content" :value=this.post.content></textarea>  
            <input type="file" name="image" id="modify-image">
            <img :src="this.post.gifUrl" alt="" id="current-image">       
        </div>
        

        <button v-if="authorized && !modify" @click="modify = true">Modifier</button>
        <button v-if="modify" @click="modify = false">Annuler</button>
        <button v-if="modify" @click="modifyOnePost()">Publier les modifications</button>
        <button v-if="modify" class="delete-btn" @click="deleteOnePost()">Supprimer le post</button>
    </div>
    
</template>

<script>
import axios from 'axios';
export default {
    name: 'OnePost',
    components: {
    },
    data(){
        return{
            modifiedContent: '',
            post: [],
            authorized: false,
            modify: false, 
            title: "",
            image: "",     
            content: "",    
        }
    },
    mounted(){
        this.getOnePost();
    },
    methods: {
        getOnePost(){
            const postId = this.$route.params.id;
            console.log(postId)            
            axios.get(`${this.$apiUrl}/posts/${postId}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.$token}`
                    }
                }
            )
            .then(res => {
                this.post = res.data[0];
                if(this.$user.userID === this.post.userID || this.$user.admin == 1){
                    this.authorized = true;
                 }
                else{
                    this.authorized = false;
                }            
            })            
        },
        deleteOnePost(){
            const postID = this.$route.params.id;
            
            axios.delete(`${this.$apiUrl}/posts/${postID}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.$token}`
                    }
                }
            )
            .then(location.href = "/");
        },
        modifyOnePost(){
            const postId = this.$route.params.id;
            const title = document.querySelector('#modify-title').value;
            const content = document.querySelector('#modify-content').value;
            let image = document.getElementById('modify-image').files[0] 
            // if (!image) {
            //     image = this.post.gifUrl;
            // }
            console.log(image);
            if(image) { // si positive, c'est qu'il y a
                var formData = new FormData()      
                formData.append('postID', postId)
                formData.append('title', title)
                formData.append('image', image)
                formData.append('content', content) 
                
                axios.put(`${this.$apiUrl}/posts/${postId}`, 
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            'Authorization': `Bearer ${this.$token}`
                        }
                    }
                )
                .then(location.href = "/");
            } else {
                // image n'a pas été modifièe
                // donc on prépare une requete JSON
                let postData = {
                    title: title,
                    content: content,
                    postId: postId
                };
                    axios.put(`${this.$apiUrl}/posts/${postId}`, 
                    postData,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${this.$token}`
                        }
                    }
            
                )
                .then(location.href = "/");
            }            
            location.href = "/";
        }
    }
}
</script>

<style scoped>
    /* Post style */
    .post-wrapper{
        margin: 50px auto 30px auto;
        padding: 30px;
        max-width: 800px;
        text-align: left;
        box-shadow: 0px 0px 50px -7px rgba(0,0,0,0.1);
        border-bottom: solid red 5px;
    }
    .post-title {
        margin: 0;
        color: rgb(0,0,0);
        font-size: 2rem;
    }
    .post-content{
        margin-top: 20px;
    }

    .post-image {
        max-width: 100%;
        max-height: 100%;
    }



    /* Modify style */
    .modify-wrapper{
        display: flex;
        flex-direction: column;
        margin: 50px auto;
        padding: 30px;
        max-width: 800px;
        text-align: left;
        box-shadow: 0px 0px 50px -7px rgba(0,0,0,0.1);
        border-bottom: solid red 5px;
    }
    #modify-title {
        margin: 0;
        margin-bottom: 20px;
        color: rgb(0,0,0);
        font-size: 1rem;
    }
    #modify-content{
        margin-top: 20px;
        height: 200px;
        width: calc(100% - 22px);
        padding: 10px;
        resize: none;
        overflow-y: scroll;
    }

    #current-image {
        height: 20%;
        width: 20%;
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