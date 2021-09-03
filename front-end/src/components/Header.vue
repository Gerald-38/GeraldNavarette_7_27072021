<template>    
    <div class="header">
        <router-link style="text-decoration: none; color: inherit;" to='/'>
        <h1>
            <img src="../assets/img/icon-left-font-monochrome-black.png" alt="logo Groupomania">
        </h1>
        </router-link>

        <nav>
            <router-link to='/' style="text-decoration: none; color: inherit;">
                <div>posts</div>
            </router-link>
            <router-link to='/profile' style="text-decoration: none; color: inherit;">
                <div>profil</div>
            </router-link>
            <div id="disconnect-btn" @click = disconnect() role="button" tabindex="0" aria-pressed="false" @keydown.enter= disconnect()>déconnection</div>
        </nav>
    </div>  
</template>

<script>
export default {
    name: 'Header',

    methods: {
        disconnect(){
            localStorage.removeItem('user');
            location.href = "/";
        }
    }
}

</script>

<style scoped>
    *:focus{
        border: 4px solid red;
    }

    p link {
        text-decoration: none;
    }
    #popo {
        text-decoration: none;
    }
    .header{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 30px 70px 0px 70px;
        border-bottom: 3px solid rgb(240, 84, 84);
    }
    .header img{
        width: 250px;
        height: auto;
    }
    nav{
        display: flex;
    }
    nav div{
        margin-left: 30px;
        font-weight: bold;
        cursor: pointer;
        transition-duration: .2s;
    }
    .fas{
        font-size: 1.5rem;
    }
    nav div:hover{        
        color: rgb(240, 84, 84);
        border-bottom: 3px solid rgb(34, 40, 49);
    }
    @media (max-width: 670px) {
        .header{
            flex-direction: column;
            padding: 30px 20px 20px 20px;
        }
    }
</style>