<template>
    <div class="posts">        
        <article class="post" v-for = "post in posts" :key="post.postID">
            <router-link  style="text-decoration: none; color: inherit;" :to="{ name: 'Post', params: { id: post.postID } }">            
                <div class="post-header">
                    <span class="post-info">Posté le {{dateFormat(post.date)}} par {{post.firstName}} {{post.lastName}}</span>
                    <span class="post-modify" v-if="post.userID == $user.userID || $user.admin == 1">Modifier</span> 
                </div>  
                <h2 class="post-title">{{post.title}}</h2>
                <div class="post-content" v-html="characterLimit(post.content)"></div>
            </router-link>
        </article>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    name: 'Posts',
    data(){
        return {
            posts: [],
            visible: false
        }
    },
    mounted() {
        if(localStorage.user != undefined){
            this.getAllPost();
        }
        //Export de la fonction
        this.$root.$on('Posts', () => {
            this.getAllPost();
        });
    },
    methods: {
        getAllPost(){
            axios.get(`${this.$apiUrl}/posts/`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.$token}`
                    }
                }
            )
            .then(res => {
                this.posts = res.data;
            })
        },
        characterLimit(content){
            let text = content;
            const maxLength = 100;
            if(text.length > maxLength){
                return text.substring(0, maxLength - 3) + "...";
            }
            else{
                return text;
            }
        },
        dateFormat(date){
            const event = new Date(date);
            const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
            return event.toLocaleDateString('fr-FR', options);
        }
    }
}
</script>

<style scoped>
    .posts{
        margin: 0 auto;
        padding: 20px;
        max-width: 800px;                
    }

    .post{
        position: relative;
        padding: 20px 20px 20px 30px;
        margin-bottom: 30px;
        border-left: 5px solid rgb(43, 42, 42);
        box-shadow: 0px 0px 50px -7px rgba(0,0,0,0.1);
        text-align: left;
        transition-duration: .1s;
        transition: 800ms;
    }
    .post:hover{
        /* box-shadow: 0px 0px 50px -7px rgba(0, 0, 0, 0.2); */
        cursor: pointer;
        transform: scale(1.05);   
    }
    .post h2{
        margin-top: 7px;
    }
    .post-header{
        display: flex;
        justify-content: space-between;
        color: rgb(0, 0, 0);
        font-size: .8rem;
    }
    .post-modify{
        color: rgb(219, 17, 17);
        font-size: 1rem;
        font-weight: bold;
    }
    .post-title{
        color: rgb(0, 0, 0); 
    }
    .post-content{
        font-size: .9rem;
    }
</style>