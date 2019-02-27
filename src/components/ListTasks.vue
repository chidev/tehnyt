<template>
  <div>
    <div class="columns">
      <div class="column">
        Show future tasks
        <div class="field">
          <b-switch v-model="showFuture"
          true-value="Yes"
          false-value="No">
          {{ showFuture }}
        </b-switch>
      </div>
    </div>
    <div class="column">
      Show completed tasks
      <div class="field">
        <b-switch v-model="showDone"
        true-value="Yes"
        false-value="No">
        {{ showDone }}
      </b-switch>
    </div>
  </div>
  <div class="column">
    Show NextActions only
    <div class="field">
      <b-switch v-model="showOnlyNext"
      true-value="Yes"
      false-value="No">
      {{ showOnlyNext }}
    </b-switch>
  </div>
</div>
</div>
<div class="columns subtitle">
  <div class="column is-narrow is-invisible"><span class="icon"><i class="fas fa-trash-alt"></i></span></div>
  <div class="column column is-two-fifths">Task</div>
  <div class="column">Due-date</div>
  <div class="column">Start-date</div>
  <div class="column">Tags</div>
  <div class="column">Importance</div>
</div>
<div  v-for="(task, index) in filteredTaskList" class="columns" :key="task.id">
  <div class="column is-narrow"><div v-if="index==0" class="dropBetweenTask"></div>    <span class="icon"><i @click="deleteTask(task.id)" class="fas fa-trash-alt"></i></span>  </div>
  <div class="column is-two-fifths">
    <drag @dragstart="dragStart(task.id)" @dragend="dragEnd" class="card is-shadowless" :style="'margin-left: ' + task.indent * 20 + 'px'"  :transfer-data="index"><template slot="image"><div class="column card">{{task.taskName}}</div> </template>

      <drop v-if="index == 0" style="opacity: 0.3" @dragenter="dragEnterBetween('first')" @dragleave=dragLeaveBetween :class="{'dropBetweenTask': true, 'has-background-success': 'first' == betweenEnter}" @drop="droppedOnTask(task.id,-1,false, ...arguments)" :ref="'aboveTask' + index" class="dropBetweenTask"></drop>   

      <div class="card">
        <b-tooltip label="Force Next Action"><span class="icon"><i @click="clickedNext(task.id)" :class="['fas fa-long-arrow-alt-right ',{'has-text-success': task.isNext},{'has-text-grey-lighter': !task.isNext},{'has-text-danger': task.forceNext}]"></i></span></b-tooltip>
        <b-tooltip label="Toggle flag"><span class="icon"><i @click="task.flagged = !task.flagged" :class="['fas fa-flag',{'has-text-danger': task.flagged }]"></i></span></b-tooltip>
        <input type="checkbox" v-model="task.done" @change="completeChildren(task.id)">
        <input :ref="'inputField' + index" @click="inputWasFocused(task.id)" @keydown.tab.prevent="tabPress(task.id, 1, $event)" @keydown.up="arrowPress(task.id, index, -1, ...arguments)" @keydown.down="arrowPress(task.id, index, 1, ...arguments)" @keydown.esc="pressedEsc(task.id, index, ...arguments)" @keydown.enter="pressedEnter(task.id, index, ...arguments)" type="text" v-model="task.taskName" class="task is-inline-flex">
        <drop v-if="(dragging && !task.notDroppable)" :class="{'is-overlay': true, 'has-background-success': index == draggedEnter}" @dragenter="dragEnter(index)" @dragleave=dragLeave @drop="droppedOnTask(task.id, index, true, ...arguments)" style="opacity: 0.3"></drop>
        <div v-if="(dragging && task.notDroppable)" :class="{'is-overlay': true, 'has-background-grey-lighter': true}" style="opacity: 0.3"></div>
      </div>
      <drop v-if="!task.notDroppable" style="opacity: 0.3" @dragenter="dragEnterBetween(index)" @dragleave=dragLeaveBetween :class="{'dropBetweenTask': true, 'has-background-success': index == betweenEnter}" @drop="droppedOnTask(task.id, index, false, ...arguments)" :ref="'belowTask' + index"></drop>   
      <div v-else :ref="'belowTask' + index" class="dropBetweenTask"></div> 
    </drag>


  </div>

  <div class=column>
    <div v-if="index==0" class="dropBetweenTask"></div> <!---Adjust vertical alignement -->
  {{showRelativeDate(index,"due")}}</div>
  <div class=column>
    <div v-if="index==0" class="dropBetweenTask"></div> <!---Adjust vertical alignement -->
  {{showRelativeDate(index,"start")}}</div>
  <div class="column">
    <div v-if="index==0" class="dropBetweenTask"></div> <!---Adjust vertical alignement -->
    <!--     <div @click="showTagEditor = !showTagEditor"> -->

      <b-field grouped ellipsis> <!-- Show only 1 tag and then edit cause I don't know how to stop tags from overflowing/wrapping -->
        <div @click="showTagEditorFunction(index)" v-for="(tag, tagIndex) in task.tags.slice(0,2)" class="control" style="cursor: pointer;"> <!-- Show first tag and then more-button -->
          <b-tag v-if="tagIndex === 0" type="is-primary">{{tag}}</b-tag>
          <b-tooltip :label="listTags(task.tags)">
            <b-tag v-if="tagIndex === 1">more...</b-tag>
          </b-tooltip>
          <!-- <b-tag v-if="task.tags.length === 1">edit...</b-tag> -->
        </div>
        <div v-if="task.tags.length === 0" class="control"  @click="showTagEditorFunction(index)" style="cursor: pointer;"> <!-- If no tags just ask to add -->
         <b-tag>click to add</b-tag>
       </div>
     </b-field>
     <b-field ellipsis>
       <b-taginput
       :ref="'tagField' + index"
       v-if="showTagEditor === index"
       autocomplete
       allow-new
       v-model="task.tags"
       :data="tagList"
       ellipsis
       size="is-small"
       icon="label"
       placeholder="Tags"
       @add="addTagsToTagList">>
     </b-taginput>
   </b-field>

 </div>
 <div class=column>
  <div v-if="index==0" class="dropBetweenTask"></div> <!---Adjust vertical alignement -->
{{task.importance}}</div>

</div>
{{filteredTaskList}}
</div>



</template>

<script>
  import moment from 'moment';
  export default {
    // updated(){
// const allEqual = arr => arr.every( v => v === arr[0] )
// allEqual( [1,1,1,1] )  // true
      // this.taskList = this.filteredTaskList;
    //   console.log("hej")
    // },
    components: {},
    data() {
      return {
        showTagEditor: false,
        showOnlyNext: "No",
        showFuture: "No",
        showDone: "No",
        temporaryEdit: "",
        betweenEnter: -1,
        draggedEnter: -1,
        dragging: false,
        subArea: ["hej"],
        newTaskIndexInFullList: "",
        tagList: ["Family","Work","Outside"],
        templateTask: {
          taskName: "",
          indent: 0,
          done: false,
          start: "2018-11-10T21:51:40.598Z",
          due: "2018-11-10T21:51:40.598Z",
          flagged: false,
          forceNext: false,
          isNext: false,
          notDroppable: false,
          tags: [],
          id: "",
        },
        taskList: [{
          taskName: "1: flagged and next",
          indent: 0,
          done: false,
          start: "2018-11-10T21:51:40.598Z",
          due: "2018-11-10T21:51:40.598Z",
          flagged: false,
          forceNext: true,
          isNext: true,
          notDroppable: false,
          tags: [],
          id: 435353245,
        }, {
          taskName: "2: Has flag",
          indent: 0,
          done: false,
          start: "2018-11-10T21:51:40.598Z",
          due: "2018-11-18T21:51:40.598Z",
          flagged: true,
          forceNext: false,
          isNext: false,
          notDroppable: false,
          tags: ["Hello"],
          id: 245325432543253,
        }, {
          taskName: "3: I have 2 children",
          indent: 0,
          done: false,
          start: "2018-11-10T21:51:40.598Z",
          due: "2018-11-25T21:51:40.598Z",
          flagged: false,
          forceNext: false,
          isNext: false,
          notDroppable: false,
          tags: [],
          id: 423525435534
        }, {
          taskName: "3.1 Child uno",
          indent: 1,
          done: false,
          start: "2018-11-10T21:51:40.598Z",
          due: "2018-11-25T21:51:40.598Z",
          flagged: false,
          forceNext: false,
          isNext: false,
          notDroppable: false,
          tags: [],
          id: 9234823432,
        }, {
          taskName: "3.2 Child due",
          indent: 1,
          done: false,
          start: "2018-11-10T21:51:40.598Z",
          due: "2018-11-28T21:51:40.598Z",
          flagged: false,
          forceNext: false,
          isNext: false,
          notDroppable: false,
          tags: [],
          id: 92384324832,
        }, {
          taskName: "4. I have 2 children",
          indent: 0,
          done: false,
          start: "2018-11-10T21:51:40.598Z",
          due: "2018-12-02T21:51:40.598Z",
          flagged: false,
          forceNext: false,
          isNext: false,
          notDroppable: false,
          tags: [],
          id: 235436546456,
        }, {
          taskName: "4.1 Child uno",
          indent: 1,
          done: false,
          start: "2018-11-10T21:51:40.598Z",
          due: "2018-12-18T21:51:40.598Z",
          flagged: false,
          forceNext: false,
          isNext: false,
          notDroppable: false,
          tags: ["Work", "Family", "Friends", "Home", "Evening"],
          id: 5262562456234,
        }, {
          taskName: "4.2 Child with tags",
          indent: 1,
          done: false,
          start: "2018-11-10T21:51:40.598Z",
          due: "2019-01-18T21:51:40.598Z",
          flagged: false,
          forceNext: false,
          isNext: false,
          notDroppable: false,
          tags: ["Work", "Family", "Friends", "Home", "Evening"],
          id: 5243549484874,
        }, {
          taskName: "5 indent",
          indent: 0,
          done: false,
          start: "2018-11-10T21:51:40.598Z",
          due: "2018-11-05T21:51:40.598Z",
          flagged: false,
          forceNext: false,
          isNext: false,
          notDroppable: false,
          tags: [],
          id: 4329324222393,
        }, {
          taskName: "6 Future start",
          indent: 0,
          done: false,
          start: "2019-11-10T21:51:40.598Z",
          due: "2018-11-05T21:51:40.598Z",
          flagged: false,
          forceNext: false,
          isNext: false,
          notDroppable: false,
          tags: [],
          id: 432932482393,
        }, {
          taskName: "7 done",
          indent: 0,
          done: true,
          start: "2018-11-10T21:51:40.598Z",
          due: "2018-11-05T21:51:40.598Z",
          flagged: false,
          forceNext: false,
          isNext: false,
          notDroppable: false,
          tags: [],
          id: 432932482333,
        }]
      }
    },
    watch: {
      taskListWasChanged: {
        handler: function (val, oldVal) {

          this.recalculateIsNext();
                           
        }

      }
    },
    computed: {
      taskListWithImportance: function () {
        return this.taskList.map(x => {
          return {...x, importance: this.calculateImportance(x)}
        })
      },
      taskListWasChanged() {
                return [this.taskList.reduce((a, {indent}) => a + indent, 0), this.taskList.filter(item => item.done == false).length] // if a task is indented or done/undone then is true
              },
              newId() {
                return this.taskList.length == 0 ? 1 : Math.max(...this.taskList.map(r => r.id)) + 1
              },
              filteredTaskList() {
                return this.taskListWithImportance.filter(task => {
                  let shouldBeZeroForTrue = 0;
                  if(this.showFuture === "No"){
                    shouldBeZeroForTrue = shouldBeZeroForTrue + (moment(task.start).isBefore() !== true)
                  }
                  if(this.showDone === "No"){
                    shouldBeZeroForTrue = shouldBeZeroForTrue + (task.done == true)
                  }
                  if(this.showOnlyNext === "Yes") {
                    shouldBeZeroForTrue = shouldBeZeroForTrue + (task.isNext == false)
                  }
                  if (shouldBeZeroForTrue === 0) {
                    return true
                  } else {
                    return false
                  }
                })
              },
            },
            methods: {
              listTags(tags){
                return tags.slice(1,tags.length).join(", ");
              },
              showTagEditorFunction(index) {
                this.showTagEditor = index;
                this.$nextTick(() => this.$refs['tagField' + index][0].focus());
              },
              calculateImportance(item) {
                let yy = item.indent * 10;
                return yy
              },
              addTagsToTagList(newTag){
                newTag = newTag.charAt(0).toUpperCase() + newTag.slice(1);
                if(this.tagList.indexOf(newTag) === -1){
                  this.tagList.push(newTag);
                }
              },
              clickedNext(taskId){
               const indexInMainList = this.getMainListIndexFromId(taskId);
               this.taskList[indexInMainList].forceNext = !this.taskList[indexInMainList].forceNext;
               this.recalculateIsNext()
             },
             deleteTask(taskId){
               const indexInMainList = this.getMainListIndexFromId(taskId);
                     let a = this.findNextNonChild(this.taskList, taskId);
     this.taskList.splice(indexInMainList, a[1] - a[0]); // Length of tasks to be deleted taken from child end - child start
             },
             dragEnter(index) {
              this.draggedEnter = index;
            },
            dragLeave() {
              this.draggedEnter = -1;
            },
            dragEnterBetween(index) {
              this.betweenEnter = index;
            },
            dragLeaveBetween() {
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
            recalculateIsNext() {
              {
                this.taskList.forEach((item, index) => {
                  item.isNext = item.forceNext;
                  let hasActiveChildren = false;
                  let foundActiveTask = false
            if (item.done === false ){ // Only non-done tasks can be next
              if (index !== this.taskList.length - 1) { // If last task then don't check for children
               if (this.taskList[index + 1].indent > item.indent) { // task has children
                  const siblings = this.findNextNonChild(this.taskList, this.taskList[index + 1].id); // Find start/end of children
                  for (let i = siblings[0]; i < siblings[1] + 1; i++) {// Check if all children are done
                    if (this.taskList[i].done === false) {
                      hasActiveChildren = true;
                      break
                    }
                  }
                }
                  if (!hasActiveChildren) { // No active children and is not first task so let's check if previous tasks have isNext
                    for (let i = index; i > -1; i--) {
                      if (this.taskList[i].indent !== item.indent) { // Stop for-loop if not sibling
                        break
                      } else {
                        if (this.taskList[i].isNext) {
                          foundActiveTask = true;
                        }
                      }
                    }
                    if (!foundActiveTask) {item.isNext = true;} // isNext if there are no previous ones
                    if (item.indent === 0) {item.isNext = true;} // On first level all will be isNext unless active children
                  }
                }
              }
            }
            )
              }
            },
            getMainListIndexFromFilteredListIndex(filteredIndex) {
      for (let i = 0; i < this.taskList.length; i++) { // Find index in complete list
        if (this.taskList[i].id == this.filteredTaskList[filteredIndex].id) {
          return i;
        }
      }
    },
    getMainListIndexFromId(id) {
      for (let i = 0; i < this.taskList.length; i++) { // Find index in complete list
        if (this.taskList[i].id == id) {
          return i;
        }
      }
    },
    droppedOnTask(taskId, newTaskIndex, onTask, transferData) {
      let movedTaskSpan = this.findNextNonChild(this.taskList, this.filteredTaskList[transferData].id);
      const movedTaskIndent = this.taskList[movedTaskSpan[0]].indent;
      let newBaseIndent = 0;
      if (newTaskIndex == -1) { // Move to very top
        for (let i = movedTaskSpan[0]; i < movedTaskSpan[1]; i++) { //Indent all tasks to new level (which in this case is 0)
         this.taskList[i].indent = this.taskList[i].indent - movedTaskIndent + newBaseIndent;
       }
       for (let i = 0; i < (movedTaskSpan[1] - movedTaskSpan[0]); i++) {
        this.taskList = this.moveItemInArrayFromIndexToIndex(this.taskList, movedTaskSpan[0] + i, 0 + i);
      }
      this.draggedEnter = -1;
      this.betweenEnter = -1;
      newTaskIndex = 0;
      return
    } 
    newBaseIndent = this.filteredTaskList[newTaskIndex].indent;
    this.newTaskIndexInFullList = this.getMainListIndexFromFilteredListIndex(newTaskIndex);
    if (onTask == true) {
        for (let i = movedTaskSpan[0]; i < movedTaskSpan[1]; i++) { //Indent all tasks to new level
          this.taskList[i].indent = this.taskList[i].indent - movedTaskIndent + newBaseIndent + 1;
        }
      } else {
        for (let i = movedTaskSpan[0]; i < movedTaskSpan[1]; i++) { //Indent all tasks to new level
          this.taskList[i].indent = this.taskList[i].indent - movedTaskIndent + newBaseIndent;
        }
      }
      this.draggedEnter = -1;
      this.betweenEnter = -1;
      if (newTaskIndex > transferData) { //moving down the list
        for (let i = movedTaskSpan[0]; i < movedTaskSpan[1]; i++) {
          this.taskList = this.moveItemInArrayFromIndexToIndex(this.taskList, movedTaskSpan[0], this.newTaskIndexInFullList);
        }
      } else { //moving up the list
        for (let i = 0; i < (movedTaskSpan[1] - movedTaskSpan[0]); i++) {
          this.taskList = this.moveItemInArrayFromIndexToIndex(this.taskList, movedTaskSpan[0] + i, this.newTaskIndexInFullList + i + 1);
        }
      }
    },
    dragStart(taskId) {
      this.dragging = true;
      let a = this.findNextNonChild(this.taskList, taskId);
      for (let i = a[0]; i < a[1]; i++) {
        this.taskList[i].notDroppable = true
      }
    },
    dragEnd() {
      this.dragging = false;
      for (let i = 0; i < this.taskList.length; i++) {
        this.taskList[i].notDroppable = false
      }
    },
    showRelativeDate(index, type) {
      let a;
      if (moment(this.taskList[index][type]).diff(new Date(), 'days') < 7) {
        a = moment(this.taskList[index][type]).endOf('day').fromNow();
      } else {
        a = moment(this.taskList[index][type]).format("MMM Do YY");
      }
      return a;
    },
    completeChildren(taskId) {
      const currentTaskIndex = this.getMainListIndexFromId(taskId);
      this.taskList[currentTaskIndex].done = !this.taskList[currentTaskIndex].done;
      let a = this.findNextNonChild(this.taskList, taskId); // complete task + children
      for (let i = a[0]; i < a[1]; i++) {
        this.taskList[i].done = true
      }
      if (this.taskList[a[0]].isNext == true && this.taskList[a[0]].indent !== 0) { // Make following, active sibling Next
        for (let i = a[1]; this.taskList.length; i++)
          if (this.taskList[a[0]].indent == this.taskList[i].indent) {
            this.taskList[i].isNext = true;
            break;
          }
        }
      },
      findNextNonChild(arr, taskId) {
        let startAt = 0;
        startAt = this.getMainListIndexFromId(taskId)
        let indent = arr[startAt].indent;
      if (startAt == arr.length) { // Find next child
        return [startAt, startAt]
      } else {
        for (let i = (startAt + 1); i < arr.length; i++) {
          if (arr[i].indent <= indent) {
            return [startAt, i];
          }
        }
        return [startAt, arr.length];
      }
    },
    tabPress(taskId, value, event) { //Check if shift is pressed and add/decrease margin
      const index = this.getMainListIndexFromId(taskId);
      if (event.shiftKey) { // Shift pressed, decrease indent
        if (this.taskList[index].indent > 0) {
          let a = this.findNextNonChild(this.taskList, this.taskList[index].id);
          if (a === undefined) {
            a = this.taskList.length;
          }
          for (let i = a[0]; i < a[1]; i++) {
            this.taskList[i].indent += -1
          }
          if (index + 1 === this.taskList.length) {
            this.taskList[a].indent += -1
          }

        }
      } else { // Shift wasn't pressed, increase indent
      if (this.taskList[index].indent + 1 < this.taskList[index - 1].indent + 2) {
        let a = this.findNextNonChild(this.taskList, this.taskList[index].id);
        if (a === undefined) {
          a = this.taskList.length;
        }
        for (let i = a[0]; i < a[1]; i++) {
          this.taskList[i].indent += 1
        }
        if (index + 1 === this.taskList.length) {
          this.taskList[a].indent += 1
        }
      }
    }
  },
    arrowPress(taskId, index, value, el) { // Move up/down between inputs
      const indexInMainList = this.getMainListIndexFromId(taskId);
      if (this.temporaryEdit == "" && el.target.value == "") {
        this.taskList.splice(indexInMainList, 1);
      }
              this.taskList[indexInMainList] = this.filteredTaskList[index];
      this.temporaryEdit = this.taskList[value + indexInMainList].taskName;
      this.$nextTick(() => this.$refs['inputField' + (value + index)][0].focus());
      this.$nextTick(() => el.target.blur());
    },
    pressedEnter(taskId, index, el) {
      const indexInMainList = this.getMainListIndexFromId(taskId);
      // this.temporaryEdit = "";
      if (el.target.value == "" && this.temporaryEdit == "") {
        this.taskList.splice(indexInMainList, 1);
      } else if (el.target.value == "" && this.temporaryEdit !== "") {
        this.taskList[indexInMainList].taskName = this.temporaryEdit
        el.target.value = this.temporaryEdit;
        this.$nextTick(() => el.target.blur());
      } else {
        this.taskList[indexInMainList] = this.filteredTaskList[index];
        this.taskList.splice(indexInMainList + 1, 0, { ...this.templateTask});
        this.$nextTick(() => this.$refs['inputField' + (index + 1)][0].focus());
        this.temporaryEdit = "";
        this.taskList[(indexInMainList + 1)].id = this.newId;
        this.taskList[(indexInMainList + 1)].indent = this.taskList[(indexInMainList)].indent;
      }
    },
    pressedEsc(taskId, index, el) {
      const indexInMainList = this.getMainListIndexFromId(taskId);
      if (el.target.value == "") {
        this.taskList.splice(indexInMainList, 1);
      } else {
        // console.log(this.temporaryEdit)
        this.taskList[indexInMainList].taskName = this.temporaryEdit;
        this.$nextTick(() => el.target.blur());
      }
    },
    inputWasFocused(taskId) { // Blur when focus lost & opposite
      const indexInMainList = this.getMainListIndexFromId(taskId);
      this.temporaryEdit = this.taskList[indexInMainList].taskName;
    }
  },
  beforeMount(){
    this.recalculateIsNext()
  },
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
  flex-grow: 1 ;
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
  /*min-width: 25em;*/
flex: 1;
}

.dropBetweenTask{
  height: 0.5em; 
}

.column{
  padding-top: 0rem !important;
  padding-bottom: 0rem !important;
}

.tooltip:not([data-label=""]):hover:before, 
.tooltip:not([data-label=""]):hover:after {
  transition-delay: 0.5s;
}

</style>
