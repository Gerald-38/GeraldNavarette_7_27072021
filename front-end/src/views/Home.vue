<template>
  <div class="home">        
    <Connection/>
    <NewPost v-if="connected"/> 
    <Posts v-if="connected"/>     
  </div>
</template>

<script>
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