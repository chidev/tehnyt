<template>
  <b-input expanded
    @keydown.tab.native.prevent="$emit('tabPress', task.id, $event)"
    @keydown.native.down="$emit('arrowPress', task.id, index, 1, $event)"
    @keydown.native.up="$emit('arrowPress', task.id, index, -1, $event)"
    @keydown.native.esc="$emit('pressedEsc', task.id, index, $event)"
    @keydown.native.enter="$emit('pressedEnter', task.id, index, $event)"
    @keydown.native.delete="$emit('deleteTask', task.id, -1, index, $event)"
        @keyup.native.delete="$emit('deleteKeyUp', $event)"
        @blur.native="blur(task.id, $event)"
        @click.native="$emit('setActiveTask', $event)"
  :value="message" @change.native="message = $event.target.value"
    :ref="'theInputFieldRef' + index"
  ></b-input>  
</template>

<script>
import {mapMutations} from 'vuex';
import {mapGetters} from 'vuex';
export default {
  props: ["index"],
    computed: {
      ...mapGetters(["taskList"]),
      task() {
        return this.taskList[this.index]
      },
    message : {
      get() {
        return this.taskList[this.index].taskName
      }, set(v) {
        // this.task.taskName=v   
        this.SET_TASK_NAME([this.index, v]);
      }
    }
  },
methods: {
              ...mapMutations([
'SET_TASK_NAME'
    ]),
  blur (taskId, event) {
    // this.showNameInput = false;
    console.log("hej")
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
