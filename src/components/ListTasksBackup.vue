<template>
  <div>
    <div v-for="(task, index) in taskList">
<!--           <div v-for="indents in taskList[index].indent" class="indent">
</div> -->
<!--             <input v-if="!tasks.blurred" :ref="'inputField' + index" @keydown.tab.prevent="tabPress(index, 1, $event)" @blur="showBlurTask(index)" @keydown.up="arrowPress(index, -1)" @keydown.down="arrowPress(index, 1)" type="text" v-model="taskList[index].taskName">
  <div :ref="'inputField' + index" v-else @click="showBlurTask(index)">{{ taskList[index].taskName }}</div> -->
  <div>
    <input v-if="!task.blurred" ref="inputField" @keydown.tab.prevent="tabPress(index, 1, $event)" @blur="showBlurTask(index)" @keydown.up="arrowPress(index, -1)" @keydown.down="arrowPress(index, 1)" type="text" v-model="task.taskName">
    <div :ref="'inputField' + index" v-else @click="showBlurTask(index)">{{ task.taskName }}</div>
  </div>
  <div v-for="(childOne, childOneIndex) in task.children">
      <div>
    <input v-if="!childOne.blurred" ref="inputField" @keydown.tab.prevent="tabPress(childOneIndex, 1, $event)" @blur="showBlurTask(childOneIndex)" @keydown.up="arrowPress(childOneIndex, -1)" @keydown.down="arrowPress(childOneIndex, 1)" type="text" v-model="childOne.taskName">
    <div :ref="'inputField' + childOneIndex" v-else @click="showBlurTask(childOneIndex)">{{ childOne.taskName }}</div>
  </div>
</div>
  </div>
</div>
</div>
</template>

<script>
  export default {
    data() {
      return {
        taskList: [{
          taskName: "Ingen indent",
          indent: 0,
          blurred: true
        },{
          taskName: "I have 2 children",
          indent: 2,
          blurred: true,
          children: [{
            taskName: "Child uno",
            indent: 2,
            blurred: true
          },{
            taskName: "Child due",
            indent: 2,
            blurred: true
          }]
        },{
          taskName: "3 indent",
          indent: 3,
          blurred: true}
          ]}
        },
        methods: {
          countTasks() {
            return this.displayedTasks++
          },
          tabPress(index, value, event) { //Check if shift is pressed and add/decrease margin
            if(event.shiftKey) {
              this.taskList[index].indent -= 1;
            } else {
              this.taskList[index].indent += 1;
            }
          },
          arrowPress(index, value) { // Move up/down between inputs
            this.taskList[index + value].blurred = !this.taskList[index + value].blurred;
            // this.$nextTick(() => this.$refs['inputField'+ (value + index)][0].focus());
            this.$nextTick(() => this.$refs['inputField'+ (value + index)][0].focus());
          },
          showBlurTask(index) {
            this.taskList[index].blurred = !this.taskList[index].blurred;
            // this.$nextTick(() => this.$refs['inputField' + index][0].focus());
          }
        }

      }
    </script>

    <style scoped>
    .indent {
      background: green;
      width: 100px;
      border: 1px solid black;
      position: relative; 
      margin-left: 10px
    }

    input {
/*  border: none;
background: transparent;*/
}
</style>
