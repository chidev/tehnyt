<template>
  <div>
    <div v-if="!task.done" v-for="(task, index) in taskList" class="columns">
      <div class="column">
        <drag @dragstart="dragStart(index)" @dragend="dragEnd" class="card is-shadowless" :style="'margin-left: ' + task.indent * 20 + 'px'"  :transfer-data="index">
         <drop v-if="index == 0" style="opacity: 0.3" @dragenter="dragEnterBetween('first')" @dragleave=dragLeaveBetween :class="{'dropBetweenTask': true, 'has-background-success': 'first' == betweenEnter}" @drop="dropped(index -1, ...arguments)" :ref="'aboveTask' + index" class="dropBetweenTask"></drop>   
         <div class="card">
          <input type="checkbox" v-model="taskList[index].done" @change="completeChildren(index)">
          <input v-if="!task.blurred" :ref="'inputField' + index" @keydown.tab.prevent="tabPress(index, 1, $event)" @blur="showBlurTask(index)" @keydown.up="arrowPress(index, -1)" @keydown.down="arrowPress(index, 1)" @keydown.esc="pressedEsc(index)" @keydown.enter="pressedEnter(index)" type="text" v-model="taskList[index].taskName" class="task is-inline-flex">
          <div :ref="'inputField' + index" v-else @click="showBlurTask(index)" class="task is-inline-flex">{{ taskList[index].taskName }}</div>
          <drop v-if="(dragging && !task.notDroppable)" :class="{'is-overlay': true, 'has-background-success': index == draggedEnter}" @dragenter="dragEnter(index)" @dragleave=dragLeave @drop="droppedOnTask(index, ...arguments)" style="opacity: 0.3"></drop>
        </div>
        <drop v-if="!task.notDroppable" style="opacity: 0.3" @dragenter="dragEnterBetween(index)" @dragleave=dragLeaveBetween :class="{'dropBetweenTask': true, 'has-background-success': index == betweenEnter}" @drop="dropped(index, ...arguments)" :ref="'belowTask' + index"></drop>   
        <div v-else :ref="'belowTask' + index" class="dropBetweenTask"></div>   
      </drag>

    </div>

    <div class=column>
      <div v-if="index==0" class="dropBetweenTask"></div> <!---Adjust vertical alignement -->
    {{showRelativeDate(index)}}</div>

  </div>

</div>
</template>

<script>
  import moment from 'moment';
  export default {
    components: {
    },
    data() {
      return {
        temporaryEdit: "",
        betweenEnter: -1,
        draggedEnter: -1,
        dragging: false,
        subArea: ["hej"],
        templateTask: {
          taskName: "",
          indent: 0,
          blurred: true,
          done: false,
          due: "2018-11-10T21:51:40.598Z",
          notDroppable: false
        },
        taskList: [{
          taskName: "1: Ingen indent",
          indent: 0,
          blurred: true,
          done: false,
          due: "2018-11-10T21:51:40.598Z",
          notDroppable: false,
        },{
          taskName: "2: Ingen indent",
          indent: 0,
          blurred: true,
          done: false,
          due: "2018-11-18T21:51:40.598Z",
          notDroppable: false,
        },{
          taskName: "3: I have 2 children",
          indent: 0,
          blurred: true,
          done: false,
          due: "2018-11-25T21:51:40.598Z",
          notDroppable: false,
        },{
          taskName: "3.1 Child uno",
          indent: 1,
          blurred: true,
          done: false,
          due: "2018-11-25T21:51:40.598Z",
          notDroppable: false,
        },{
          taskName: "3.2 Child due",
          indent: 1,
          blurred: true,
          done: false,
          due: "2018-11-28T21:51:40.598Z",
          notDroppable: false,
        },{
          taskName: "4. I have 2 children",
          indent: 0,
          blurred: true,
          done: false,
          due: "2018-12-02T21:51:40.598Z",
          notDroppable: false,
        },{
          taskName: "4.1 Child uno",
          indent: 1,
          blurred: true,
          done: false,
          due: "2018-12-18T21:51:40.598Z",
          notDroppable: false,
        },{
          taskName: "4.2 Child due",
          indent: 1,
          blurred: true,
          done: false,
          due: "2019-01-18T21:51:40.598Z",
          notDroppable: false,
        },{
          taskName: "5 indent",
          indent: 0,
          blurred: true,
          done: false,
          due: "2018-11-05T21:51:40.598Z",
          notDroppable: false,
        }
        ]}
      },
      methods: {
        dragEnter(index){
          this.draggedEnter = index; 
        },
        dragLeave(){
          this.draggedEnter = -1; 
        },
        dragEnterBetween(index){
          this.betweenEnter = index; 
        },
        dragLeaveBetween(){
          this.betweenEnter = -1;
        },
        moveItemInArrayFromIndexToIndex(array, fromIndex, toIndex) {
          if (fromIndex === toIndex) return array;

          const newArray = [...array];

          const target = newArray[fromIndex];
          const inc = toIndex < fromIndex ? -1 : 1;

          for (let i = fromIndex; i !== toIndex; i += inc) {
            newArray[i] = newArray[i + inc];
          }

          newArray[toIndex] = target;

          return newArray;
        },
        dropped(index, transferData) {
          this.draggedEnter = -1; 
          this.betweenEnter = -1; 
          let a = 0
          a = this.findNextNonChild(this.taskList, this.taskList[transferData].indent, transferData + 1) - transferData;
          if(index > transferData) {     
            for (let i = 0 ; i < a; i++) {
              this.taskList = this.moveItemInArrayFromIndexToIndex(this.taskList,transferData,index);
            }}
            else {
              for (let i = 0 ; i < a; i++) {
                this.taskList = this.moveItemInArrayFromIndexToIndex(this.taskList,transferData + i,index + i +1);
              }
            }
          },
          droppedOnTask(index, transferData) {
            let a = 0
            a = this.findNextNonChild(this.taskList, this.taskList[transferData].indent, transferData + 1) - transferData;
            const firstTaskIndent =  this.taskList[transferData].indent;
            const newBaseIndent = this.taskList[index].indent;
            for (let i = transferData ; i < (transferData + a); i++) { //Indent all tasks to new level
              this.taskList[i].indent = this.taskList[i].indent - firstTaskIndent + newBaseIndent + 1;
            }; 

            if(index > transferData) {     
              for (let i = 0 ; i < a; i++) {
                this.taskList = this.moveItemInArrayFromIndexToIndex(this.taskList,transferData,index);
              }}
              else {
                for (let i = 0 ; i < a; i++) {
                  this.taskList = this.moveItemInArrayFromIndexToIndex(this.taskList,transferData + i,index + i +1);
                }
              }
            },
            dragStart(index){
              this.dragging = true;
              let a = this.findNextNonChild(this.taskList, this.taskList[index].indent, index + 1);
              for (let i = index ; i < a; i++) {
                this.taskList[i].notDroppable = true}; 
              },
              dragEnd(){
                this.dragging = false;
                for( let i = 0 ; i < this.taskList.length; i++) {
                  this.taskList[i].notDroppable = false}; 
                },
                showRelativeDate(index){
                  let a;
                  if(moment(this.taskList[index].due).diff(new Date(), 'days') < 7) {
                    a = moment(this.taskList[index].due).endOf('day').fromNow();
                  } else {
                    a = moment(this.taskList[index].due).format("MMM Do YY"); 
                  }
                  return a;
                },
                completeChildren(index) {
                  let a = this.findNextNonChild(this.taskList, this.taskList[index].indent, index + 1);
                  for (let i = index ; i < a; i++) {
                    this.taskList[i].done = true}; 
                  },
                  findNextNonChild(arr, val, startAt) {
                    if (startAt == arr.length) {
                      return startAt
                    } else {
                      for(let i = startAt; i < arr.length; i++) {
                        if (arr[i].indent <= val){
                          return i;} 
                        }
                        return arr.length;  
                      }
                    },
          tabPress(index, value, event) { //Check if shift is pressed and add/decrease margin
            if(event.shiftKey) {
              if (this.taskList[index].indent > 0) {
                let a = this.findNextNonChild(this.taskList, this.taskList[index].indent, index + 1);
                if ( a === undefined) {
                  a = this.taskList.length ;
                }
                for (let i = index ; i < a; i++) {
                  this.taskList[i].indent += -1}; 
                  if ( index + 1 === this.taskList.length ) {
                    this.taskList[a].indent += -1}; 

                  };
                } else {
                  if (this.taskList[index].indent + 1 < this.taskList[index - 1].indent + 2) {
                    let a = this.findNextNonChild(this.taskList, this.taskList[index].indent, index + 1);
                    if ( a === undefined) {
                      a = this.taskList.length;
                    }
                    for (let i = index ; i < a; i++) {
                      this.taskList[i].indent += 1}; 
                      if ( index + 1 === this.taskList.length ) {
                        this.taskList[a].indent += 1}; 
                      }
                    }
                  },
          arrowPress(index, value) { // Move up/down between inputs
            this.taskList[index + value].blurred = !this.taskList[index + value].blurred;
            this.$nextTick(() => this.$refs['inputField'+ (value + index)][0].focus());
          },
                    pressedEnter(index){
                      this.taskList.splice(index + 1, 0, this.templateTask);
            this.showBlurTask(index);
          },
          pressedEsc(index){
            this.taskList[index].taskName = this.temporaryEdit;
            this.showBlurTask(index);
          },
          showBlurTask(index) { // Blur when focus lost & opposite
            this.temporaryEdit = this.taskList[index].taskName;
            this.taskList[index].blurred = !this.taskList[index].blurred;
            this.$nextTick(() => this.$refs['inputField' + index][0].focus());
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

    input[type=text]{
      border: none;
      background: transparent;
      font-family: 'Avenir', Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      color: red;
      font-size: 1rem;
      font-weight: 400;
      line-height: 1.5em;
      text-rendering: optimizeLegibility;

    }

    input[type=checkbox]{
      cursor: pointer;
      width: 1em;
      height: 1em;
      top: 0;
      left: 0;
      background: #eee;
      border:1px solid #ddd;;
      margin-right: 5px;
    }

    .task{
      /*display: inline-flex;*/
      min-width: 10em;
      /*float: left;*/
    }

    .dropBetweenTask{
      height: 0.5em; 
    }

    .column{
      padding-top: 0rem !important;
      padding-bottom: 0rem !important;
    }


  </style>
