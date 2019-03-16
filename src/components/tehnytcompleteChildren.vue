<template>
               <!-- <b-tooltip label="Complete task"> -->
          
              <v-icon small
                @click="$emit('completeChildren')"
                 :class="{'completed-style' : task.done}"
              >fas fa-check</v-icon>
          <!-- </b-tooltip> -->
</template>
<script>
export default {
    props: ['task']
}
</script>
// :class="['fas fa-check',{'has-text-success': task.done }]"
<style scoped>
  .completed-style {
    color: #8BC34A !important
  }
</style>