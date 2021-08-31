<template>
  <div class="home">  
    <Header v-if="connected"/>
    <LoginForm v-if="!connected"/>  
  </div>
</template>

<script>
import LoginForm from '@/components/LoginForm.vue';
import Header from '@/components/Header.vue';

export default {
  name: 'Home',
  components: {
    LoginForm,
    Header,
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