<template>
  <v-text-field class="ma-0 pa-0" hide-details solo flat
    @keydown.tab.prevent="$emit('tabPress', task.id, $event)"
    @keydown.down="$emit('arrowPress', task.id, index, 1, $event)"
    @keydown.up="$emit('arrowPress', task.id, index, -1, $event)"
    @keydown.esc="$emit('pressedEsc', task.id, index, $event)"
    @keydown.enter="$emit('pressedEnter', task.id, index, $event)"
    @keydown.delete="$emit('deleteTask', task.id, -1, index, $event)"
        @keyup.delete="$emit('deleteKeyUp', $event)"
        @blur="blur(task.id, $event)"
        @click="$emit('setActiveTask', $event)"
  :value="message" @change="v => message = v"
    :ref="'theInputFieldRef' + index"
  ></v-text-field>  
</template>

<script>
import {mapMutations} from 'vuex';
export default {
  props: ["task", "index"],
    computed: {
    message : {
      get() {
        return this.task.taskName
      }, set(v) {
        // this.task.taskName=v   
        console.log("index" + this.task.taskIndexInMainList)
        this.SET_TASK_NAME([this.task.taskIndexInMainList, v]); 
      }
    }
  },
methods: {
              ...mapMutations([
'SET_TASK_NAME'
    ]),
  blur (taskId, event) {
    // this.showNameInput = false;
    this.$emit('taskBlurred', taskId, event) 
  }
  // clicked (taskId) {
  //       this.$emit('setActiveTask', taskId) 
  //     //  this.$emit('inputWasFocused', event);
  //     //   this.$nextTick(() => this.$refs["theInputFieldRef" + this.index].focus());
  // }
},
beforeUpdate() {
    console.log("Updated input: " + this.task.taskName)
  }
};
</script>
