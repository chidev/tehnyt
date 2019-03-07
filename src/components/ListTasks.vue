<template>
  <div>
    <div class="columns">
      <div class="column">Show future tasks
        <div class="field">
          <b-switch v-model="showFuture" true-value="Yes" false-value="No">{{ showFuture }}</b-switch>
        </div>
      </div>
      <div class="column">Show completed tasks
        <div class="field">
          <b-switch v-model="showDone" true-value="Yes" false-value="No">{{ showDone }}</b-switch>
        </div>
      </div>
      <div class="column">Show NextActions only
        <div class="field">
          <b-switch v-model="showOnlyNext" true-value="Yes" false-value="No">{{ showOnlyNext }}</b-switch>
        </div>
      </div>
      <div class="column">Batch edit
        <div class="field">
          <b-switch v-model="batchEdit" true-value="On" false-value="Off">{{ batchEdit }}</b-switch>
        </div>
      </div>
    </div>
    <div class="columns subtitle">
      <div class="column is-narrow is-invisible">
        <span class="icon">
          <i class="fas fa-trash-alt"></i>
        </span>
      </div>
      <div class="column column is-two-fifths">Task</div>
      <div class="column">Start-date</div>
      <div class="column">Due-date</div>
      <div class="column">Tags</div>
      <div class="column">Importance</div>
    </div>
    <div v-for="(task, index) in filteredTaskList" class="columns" :key="task.id">
      <div class="column is-narrow">
        <div v-if="index==0" class="dropBetweenTask"></div>
        <span class="icon">
          <tehnytShowIcon v-if="batchEdit == 'On'" :task="task"></tehnytShowIcon>
          <tehnytDeleteTask @deleteTask="deleteTask(task.id, 'trashcan')"></tehnytDeleteTask>
        </span>
      </div>
      <div class="column is-two-fifths">
        <!-- <template slot="image">
          <div class="column card">{{task.taskName}}</div>
        </template>-->
        <!-- <div class="card"> -->
        <!-- <drop
          v-if="index == 0"
          style="opacity: 0.3"
          @dragenter="dragEnterBetween('first')"
          @dragleave="dragLeaveBetween"
          :class="{'dropBetweenTask': true, 'has-background-success': 'first' == betweenEnter}"
          @drop="droppedOnTask(task.id,-1,false, ...arguments)"
          :ref="'aboveTask' + index"
          class="dropBetweenTask"
        ></drop>-->
        <div class="card" :style="'margin-left: ' + task.indent * 20 + 'px'">
          <!-- <b-field> -->
          <!-- <drag
            @dragstart="dragStart(task.id)"
            @dragend="dragEnd"
            :transfer-data="index"
            :tag="'span'"
          >
            <b-tooltip label="Drag">
              <span class="icon">
                <i class="fas fa-grip-vertical"></i>
              </span>
            </b-tooltip>
          </drag>-->
          <tehnytForceNextAction @clickedNext="clickedNext(task.id)" :task="task"></tehnytForceNextAction>
          <tehnytFlag @clickedFlag="clickedFlag(task.id)" :task="task"></tehnytFlag>
          <tehnytcompleteChildren @completeChildren="completeChildren(task.id)" :task="task"></tehnytcompleteChildren>
          <tehnytTaskName
            :ref="'inputField' + index"
            :task="task"
            :index="index"
            @tabPress="tabPress"
            @inputWasFocused="inputWasFocused"
            @arrowPress="arrowPress"
            @pressedEsc="pressedEsc"
            @pressedEnter="pressedEnter"
            @deleteTask="deleteTask"
            @deleteKeyUp="fliphasBeenStopped"
            @taskBlurred="taskBlurred"
          ></tehnytTaskName>

          <!-- @clicvk="testFunction($event, 'inputEvent')"
           
            @keydown.up.native="arrowPress(task.id, index, -1, ...arguments)"
            @keydown.down="arrowPress(task.id, index, 1, ...arguments)"
            @keydown.esc="pressedEsc(task.id, index, ...arguments)"
            @keydown.enter="pressedEnter(task.id, index, ...arguments)"
            @keydown.delete="deleteTask(task.id, -1, index, $event, ...arguments)"
            @keyup.delete="tasksDeleted = false"
          @blur="taskBlurred(task.id, index, ...arguments)"-->
          <!-- <drop
            v-if="(dragging && !task.notDroppable)"
            :class="{'is-overlay': true, 'has-background-success': index == draggedEnter}"
            @dragenter="dragEnter(index)"
            @dragleave="dragLeave"
            @drop="droppedOnTask(task.id, index, true, ...arguments)"
            style="opacity: 0.3"
          ></drop>-->
          <!-- <div
            v-if="(dragging && task.notDroppable)"
            :class="{'is-overlay': true, 'has-background-grey-lighter': true}"
            style="opacity: 0.3"
          ></div>-->
          <!-- </b-field> -->
        </div>
        <!-- <drop
          v-if="!task.notDroppable"
          style="opacity: 0.3"
          @dragenter="dragEnterBetween(index)"
          @dragleave="dragLeaveBetween"
          :class="{'dropBetweenTask': true, 'has-background-success': index == betweenEnter}"
          @drop="droppedOnTask(task.id, index, false, ...arguments)"
          :ref="'belowTask' + index"
        ></drop>
        <div v-else :ref="'belowTask' + index" class="dropBetweenTask"></div>-->
        <!-- </div> -->
      </div>
      <div class="column">
        <!-- <div v-if="index==0" class="dropBetweenTask"></div> -->
        <!---Adjust vertical alignement -->
        <tehnytStartDate :task="task"></tehnytStartDate>
      </div>
      <div class="column">
        <!-- <div v-if="index==0" class="dropBetweenTask"></div> -->
        <!---Adjust vertical alignement -->
        <tehnytDueDate :task="task"></tehnytDueDate>
      </div>

      <div class="column">
        <!-- <div v-if="index==0" class="dropBetweenTask"></div> -->
        <!---Adjust vertical alignement -->
        <!--     <div @click="showTagEditor = !showTagEditor"> -->
        <!-- <b-field grouped ellipsis> -->
        <!-- Show only 1 tag and then edit cause I don't know how to stop tags from overflowing/wrapping -->
        <!-- <div
            @click="showTagEditorFunction(index)"
            v-for="(tag, tagIndex) in task.tags.slice(0,2)"
            :key="tag"
            class="control"
            style="cursor: pointer;"
        >-->
        <!-- Show first tag and then more-button -->
        <!-- <b-tag v-if="tagIndex === 0" type="is-primary">{{tag}}</b-tag>
            <b-tooltip :label="listTags(task.tags)">
              <b-tag v-if="tagIndex === 1">more...</b-tag>
        </b-tooltip>-->
        <!-- </div>
          <div
            v-if="task.tags.length === 0"
            class="control"
            @click="showTagEditorFunction(index)"
            style="cursor: pointer;"
        >-->
        <!-- If no tags just ask to add -->
        <!-- <b-tag>click to add</b-tag>
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
            @add="addTagsToTagList"
          >></b-taginput>
        </b-field>-->
      </div>
      <div class="column">
        <!-- <div v-if="index==0" class="dropBetweenTask"></div> -->
        <!---Adjust vertical alignement -->
        <!-- {{task.importance}} -->
      </div>
    </div>
    <!-- Original: <div  v-for="(task, index) in taskList" class="columns">
  {{index}} - {{task.taskName}}

    </div>-->
    <button @click="addTasks()">Add tasks</button>
    <button @click="checkThings()">Check things</button>
    <!-- Importance: {{taskListWithImportance[0].flagged}} -->
    Tasklist:
    <pre>{{taskList}}</pre>
    <br>Filtered:
    <pre>{{filteredTaskList}}</pre>
    <br>Importance:
    <!-- <pre>{{taskListWithImportance}}</pre> -->
    <br>
  </div>
</template>

<script>
import moment from "moment";
import tehnytShowIcon from "./tehnytShowIcon.vue";
import tehnytDeleteTask from "./tehnytDeleteTask.vue";
import tehnytForceNextAction from "./tehnytForceNextAction.vue";
import tehnytFlag from "./tehnytFlag.vue";
import tehnytcompleteChildren from "./tehnytcompleteChildren.vue";
import tehnytTaskName from "./tehnytTaskName.vue";
import tehnytStartDate from "./tehnytStartDate.vue";
import tehnytDueDate from "./tehnytDueDate.vue";

export default {
  // updated(){
  // const allEqual = arr => arr.every( v => v === arr[0] )
  // allEqual( [1,1,1,1] )  // true
  // this.taskList = this.filteredTaskList;
  // },
  components: {
    tehnytShowIcon,
    tehnytDeleteTask,
    tehnytForceNextAction,
    tehnytFlag,
    tehnytcompleteChildren,
    tehnytTaskName,
    tehnytStartDate,
    tehnytDueDate
  },
  data() {
    return {
      batchEdit: "Off",
      value: 2,
      showTagEditor: false,
      showOnlyNext: "No",
      showFuture: "No",
      showDone: "No",
      temporaryEdit: "",
      betweenEnter: -1,
      draggedEnter: -1,
      tasksDeleted: false,
      hasBeenStopped: false,
      dragging: false,
      subArea: ["hej"],
      newTaskIndexInFullList: "",
      tagList: ["Family", "Work", "Outside"],
      templateTask: {
        taskName: "",
        indent: 0,
        done: false,
        start: null,
        due: null,
        flagged: false,
        forceNext: false,
        isNext: false,
        notDroppable: false,
        tags: [],
        importance: 0,
        id: 99
      },
      taskList: [
        {
          taskName: "1: flagged and next",
          indent: 0,
          done: false,
          start: new Date("2018-11-10T21:51:40.598Z"),
          due: new Date("2018-11-10T21:51:40.598Z"),
          flagged: false,
          forceNext: true,
          isNext: true,
          notDroppable: false,
          tags: [],
          importance: 0,
          id: 435353245
        },
        {
          taskName: "2: Has flag",
          indent: 0,
          done: false,
          start: new Date("2018-11-10T21:51:40.598Z"),
          due: new Date("2018-11-18T21:51:40.598Z"),
          flagged: true,
          forceNext: false,
          isNext: false,
          notDroppable: false,
          tags: ["Hello"],
          importance: 0,
          id: 245325432543253
        },
        {
          taskName: "3: I have 2 children",
          indent: 0,
          done: false,
          start: new Date("2018-11-10T21:51:40.598Z"),
          due: new Date("2018-11-25T21:51:40.598Z"),
          flagged: false,
          forceNext: false,
          isNext: false,
          notDroppable: false,
          tags: [],
          importance: 0,
          id: 423525435534
        },
        {
          taskName: "3.1 Child uno",
          indent: 1,
          done: false,
          start: new Date("2018-11-10T21:51:40.598Z"),
          due: new Date("2018-11-25T21:51:40.598Z"),
          flagged: false,
          forceNext: false,
          isNext: false,
          notDroppable: false,
          tags: [],
          importance: 0,
          id: 9234823432
        },
        {
          taskName: "3.2 Child due",
          indent: 1,
          done: false,
          start: new Date("2018-11-10T21:51:40.598Z"),
          due: new Date("2018-11-28T21:51:40.598Z"),
          flagged: false,
          forceNext: false,
          isNext: false,
          notDroppable: false,
          tags: [],
          importance: 0,
          id: 92384324832
        },
        {
          taskName: "4. I have 2 children",
          indent: 0,
          done: false,
          start: new Date("2018-11-10T21:51:40.598Z"),
          due: new Date("2018-12-02T21:51:40.598Z"),
          flagged: false,
          forceNext: false,
          isNext: false,
          notDroppable: false,
          tags: [],
          importance: 0,
          id: 235436546456
        },
        {
          taskName: "4.1 Child uno",
          indent: 1,
          done: false,
          start: new Date("2018-11-10T21:51:40.598Z"),
          due: new Date("2018-12-18T21:51:40.598Z"),
          flagged: false,
          forceNext: false,
          isNext: false,
          notDroppable: false,
          tags: ["Work", "Family", "Friends", "Home", "Evening"],
          importance: 0,
          id: 5262562456234
        },
        {
          taskName: "4.2 Child with tags",
          indent: 1,
          done: false,
          start: new Date("2018-11-10T21:51:40.598Z"),
          due: new Date("2019-01-18T21:51:40.598Z"),
          flagged: false,
          forceNext: false,
          isNext: false,
          notDroppable: false,
          tags: ["Work", "Family", "Friends", "Home", "Evening"],
          importance: 0,
          id: 5243549484874
        },
        {
          taskName: "5 indent",
          indent: 0,
          done: false,
          start: new Date("2018-11-10T21:51:40.598Z"),
          due: new Date("2018-11-05T21:51:40.598Z"),
          flagged: false,
          forceNext: false,
          isNext: false,
          notDroppable: false,
          tags: [],
          importance: 0,
          id: 4329324222393
        },
        {
          taskName: "6 Future start",
          indent: 0,
          done: false,
          start: new Date("2019-11-10T21:51:40.598Z"),
          due: new Date("2018-11-05T21:51:40.598Z"),
          flagged: false,
          forceNext: false,
          isNext: false,
          notDroppable: false,
          tags: [],
          importance: 0,
          id: 432932482393
        },
        {
          taskName: "7 done",
          indent: 0,
          done: true,
          start: new Date("2018-11-10T21:51:40.598Z"),
          due: new Date("2018-11-05T21:51:40.598Z"),
          flagged: false,
          forceNext: false,
          isNext: false,
          notDroppable: false,
          tags: [],
          importance: 0,
          id: 432932482333
        }
      ]
    };
  },
//   watch: {
// taskList: function() {
//       for (let q = 0; q < this.taskList.length; q++) { // Go through all root tasks and check its nexts
//       if (this.taskList[q].indent == 0) {
//     this.recalculateIsNext(-9999, q);
//       }
//     }
// }
  // //   taskListWasChanged: {
  // //     handler: function (val, oldVal) {

  // //       this.recalculateIsNext();

  // //     }

  // //   },
  //   taskList: {
  //     handler: function(){
  //     calcimportance()
  //     }
  //   }
  // },
  computed: {
    // taskListWithImportance: function () {
    //   return this.taskList.map(x => {
    //     return {...x, importance: this.calculateImportance(x)}
    //   })
    // },
    // taskListWithImportance: {
    //   get() {
    //     // Calculate importance per task
    //     return this.taskList.map(x => ({
    //       ...x,
    //       importance: this.calculateImportance(x)
    //     }));
    //   },
    //   set(val) {
    //     // Update task name based on input
    //     let indexInMainList = this.getMainListIndexFromId(
    //       this.filteredTaskList[val.index].id
    //     );
    //     this.taskList[indexInMainList].taskName = val.value;
    //   }
    // },
    // taskListWasChanged() {
    //   return [
    //     this.taskList.reduce((a, { indent }) => a + indent, 0),
    //     this.taskList.filter(item => item.done == false).length
    //   ]; // if a task is indented or done/undone then is true
    // },
    newId() {
      return this.taskList.length == 0
        ? 1
        : Math.max(...this.taskList.map(r => r.id)) + 1;
    },
    filteredTaskList() {
      const theFilteredOutcome = this.taskList.filter(task => {
        let shouldBeZeroForTrue = 0;
        if (this.showFuture === "No") {
          if (task.start == null) {
            shouldBeZeroForTrue = shouldBeZeroForTrue + task.start ? 1 : 0; // Empty start date should be shown
          } else {
            shouldBeZeroForTrue =
              shouldBeZeroForTrue + (moment(task.start).isBefore() !== true); // Future start date
          }
        }
        if (this.showDone === "No") {
          shouldBeZeroForTrue = shouldBeZeroForTrue + (task.done == true);
        }
        if (this.showOnlyNext === "Yes") {
          shouldBeZeroForTrue = shouldBeZeroForTrue + (task.isNext == false);
        }
        if (shouldBeZeroForTrue === 0) {
          return true;
        } else {
          return theFilteredOutcome;
        }
      });
      if (theFilteredOutcome.length > 0) {
        return theFilteredOutcome;
      } else {
        return [
          {
            ...this.templateTask
          }
        ];
      }
    }
  },
  methods: {
    checkThings() {},
    addTasks() {
      for (let i = 0; i < 500; i++) {
        this.taskList.push({ ...this.templateTask });
        this.taskList[this.taskList.length - 1].taskName =
          Math.max(...this.taskList.map(r => r.id)) + 1;
        this.taskList[this.taskList.length - 1].id =
          Math.max(...this.taskList.map(r => r.id)) + 1;
      }
    },
    listTags(tags) {
      return tags.slice(1, tags.length).join(", ");
    },
    showTagEditorFunction(index) {
      this.showTagEditor = index;
      this.$nextTick(() => this.$refs["tagField" + index][0].focus());
    },
    calculateImportance(item) {
      let yy = item.indent * 10 + item.flagged;
      return yy;
    },
    addTagsToTagList(newTag) {
      newTag = newTag.charAt(0).toUpperCase() + newTag.slice(1);
      if (this.tagList.indexOf(newTag) === -1) {
        this.tagList.push(newTag);
      }
    },
    clickedFlag(taskId) {
      const indexInMainList = this.getMainListIndexFromId(taskId);
      this.taskList[indexInMainList].flagged = !this.taskList[indexInMainList]
        .flagged;
    },
    clickedNext(taskId) {
      const indexInMainList = this.getMainListIndexFromId(taskId);
      this.taskList[indexInMainList].forceNext = !this.taskList[indexInMainList]
        .forceNext;
      this.recalculateIsNext(indexInMainList);
    },
    deleteTask(taskId, how, index, event) {
      const indexInMainList = this.getMainListIndexFromId(taskId);
      if (how === "trashcan") {
        let a = this.findNextNonChild(this.taskList, taskId);
        this.taskList.splice(indexInMainList, a[1] - a[0]); // Length of task to be deleted taken from child end - child start
      } else {
        if (
          event.target.value.length == 0 &&
          this.hasBeenStopped == false &&
          event.key == "Backspace"
        ) {
          console.log("kom in");
          event.preventDefault();
          // this.hasBeenStopped = true;
        }
        if (event.target.value.length < 1 && this.hasBeenStopped == true) {
          if (index > 0) {
            // If deleting first task then no focus
            // if (this.tasksDeleted == false) {
            this.hasBeenStopped = false;
            this.temporaryEdit = "";
            if (event.key == "Backspace") {
              this.arrowPress(taskId, index, -1, event);
            } else {
              this.arrowPress(taskId, index, 0, event);
            }
            event.preventDefault();

            // }
          }
          // this.taskList.splice(indexInMainList, a[1] - a[0]); // Length of task to be deleted taken from child end - child start
        }
        // if (this.tasksDeleted == true) {
        //   event.preventDefault();
        // }

        // if (this.filteredTaskList[index].taskName.length == "") {this.tasksDeleted = false}
      }
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
    fliphasBeenStopped(event) {
      if (event.target.value.length == 0) {
        this.hasBeenStopped = true;
      }
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
    recalculateIsNext(indexInMainList, parentToCheck) { //parentToCheck used only when mounting
    let recalculateFrom = 0
      if (parentToCheck > -1) {
 recalculateFrom = parentToCheck;
      } else {
    recalculateFrom = this.findParent(indexInMainList);
      }
      let recalculateTo = this.taskList.length;
   recalculateTo = this.findNextNonChild(          this.taskList,          this.taskList[recalculateFrom].id
        )[1];
      if (indexInMainList !== -9999) {
        // -9999 is sent with mount, i.e. recalculate whole list
     
     
      }
      for (let i = recalculateFrom; i < recalculateTo; i++) {
        this.taskList[i].importance = this.taskList[i].indent * 10;
        this.taskList[i].isNext = this.taskList[i].forceNext;
        let hasActiveChildren = false;
        let foundActiveTask = false;
        let hasActiveRelatives = false;
        if (this.taskList[i].done === false) {
          // Only non-done tasks can be next
          if (i !== this.taskList.length - 1) {
            // If last task then don't check for children
            if (this.taskList[i + 1].indent > this.taskList[i].indent) {
              // task has children
              const siblings = this.findNextNonChild(
                this.taskList,
                this.taskList[i + 1].id
              ); // Find start/end of children
              for (let x = siblings[0]; x < siblings[1] + 1; x++) {
                // Check if all children are done
                if (this.taskList[x].done === false) {
                  hasActiveChildren = true;
                  break;
                }
              }
            }
            if (!hasActiveChildren) {
              // No active children and is not first task so let's check if previous tasks have isNext
              for (let x = i; x > -1; x--) {
                if (this.taskList[x].indent !== this.taskList[i].indent) {
                  // Stop for-loop if not sibling
                  break;
                } else {
                  if (this.taskList[x].isNext) {
                    foundActiveTask = true;
                  }
                }
              }
              if (!foundActiveTask) { // isNext if there are no previous ones
              
              for (let y = i; y > recalculateFrom - 1; y--) { // Check that there are no Next in front above
               if (this.taskList[y].isNext === true) {
                 hasActiveRelatives = true;
                 break
               }
              }
              if (!hasActiveRelatives) {
                this.taskList[i].isNext = true;
              }
              } 
              if (this.taskList[i].indent === 0) {
                this.taskList[i].isNext = true;
              } // On first level all will be isNext unless active children
            }
          }
        }
      }
    },
    getMainListIndexFromFilteredListIndex(filteredIndex) {
      for (let i = 0; i < this.taskList.length; i++) {
        // Find index in complete list
        if (this.taskList[i].id == this.filteredTaskList[filteredIndex].id) {
          return i;
        }
      }
    },
    getMainListIndexFromId(id) {
      for (let i = 0; i < this.taskList.length; i++) {
        // Find index in complete list
        if (this.taskList[i].id == id) {
          return i;
        }
      }
    },
    droppedOnTask(taskId, newTaskIndex, onTask, transferData) {
      let movedTaskSpan = this.findNextNonChild(
        this.taskList,
        this.filteredTaskList[transferData].id
      );
      const movedTaskIndent = this.taskList[movedTaskSpan[0]].indent;
      let newBaseIndent = 0;
      if (newTaskIndex == -1) {
        // Move to very top
        for (let i = movedTaskSpan[0]; i < movedTaskSpan[1]; i++) {
          //Indent all tasks to new level (which in this case is 0)
          this.taskList[i].indent =
            this.taskList[i].indent - movedTaskIndent + newBaseIndent;
        }
        for (let i = 0; i < movedTaskSpan[1] - movedTaskSpan[0]; i++) {
          this.taskList = this.moveItemInArrayFromIndexToIndex(
            this.taskList,
            movedTaskSpan[0] + i,
            0 + i
          );
        }
        this.draggedEnter = -1;
        this.betweenEnter = -1;
        newTaskIndex = 0;
        return;
      }
      newBaseIndent = this.filteredTaskList[newTaskIndex].indent;
      this.newTaskIndexInFullList = this.getMainListIndexFromFilteredListIndex(
        newTaskIndex
      );
      if (onTask == true) {
        for (let i = movedTaskSpan[0]; i < movedTaskSpan[1]; i++) {
          //Indent all tasks to new level
          this.taskList[i].indent =
            this.taskList[i].indent - movedTaskIndent + newBaseIndent + 1;
        }
      } else {
        for (let i = movedTaskSpan[0]; i < movedTaskSpan[1]; i++) {
          //Indent all tasks to new level
          this.taskList[i].indent =
            this.taskList[i].indent - movedTaskIndent + newBaseIndent;
        }
      }
      this.draggedEnter = -1;
      this.betweenEnter = -1;
      if (newTaskIndex > transferData) {
        //moving down the list
        for (let i = movedTaskSpan[0]; i < movedTaskSpan[1]; i++) {
          this.taskList = this.moveItemInArrayFromIndexToIndex(
            this.taskList,
            movedTaskSpan[0],
            this.newTaskIndexInFullList
          );
        }
      } else {
        //moving up the list
        for (let i = 0; i < movedTaskSpan[1] - movedTaskSpan[0]; i++) {
          this.taskList = this.moveItemInArrayFromIndexToIndex(
            this.taskList,
            movedTaskSpan[0] + i,
            this.newTaskIndexInFullList + i + 1
          );
        }
      }
    },
    dragStart(taskId) {
      this.dragging = true;
      let a = this.findNextNonChild(this.taskList, taskId);
      for (let i = a[0]; i < a[1]; i++) {
        this.taskList[i].notDroppable = true;
      }
    },
    dragEnd() {
      this.dragging = false;
      for (let i = 0; i < this.taskList.length; i++) {
        this.taskList[i].notDroppable = false;
      }
    },
    showRelativeDate(index, type) {
      let a;
      if (moment(this.taskList[index][type]).diff(new Date(), "days") < 7) {
        a = moment(this.taskList[index][type])
          .endOf("day")
          .fromNow();
      } else {
        a = moment(this.taskList[index][type]).format("MMM Do YY");
      }
      return a;
    },
    completeChildren(taskId) {
      const currentTaskIndex = this.getMainListIndexFromId(taskId);
      // this.taskList[currentTaskIndex].done = !this.taskList[currentTaskIndex].done;
      if (this.taskList[currentTaskIndex].done == false) {
        let a = this.findNextNonChild(this.taskList, taskId); // complete task + children
        for (let i = a[0]; i < a[1]; i++) {
          this.taskList[i].done = true;
        }
        if (
          this.taskList[a[0]].isNext == true &&
          this.taskList[a[0]].indent !== 0
        ) {
          // Make following, active sibling Next
          for (let i = a[1]; this.taskList.length; i++)
            if (this.taskList[a[0]].indent == this.taskList[i].indent) {
              this.taskList[i].isNext = true;
              break;
            }
        }
      } else {
        this.taskList[currentTaskIndex].done = false;
      }
    },
    findNextNonChild(arr, taskId) {
      let startAt = 0;
      startAt = this.getMainListIndexFromId(taskId);
      // debugger
      let indent = arr[startAt].indent;
      if (startAt == arr.length) {
        // Find next child
        return [startAt, startAt];
      } else {
        for (let i = startAt + 1; i < arr.length; i++) {
          if (arr[i].indent <= indent) {
            return [startAt, i];
          }
        }
        return [startAt, arr.length];
      }
    },
    findParent(indexInMainList) {
      let parentTaskIndex = 0;
      // console.log("index: " + indexInMainList)
      for (let i = indexInMainList; i > 0; i--) {
        // console.log("i: " + i)
        // console.log(this.taskList[i].taskName + " indent is " + this.taskList[i].indent)
        if (this.taskList[i].indent == 0) {
          // console.log("Parent is: " + this.taskList[i].taskName)
          parentTaskIndex = i;
          break;
        }
      }
      // console.log("ParentIntex is " + parentTaskIndex)
      return parentTaskIndex;
    },
    tabPress(taskId, event) {
      //Check if shift is pressed and add/decrease margin
      const indexInMainList = this.getMainListIndexFromId(taskId);
      if (event.shiftKey) {
        // Shift pressed, decrease indent
        if (this.taskList[indexInMainList].indent > 0) {
          let a = this.findNextNonChild(
            this.taskList,
            this.taskList[indexInMainList].id
          );
          if (a === undefined) {
            a = this.taskList.length;
          }
          for (let i = a[0]; i < a[1]; i++) {
            this.taskList[i].indent += -1;
          }
          if (indexInMainList + 1 === this.taskList.length) {
            this.taskList[a].indent += -1;
          }
        }
      } else {
        let indentTooDeep = false;
        // Shift wasn't pressed, increase indent
        if ( // Don't indent first task, nor if difference will be more than one towards parent
          indexInMainList !== 0 &&
          this.taskList[indexInMainList].indent + 1 <
            this.taskList[indexInMainList - 1].indent + 2
        ) {
          let a = this.findNextNonChild(
            this.taskList,
            this.taskList[indexInMainList].id
          );
          if (a === undefined) {
            a = this.taskList.length;
          }
          for (let i = a[0]; i < a[1]; i++) {
            // Check that no task gets indeneted beyond a limit
            if (this.taskList[i].indent > 5) {
              indentTooDeep = true;
            }
          }
          if (!indentTooDeep) {
            // Execute indents
            for (let i = a[0]; i < a[1]; i++) {
              this.taskList[i].indent += 1;
            }
            if (indexInMainList + 1 === this.taskList.length) {
              this.taskList[a].indent += 1;
            }
          }
        }
      }
      this.recalculateIsNext(indexInMainList);
    },
    arrowPress(taskId, index, value, el) {
      // Move up/down between inputs
      if (index + value < 0) {
        // If first task, then keep focused
        // this.$nextTick(() => el.target.blur());
        return;
      } else if (index + value >= this.filteredTaskList.length) {
        // If last task, then keep focused
        // this.$nextTick(() => el.target.blur());
        return;
      }
      const indexInMainList = this.getMainListIndexFromId(taskId);
      if (this.temporaryEdit == "" && el.target.value == "") {
        this.taskList.splice(indexInMainList, 1);
        // this.tasksDeleted = true;
      } else if (el.target.value == "") {
        el.target.value = this.temporaryEdit;
      }

      this.temporaryEdit = this.taskList[value + indexInMainList].taskName;
      this.$nextTick(() =>
        this.$refs["inputField" + (value + index)][0].$el.focus()
      );
      this.$nextTick(() => el.target.blur());
    },
    pressedEnter(taskId, index, el) {
      const indexInMainList = this.getMainListIndexFromId(taskId);
      // this.temporaryEdit = "";
      if (el.target.value == "" && this.temporaryEdit == "") {
        this.taskList.splice(indexInMainList, 1);
      } else if (el.target.value == "" && this.temporaryEdit !== "") {
        this.taskList[indexInMainList].taskName = this.temporaryEdit;
        el.target.value = this.temporaryEdit;
        this.$nextTick(() => el.target.blur());
      } else {
        // this.taskList[indexInMainList] = this.filteredTaskList[index];
        this.taskList.splice(indexInMainList + 1, 0, { ...this.templateTask });
        this.$nextTick(() =>
          this.$refs["inputField" + (index + 1)][0].$el.focus()
        );
        this.temporaryEdit = "";
        this.taskList[indexInMainList + 1].id = this.newId;
        this.taskList[indexInMainList + 1].indent = this.taskList[
          indexInMainList
        ].indent;
        this.recalculateIsNext(indexInMainList + 1)
      }
    },
    pressedEsc(taskId, index, el) {
      const indexInMainList = this.getMainListIndexFromId(taskId);
      if (el.target.value == "" && this.temporaryEdit == "") {
        this.taskList.splice(indexInMainList, 1);
      } else {
        // console.log(this.temporaryEdit)
        el.target.value = this.temporaryEdit;
        this.$nextTick(() => el.target.blur());
      }
    },
    inputWasFocused(el) {
      // Blur when focus lost & opposite
      // const indexInMainList = this.getMainListIndexFromId(taskId);
      // this.temporaryEdit = this.taskList[indexInMainList].taskName;
      this.temporaryEdit = el.target.value;
    },
    taskBlurred(taskId, el) {
      // Check if empty task and if so delete it
      const indexInMainList = this.getMainListIndexFromId(taskId);
      if (el.target.value == "" && this.temporaryEdit == "") {
        this.taskList.splice(indexInMainList, 1);
      } else if (el.target.value == "" && !this.temporaryEdit == "") {
        el.target.value = this.temporaryEdit;
      }
      // const indexInMainList = this.getMainListIndexFromId(taskId);
      // if (this.temporaryEdit == "") {
      //   this.taskList.splice(indexInMainList, 1);
      // }
      //         this.taskList[indexInMainList] = this.filteredTaskList[index];

      // this.taskList.forEach((item, index) => {
      //                 item.importance = item.indent * 10 + item.flagged;
      //             })
    }
  },
  beforeMount() {
    for (let q = 0; q < this.taskList.length; q++) { // Go through all root tasks and check its nexts
      if (this.taskList[q].indent == 0) {
    this.recalculateIsNext(-9999, q);
      }
    }

  },
  beforeUpdate() {
    console.log("Render started.");
    console.time();
  },
  updated() {
    console.log("Render took: ");
    console.timeEnd();
  }
};
</script>

<style scoped>
.indent {
  background: green;
  width: 100px;
  border: 1px solid black;
  position: relative;
  margin-left: 10px;
}

input[type="text"] {
  border: none;
  background: transparent;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: red;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5em;
  text-rendering: optimizeLegibility;
  flex-grow: 1;
}

input[type="checkbox"] {
  cursor: pointer;
  width: 1em;
  height: 1em;
  top: 0;
  left: 0;
  background: #eee;
  border: 1px solid #ddd;
  margin-right: 5px;
}

.task {
  /*display: inline-flex;*/
  /*min-width: 25em;*/
  flex: 1;
}

.dropBetweenTask {
  height: 0.5em;
}

.column {
  padding-top: 0rem !important;
  padding-bottom: 0rem !important;
}

.tooltip:not([data-label=""]):hover:before,
.tooltip:not([data-label=""]):hover:after {
  transition-delay: 0.5s;
}
</style>
