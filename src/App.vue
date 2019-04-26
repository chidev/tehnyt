<template>
  <div>
<br/>
    <tehnytTopBar/>
    <div class="columns">
  <div class="column">
    
    <ListTasks/>
  </div>
  <div class="column is-one-quarter">
        <tehnytSideBar/>
  </div>
</div>


  </div>
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

<style lang="scss">
@import "~bulma/sass/utilities/_all";

// Set your colors
$primary: #8c67ef;
$primary-invert: findColorInvert($primary);
$twitter: #4099FF;
$twitter-invert: findColorInvert($twitter);

// Setup $colors to use as bulma classes (e.g. 'is-twitter')
$colors: (
    "white": ($white, $black),
    "black": ($black, $white),
    "light": ($light, $light-invert),
    "dark": ($dark, $dark-invert),
    "primary": ($primary, $primary-invert),
    "info": ($info, $info-invert),
    "success": ($success, $success-invert),
    "warning": ($warning, $warning-invert),
    "danger": ($danger, $danger-invert),
    "twitter": ($twitter, $twitter-invert)
);

// Links
$link: $primary;
$link-invert: $primary-invert;
$link-focus-border: $primary;

// Import Bulma and Buefy styles
@import "~bulma";
@import "~buefy/src/scss/buefy";
</style>