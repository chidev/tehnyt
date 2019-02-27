<template>
  <div>
    <draggable v-model="taskList" :move="showStuff" :options="{animation:'200'}">
      <div v-if="!task.done" v-for="(task, index) in taskList" :key="task.id" class=columns>
        <div class=column>
          <div class=card :style="'margin-left: ' + task.indent * 20 + 'px'"><input type="checkbox" v-model="taskList[index].done" @change="completeChildren(index)">
            <input v-if="!task.blurred" :ref="'inputField' + index" @keydown.tab.prevent="tabPress(index, 1, $event)" @blur="showBlurTask(index)" @keydown.up="arrowPress(index, -1)" @keydown.down="arrowPress(index, 1)" type="text" v-model="taskList[index].taskName" class="task"1: Ingen indenthej9 days ago>
            <div :ref="'inputField' + index" v-else @click="showBlurTask(index)" class="task">{{ taskList[index].taskName }}</div>
          <div :ref="'greefield' + index" v-model="subArea" class=card style="background: green">hej</div>   
          </div>
      
        </div>

        <div class=column>{{showRelativeDate(index)}}</div>

      </div>
                       
    </draggable>



  </div>
</template>

<script>
  import moment from 'moment';
  import draggable from 'vuedraggable';
  export default {
    components: {
      draggable
    },
    data() {
      return {
       subArea: ["hej"],
       taskList: [{
        taskName: "1: Ingen indent",
        indent: 0,
        blurred: true,
        done: false,
        due: "2018-11-10T21:51:40.598Z",
      },{
        taskName: "2: Ingen indent",
        indent: 0,
        blurred: true,
        done: false,
        due: "2018-11-18T21:51:40.598Z",
      },{
        taskName: "3: I have 2 children",
        indent: 0,
        blurred: true,
        done: false,
        due: "2018-11-25T21:51:40.598Z",
      },{
        taskName: "3.1 Child uno",
        indent: 1,
        blurred: true,
        done: false,
        due: "2018-11-25T21:51:40.598Z",
      },{
        taskName: "3.2 Child due",
        indent: 1,
        blurred: true,
        done: false,
        due: "2018-11-28T21:51:40.598Z",
      },{
        taskName: "4. I have 2 children",
        indent: 0,
        blurred: true,
        done: false,
        due: "2018-12-02T21:51:40.598Z",
      },{
        taskName: "4.1 Child uno",
        indent: 1,
        blurred: true,
        done: false,
        due: "2018-12-18T21:51:40.598Z",
      },{
        taskName: "4.2 Child due",
        indent: 1,
        blurred: true,
        done: false,
        due: "2019-01-18T21:51:40.598Z",
      },{
        taskName: "5 indent",
        indent: 0,
        blurred: true,
        done: false,
        due: "2018-11-05T21:51:40.598Z",
      }
      ]}
    },
    methods: {
      showStuff(evt){
        console.log(evt);
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
        for(let i = startAt; i < arr.length; i++) {
          if (arr[i].indent <= val){
            return i;}   
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
          showBlurTask(index) { // Blur when focus lost & opposite
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
      line-height: 1.5;
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
      display: inline;
    }
  </style>
