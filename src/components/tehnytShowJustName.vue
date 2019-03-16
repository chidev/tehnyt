<template>
  <span @click="clicked">{{task.taskName}}</span>
</template>
<script>
export default {
  props: ["task", "index"],
methods: {
  clicked (event) {
        this.$emit('setActivateThisFieldIndex', this.index) 
       this.$emit('inputWasFocused', event);
        // this.$nextTick(() => this.$refs["theInputFieldRef" + this.index].focus());
  }
},
beforeUpdate() {
    console.log("Updated span: " + this.task.taskName)
  }
};
</script>
