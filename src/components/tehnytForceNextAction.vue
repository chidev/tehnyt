<template>
         <b-tooltip label="Force Next Action">
            <span class="icon">
              <i
                @click="$emit('clickedNext')"
                :class="['fas fa-long-arrow-alt-right ',{'has-text-success': task.isNext},{'has-text-grey-lighter': !task.isNext},{'has-text-danger': task.forceNext}]"
              ></i>
            </span>
          </b-tooltip>
</template>
<script>
export default {
    props: ['task']
}
</script>