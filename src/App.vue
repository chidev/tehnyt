<template>
  <v-app>
        <tehnytSideBar/>
    <tehnytTopBar/>
    <ListTasks/>
  </v-app>
</template>

<script>
import ListTasks from './components/ListTasks.vue';
import tehnytSideBar from './components/tehnytSideBar.vue';
import tehnytTopBar from './components/tehnytTopBar.vue';
export default {
  name: 'app',
  components: {
    ListTasks,
    tehnytSideBar,
    tehnytTopBar
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  /* margin-top: 60px; */
}

  
</style>
