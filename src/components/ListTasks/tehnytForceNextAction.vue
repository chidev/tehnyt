<template>
         <!-- <b-tooltip label="Force Next Action"> -->

                          <v-icon small
                @click="$emit('clickedNext')"
                 :class="[{'isNext-style' : task.isNext}, {'forceNext-style' : task.forceNext}]"
              >fas fa-long-arrow-alt-right</v-icon>
          <!-- </b-tooltip> -->
</template>
<script>
export default {
    props: ['task']
}
</script>

<style scoped>
  .isNext-style {
    color: #8BC34A !important
  }
    .forceNext-style {
    color: #D50000 !important
  }
</style>

            // <span class="icon">
            //   <i
            //     @click="$emit('clickedNext')"
            //     :class="['fas fa-long-arrow-alt-right ',{'has-text-success': task.isNext},{'has-text-grey-lighter': !task.isNext},{'has-text-danger': task.forceNext}]"
            //   ></i>
            // </span>

