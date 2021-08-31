<template>    
    <div class="header">
        <router-link style="text-decoration: none; color: inherit;" to='/'>
        <h1>
            <img src="../assets/img/icon-left-font-monochrome-black.png" alt="Groupomania logo">
        </h1>
        </router-link>

        <nav>
            <router-link to='/' style="text-decoration: none; color: inherit;">
                <div>Liste des posts</div>
            </router-link>
            <router-link to='/profile' style="text-decoration: none; color: inherit;">
                <div>Mon profil</div>
            </router-link>
            <div id="disconnect-btn" @click = disconnect()>Se déconnecter</div>
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
        padding: 30px 70px 20px 70px;
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
        color: red;
        border-bottom: 3px solid rgb(43, 42, 42);
    }
    @media (max-width: 670px) {
        .header{
            flex-direction: column;
            padding: 30px 20px 20px 20px;
        }
    }
</style>