<template>
  <input
    @keydown.space="$emit('click','minsann')"
    @keydown.tab.prevent="$emit('tabPress', task.id, $event)"
    @click="$emit('inputWasFocused', $event)"
    @keydown.down="$emit('arrowPress', task.id, index, 1, $event)"
    @keydown.up="$emit('arrowPress', task.id, index, -1, $event)"
    @keydown.esc="$emit('pressedEsc', task.id, index, $event)"
    @keydown.enter="$emit('pressedEnter', task.id, index, $event)"
    @keydown.delete="$emit('deleteTask', task.id, -1, index, $event)"
        @keyup.delete="$emit('deleteKeyUp', $event)"
        @blur="$emit('taskBlurred', task.id, $event)"
    type="text"
    v-model.lazy="task.taskName"
    class="task is-inline-flex"
  >
</template>
<script>
export default {
  props: ["task", "index"]
};
</script>
