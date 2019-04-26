<template>
  <!-- <b-tooltip label="Force Next Action"> -->
  <b-icon
    pack="fas"
    size="is-small"
    icon="long-arrow-alt-right"
    @click.native="$emit('clickedNext')"
    :class="[{'has-text-success': task.isNext},{'has-text-grey-lighter': !task.isNext},{'has-text-danger': task.forceNext}]"
  ></b-icon>
  <!-- </b-tooltip> -->
</template>
<script>
export default {
  props: ["task"]
};
</script>

<style scoped>
.isNext-style {
  color: #8bc34a !important;
}
.forceNext-style {
  color: #d50000 !important;
}
</style>

            // <span class="icon">
            //   <i
            //     @click="$emit('clickedNext')"
            //     :class="['fas fa-long-arrow-alt-right ',{'has-text-success': task.isNext},{'has-text-grey-lighter': !task.isNext},{'has-text-danger': task.forceNext}]"
            //   ></i>
            // </span>

