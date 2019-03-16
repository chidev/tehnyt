<template>
<span>
  <span v-if="showField" @click="clicked">{{task.taskName}}</span>
  <input v-else
    @keydown.space="$emit('click','minsann')"
    @keydown.tab.prevent="$emit('tabPress', task.id, $event)"
    @click="clicked($event)"
    @keydown.down="$emit('arrowPress', task.id, index, 1, $event)"
    @keydown.up="$emit('arrowPress', task.id, index, -1, $event)"
    @keydown.esc="$emit('pressedEsc', task.id, index, $event)"
    @keydown.enter="$emit('pressedEnter', task.id, index, $event)"
    @keydown.delete="$emit('deleteTask', task.id, -1, index, $event)"
        @keyup.delete="$emit('deleteKeyUp', $event)"
        @blur="blur(task.id, $event)"
    type="text"
    v-model.lazy="task.taskName"  
    :ref="'theInputFieldRef' + index"
  >
  </span>
</template>
<script>
export default {
  props: ["task", "index", "activateThisFieldIndex"],
data () {
  return {
    // showNameInput: false
  }
},
computed: {
      showField() {
        return (this.activateThisFieldIndex !== this.index)
      }
//       return (this.activateThisFieldIndex >= this.index -1 && this.activateThisFieldIndex <= this.index +1)  // Activate fiels above & below as well to be able to move pointer  || (this.showNameInput == true))
//     },
},
methods: {
  blur (taskId, event) {
    // this.showNameInput = false;
    this.$emit('taskBlu rred', taskId, event) 
  },
  clicked (event) {
    // this.showNameInput = true;
        this.$emit('setActivateThisFieldIndex', this.index) 
       this.$emit('inputWasFocused', event);
        this.$nextTick(() => this.$refs["theInputFieldRef" + this.index].focus());
  }
},
beforeUpdate() {
    console.log("Updatd " + this.task.taskName)
  }
};
</script>
