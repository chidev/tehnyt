<template>
               <!-- <b-tooltip label="Complete task"> -->
            <span class="icon">
              <i
                @click="$emit('completeChildren')"
                 :class="['fas fa-check',{'has-text-success': task.done }]"
              ></i>
            </span>
          <!-- </b-tooltip> -->
</template>
<script>
export default {
    props: ['task']
}
</script>