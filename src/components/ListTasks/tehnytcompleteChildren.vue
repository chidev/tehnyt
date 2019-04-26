<template>
               <!-- <b-tooltip label="Complete task"> -->
                          <b-icon
    pack="fas"
    size="is-small"
    icon="check"
    @click.native="$emit('completeChildren')"
    :class="{'completed-style' : task.done}"
  ></b-icon>
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