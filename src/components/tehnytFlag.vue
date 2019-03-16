<template>
           <!-- <b-tooltip label="Toggle flag"> -->
              <v-icon small
                @click="$emit('clickedFlag')"
                 :class="{'flagged-style' : task.flagged}"
              >fas fa-flag</v-icon>
          <!-- </b-tooltip> -->
</template>
<script>
export default {
    props: ['task']
}
</script>

<style scoped>
  .flagged-style {
    color: #D50000 !important
  }
</style>


</script>
// :class="['fas fa-check',{'has-text-success': task.done }]"
