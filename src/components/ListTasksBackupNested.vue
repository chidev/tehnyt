<template>
  <div>
   <div v-for="(task, index) in taskList">
    <input @blur="showBlurTask(index)" v-if="!task.blurred" :ref="ref(index)" type="text" v-model="task.taskName" @keydown.up="arrowPress(index, -1)" @keydown.down="arrowPress(index, 1)">
    <div :ref="ref(index)" v-else @click="showBlurTask(index)">{{ task.taskName }}</div>
    <div v-for="(child, childIndex) in task.children" style="margin-left: 30px">
      <input @blur="showBlurTask(index, childIndex)" v-if="!child.blurred" :ref="ref(index, childIndex)" type="text" v-model="child.taskName" @keydown.up="arrowPress(index, -1, childIndex)" @keydown.down="arrowPress(index, 1, childIndex)">
      <div :ref="ref(index, childIndex)" v-else @click="showBlurTask(index, childIndex)">{{ child.taskName }}</div>
    </div> 
  </div>
</div>
</template>

<script>
  export default {
    data() {
      return {
        displayedTasks: 0,
        taskList: [{
          taskName: "Ingen indent",
          indent: 0,
          blurred: true,
          children: []
        },{
          taskName: "Ingen indent",
          indent: 0,
          blurred: true,
          children: []
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
          blurred: true,
          children: []}
          ]}
        },
        methods: {
          ref(parent, child) {
            let me = 'inputField' + parent.toString().padStart(4, '0');
            if (child !== undefined) me += child.toString().padStart(4, '0');
            return me;
          },
          arrowPress(parent, direction, child) {
            let refs = Object.keys(this.$refs).filter(key => key.indexOf('inputField') === 0).sort();
            let i = refs.indexOf(this.ref(parent, child));
            i = Math.max(i + direction, 0);
            let prevRef = refs[i];
            if(child + direction + 1 > this.taskList[parent].children.length) { // Check if we're moving parent -> child, opposite, parent -> parent, etc. This code can probably be written smarter.
              this.taskList[parent + direction].blurred = !this.taskList[parent + direction].blurred;
          } else if (child + direction === -1) {
            this.taskList[parent].blurred = !this.taskList[parent].blurred;
          } else if ( child + direction > -1) {
            this.taskList[parent].children[child + direction].blurred = !this.taskList[parent].children[child + direction].blurred;
          } else if (direction === -1) {
            if (this.taskList[parent + direction].children.length === 0) {
              this.taskList[parent + direction].blurred = !this.taskList[parent + direction].blurred;
            } else {
              let a = this.taskList[parent + direction].children.length;
              this.taskList[parent + direction].children[a - 1].blurred = !this.taskList[parent + direction].children[a - 1].blurred;
            }

          } else if (this.taskList[parent].children.length > 0) {
            this.taskList[parent].children[0].blurred = !this.taskList[parent].children[0].blurred;
          }
          else  {
           this.taskList[parent + direction].blurred = !this.taskList[parent + direction].blurred;
         } 
         this.$nextTick(() => this.$refs[prevRef][0].focus());
       },
       showBlurTask(parent, child) {
         let refs = Object.keys(this.$refs).filter(key => key.indexOf('inputField') === 0).sort();
         let i = refs.indexOf(this.ref(parent, child));
         i = Math.max(i, 0);
         let prevRef = refs[i];
         child > -1 ? this.taskList[parent].children[child].blurred = !this.taskList[parent].children[child].blurred : this.taskList[parent].blurred = !this.taskList[parent].blurred;
         this.$nextTick(() => this.$refs[prevRef][0].focus());
       },
                          tabPress(index, value, event) { //Check if shift is pressed and add/decrease margin
                            // if(event.shiftKey) {
                            //   this.taskList[index].indent -= 1;
                            // } else {
                            //   // this.taskList[index].indent += 1;
                            //   this.taskList[]
                            // }
                          },
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
