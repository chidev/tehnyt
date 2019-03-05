<template>
           <b-tooltip label="Toggle flag">
            <span class="icon">
              <i
                @click="$emit('clickedFlag')"
                :class="['fas fa-flag',{'has-text-danger': task.flagged }]"
              ></i>
            </span>
          </b-tooltip>
</template>
<script>
export default {
    props: ['task']
}
</script>