<template>
  <div class="home">    
    <Connection/>
    <Posts v-if="connected"/> 
    <NewPost v-if="connected"/>
  </div>
</template>

<script>
// @ is an alias to /src
import Posts from '@/components/Posts.vue';
import Connection from './Connection.vue';
import NewPost from '@/components/NewPost.vue';
export default {
  name: 'Home',
  components: {
    Posts,
    Connection,
    NewPost
  },
  data() {
    return{
      connected: true
    };
  },
  created(){
    this.checkConnected()
  },
  methods: {
    checkConnected(){
      if(localStorage.user !== undefined){
        this.connected = true;
        console.log('Utilisateur connecté !');
      }
      else if(localStorage.user == undefined){
        this.connected = false;
        console.log('Utilisateur non connecté !');
      }
    }
  }
}
</script>