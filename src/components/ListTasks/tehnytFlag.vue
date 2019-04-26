<template>
           <!-- <b-tooltip label="Toggle flag"> -->
          <!-- </b-tooltip> -->
            <b-icon
    pack="fas"
    size="is-small"
    icon="flag"
    @click.native="$emit('clickedFlag')"
    :class="{'flagged-style' : task.flagged}"
  ></b-icon>
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
