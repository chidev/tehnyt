<template>
  <v-app>
    <ListTasks/>
  </v-app>
</template>

<script>
import ListTasks from './components/ListTasks.vue';
export default {
  name: 'app',
  components: {
    ListTasks,
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}

  
</style>
