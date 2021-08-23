<template>
  <div class="post">
    <Connection />
    <OnePost v-if="connected"/>
    <Comments v-if="connected"/>
  </div>
</template>
<script>
import Connection from './Connection.vue';
import OnePost from '../components/OnePost.vue';
import Comments from '@/components/Comments.vue';
export default {
  name: 'Post',
  components: {
    Connection,
    OnePost,
    Comments
  },
  data() {
    return{
      connected: true,
      authorized: true
    };
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
  },
  created(){
    this.checkConnected()
  }
}
</script>