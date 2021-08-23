<template>
    <div class="Profile">        
        <Connection/>
        <UserProfile v-if="connected"/>
        <!-- <UserPosts v-if="connected"/> -->        
    </div>
</template>

<script>
import UserProfile from '@/components/UserProfile.vue';
import Connection from './Connection.vue';
// import UserPosts from '@/components/UserPosts.vue';
export default {
    name: 'Profile',
    components: {
        UserProfile,
        Connection,
        // UserPosts
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
    },
  }
}
</script>

<style scoped>
</style>