<template>
               <!-- <b-tooltip label="Complete task">
            <span class="icon">
              <i
                @click="$emit('completeChildren')"
                 :class="['fas fa-check',{'has-text-success': task.done }]"
              ></i>
            </span>
          </b-tooltip> -->
           <input
            :ref="'inputField' + index"
            @keydown.space="$emit('click','minsann')"

            type="text"
            v-model.lazy="task.taskName"
            class="task is-inline-flex"
          >

</template>
<script>
export default {
    props: ['task', 'index']
}
</script>
            // @click="inputWasFocused(task.id, index, ...arguments)"
            // @keydown.tab.native.prevent="tabPress(task.id, 1, $event)"
            // @keydown.up="arrowPress(task.id, index, -1, ...arguments)"
            // @keydown.down="arrowPress(task.id, index, 1, ...arguments)"
            // @keydown.esc="pressedEsc(task.id, index, ...arguments)"
            // @keydown.enter="pressedEnter(task.id, index, ...arguments)"
            // @keydown.delete="deleteTask(task.id, -1, index, $event, ...arguments)"
            // @keyup.delete="tasksDeleted = false"
            // @blur="taskBlurred(task.id, index, ...arguments)"