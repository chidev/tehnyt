<template>
  <div class="container is-fluid">
    <div class="columns">
      <div class="column">
        <div class="button" @click="addTasks()">Add tasks</div>
       <div class="button" @click="checkThings">Check things</div>
      </div>

      <div class="column">
        Show future tasks
        <br>
        <b-switch v-model="showFuture" true-value="Yes" false-value="No">{{ showFuture }}</b-switch>
      </div>
      <div class="column">
        Show completed tasks
        <b-switch v-model="showDone" true-value="Yes" false-value="No">{{ showDone }}</b-switch>
      </div>
      <div class="column">
        Show NextActions only
        <b-switch v-model="showOnlyNext" true-value="Yes" false-value="No">{{ showOnlyNext }}</b-switch>
      </div>
      <div class="column">
        Batch edit
        <br>
        <b-switch v-model="batchEdit" true-value="On" false-value="Off">{{ batchEdit }}</b-switch>
      </div>
    </div>
    <div class="columns">
      <div class="column"></div>
      <div class="column">Task</div>
      <div class="column">Start-date</div>
      <div class="column">Due-date</div>
      <div class="column">Tags</div>
      <div class="column">Importance</div>
    </div>

 <!-- <transition-group type="transition" :name="!drag ? 'flip-list' : null"> -->
   <!-- <virtual-list :size="48" :remain="8" :bench="16"> -->
     <!-- <draggable  v-model="taskListWithImportance"  v-bind="dragOptions" @change="changedSortOrder" @start="drag = true"
@end="drag = false"> -->
    <div class="columns" v-for="(task, index) in taskListWithImportance" :key="task.id">
      <div
        class="box is-paddingless is-flex"
        :style="'margin-left: ' + task.indent * 20 + 'px; flex-grow: 1'"
      >
        <!-- <div class="column">
          <tehnytShowIcon v-if="batchEdit == 'On'" :task="task"></tehnytShowIcon>-->
          <tehnytDeleteTask @deleteTask="deleteTask(task.id, 'trashcan')"></tehnytDeleteTask>
        <!--</div>
        <b-field class="column is-two-fifths">-->
          <!-- <tehnytForceNextAction @clickedNext="clickedNext(task.id)" :task="task"></tehnytForceNextAction> -->
          <!-- <tehnytFlag @clickedFlag="clickedFlag(task.id)" :task="task"></tehnytFlag> -->
          <!-- <tehnytcompleteChildren
            @completeChildren="completeChildren(task.taskIndexInMainList)"
            :task="task"
          ></tehnytcompleteChildren> -->
          {{task.taskName}}
          <!-- <tehnytShowNameInput
            :ref="'inputField' + index"
            :index="task.taskIndexInMainList"
            @setActiveTask="setActiveTask(task.id)"
            @tabPress="tabPress"
            @inputWasFocused="inputWasFocused"
            @arrowPress="arrowPress"
            @pressedEsc="pressedEsc"
            @pressedEnter="pressedEnter"
            @deleteTask="deleteTask"
            @deleteKeyUp="fliphasBeenStopped"
            @taskBlurred="taskBlurred"
          ></tehnytShowNameInput> -->
          {{taskListWithImportance[index].taskName}}
          <!-- <tehnytShowJustName :taskname="task.taskName" @setActivateThisFieldIndex="setActivateThisFieldIndex(index)"></tehnytShowJustName> -->
        <!-- </b-field> -->

        <!-- <div class="column">-->
          <!-- <tehnytStartDate :task="task"></tehnytStartDate> -->
        <!--</div>
        <div class="column">
          <tehnytDueDate :task="task"></tehnytDueDate>
        </div>-->

        <!-- <div class="column"> -->
          <!-- <tehnytChangeTags :task="task" :tagList="tagList" @addTagsToTagList="addTagsToTagList"></tehnytChangeTags> -->

          <!-- <template v-slot:no-data>
      <v-list-tile>
        <v-list-tile-content>
          <v-list-tile-title>
            No results matching "<strong>{{ search }}</strong>". Press <kbd>enter</kbd> to create a new one
          </v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
          </template>-->
          <!-- </v-combobox> -->
        <!-- </div> -->
        <!-- <div class="column">{{task.importance}}</div> -->
      </div>
    </div>
    <!-- </draggable> -->
    <!-- </virtual-list> -->
 <!-- </transition-group> -->

    <!-- Importance: {{taskListWithImportance[0].flagged}} -->
    Tasklist:
    <pre>{{taskList}}</pre>
    <br>Filtered:
    <pre>{{filteredTaskList}}</pre>
    <br>Importance:
    <pre>{{taskListWithImportance}}</pre>
    <br>
  </div>
</template>

<script>
// import virtualList from 'vue-virtual-scroll-list'
import moment from "moment";
// import draggable from "vuedraggable";
import tehnytShowIcon from "./ListTasks/tehnytShowIcon.vue";
import tehnytDeleteTask from "./ListTasks/tehnytDeleteTask.vue";
import tehnytForceNextAction from "./ListTasks/tehnytForceNextAction.vue";
import tehnytFlag from "./ListTasks/tehnytFlag.vue";
import tehnytcompleteChildren from "./ListTasks/tehnytcompleteChildren.vue";
import tehnytTaskName from "./ListTasks/tehnytTaskName.vue";
import tehnytStartDate from "./ListTasks/tehnytStartDate.vue";
import tehnytDueDate from "./ListTasks/tehnytDueDate.vue";
import tehnytShowNameInput from "./ListTasks/tehnytShowNameInput.vue";
import tehnytShowJustName from "./ListTasks/tehnytShowJustName.vue";
import tehnytChangeTags from "./ListTasks/tehnytChangeTags.vue";
import { mapGetters } from "vuex";
import { mapMutations } from "vuex";

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
    tehnytDueDate,
    tehnytShowNameInput,
    tehnytShowJustName,
    tehnytChangeTags
    // draggable,
    // 'virtual-list': virtualList
  },
  data() {
    return {
      drag: false,
      dialog: false,
      activateThisFieldIndex: -1,
      batchEdit: "Off",
      value: 2,
      showTagEditor: false,
      showOnlyNext: "No",
      showFuture: "No",
      showDone: "No",
      temporaryEdit: "",
      tasksDeleted: false,
      hasBeenStopped: false,
      subArea: ["hej"],
      newTaskIndexInFullList: "",
      tagList: [
        "Evening",
        "Family",
        "Friends",
        "Hello",
        "Home",
        "Outside",
        "Work"
      ],
      templateTask: {
        taskName: "",
        indent: 0,
        done: false,
        startDate: null,
        dueDate: null,
        flagged: false,
        forceNext: false,
        isNext: false,
        notDroppable: false,
        tags: [],
        importance: 0,
        id: 99,
        taskIndexInMainList: null
      }
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
    taskListWithImportance: {
      get() {
        // Calculate importance per task
        return this.filteredTaskList.map(x => ({
          ...x,
          importance: this.calculateImportance(x),
          taskIndexInMainList: this.getMainListIndexFromId(x.id)
        }));
      },
      set(val) {
        // Update task name based on input
        // let indexInMainList = this.getMainListIndexFromId(
        //   this.filteredTaskList[val.index].id
        // );

        this.taskList[val.taskIndexInMainList].taskName = val.value;

      }
    },
    // taskListWasChanged() {
    //   return [
    //     this.taskList.reduce((a, { indent }) => a + indent, 0),
    //     this.taskList.filter(item => item.done == false).length
    //   ]; // if a task is indented or done/undone then is true
    // },
    ...mapGetters(["taskList"]),
    newId() {
      return this.taskList.length == 0
        ? 1
        : Math.max(...this.taskList.map(r => r.id)) + 1;
    },
    filteredTaskList() {
      const theFilteredOutcome = this.taskList.filter(task => {
        let shouldBeZeroForTrue = 0;
        if (this.showFuture === "No") {
          if (task.startDate == null) {
            shouldBeZeroForTrue = shouldBeZeroForTrue + task.startDate ? 1 : 0; // Empty start date should be shown
          } else {
            shouldBeZeroForTrue =
              shouldBeZeroForTrue +
              (moment(task.startDate).isBefore() !== true); // Future start date
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
        // If there are no tasks, then create a new one
        return [
          {
            ...this.templateTask
          }
        ];
      }
    }
  },
  methods: {
    checkThings() {
      console.log(this.taskList);
      // this.dialog = true
    },
    addTasks() {
      for (let i = 0; i < 500; i++) {
        this.taskList.push({ ...this.templateTask });
        this.taskList[this.taskList.length - 1].taskName =
          Math.max(...this.taskList.map(r => r.id)) + 1;
        this.taskList[this.taskList.length - 1].id =
          Math.max(...this.taskList.map(r => r.id)) + 1;
      }
    },
    ...mapMutations(["SET_ACTIVE_TASK", "UPDATE_A_TASK", "UPDATE_WHOLE_LIST"]),
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
        changedSortOrder(movedInfo){
this.UPDATE_WHOLE_LIST(this.moveItemInArrayFromIndexToIndex(this.taskList, movedInfo.moved.oldIndex, movedInfo.moved.newIndex))
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
    droppedOnTask(droppedOn, droppedTask){
      console.log("Dropped on: " + droppedOn + ", Dropped task: " + droppedTask)
       let movedTaskSpan = this.findNextNonChild(this.taskList, this.taskList[droppedTask].id);
      const movedTaskIndent = this.taskList[movedTaskSpan[0]].indent;
      let newBaseIndent = 0;
      if (droppedOn == -1) { // Move to very top
        for (let i = movedTaskSpan[0]; i < movedTaskSpan[1]; i++) { //Indent all tasks to new level (which in this case is 0)
        //  this.taskList[i].indent = this.taskList[i].indent - movedTaskIndent + newBaseIndent;
         this.UPDATE_A_TASK(i, "indent", this.taskList[i].indent - movedTaskIndent + newBaseIndent)
       }
       for (let i = 0; i < (movedTaskSpan[1] - movedTaskSpan[0]); i++) {
        this.UPDATE_WHOLE_LIST(this.moveItemInArrayFromIndexToIndex(this.taskList, movedTaskSpan[0] + i, 0 + i));
      }
      this.draggedEnter = -1;
      this.betweenEnter = -1;
      droppedOn = 0;
      return
    } 
    newBaseIndent = this.taskList[droppedOn].indent;
    this.newTaskIndexInFullList = this.getMainListIndexFromFilteredListIndex(droppedOn);
    if (droppedOn == true) {
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
      if (droppedOn > droppedTask) { //moving down the list
        for (let i = movedTaskSpan[0]; i < movedTaskSpan[1]; i++) {
           this.UPDATE_WHOLE_LIST(this.moveItemInArrayFromIndexToIndex(this.taskList, movedTaskSpan[0], this.newTaskIndexInFullList));
        }
      } else { //moving up the list
        for (let i = 0; i < (movedTaskSpan[1] - movedTaskSpan[0]); i++) {
          this.UPDATE_WHOLE_LIST(this.moveItemInArrayFromIndexToIndex(this.taskList, movedTaskSpan[0] + i, this.newTaskIndexInFullList + i + 1));
        }
      }
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
    recalculateIsNext(indexInMainList, parentToCheck) {
      //parentToCheck used only when mounting
      let recalculateFrom = 0;
      if (parentToCheck > -1) {
        recalculateFrom = parentToCheck;
      } else {
        recalculateFrom = this.findParent(indexInMainList);
      }
      let recalculateTo = this.taskList.length;
      recalculateTo = this.findNextNonChild(
        this.taskList,
        this.taskList[recalculateFrom].id
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
              if (!foundActiveTask) {
                // isNext if there are no previous ones

                for (let y = i; y > recalculateFrom - 1; y--) {
                  // Check that there are no Next in front above
                  if (this.taskList[y].isNext === true) {
                    hasActiveRelatives = true;
                    break;
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
    setActivateThisFieldIndex(index) {
      this.activateThisFieldIndex = index;
      this.$nextTick(() =>
        this.$refs["inputField" + index][0].$children[0].focus()
      );
    },
    setActiveTask(taskId) {
      const index = this.getMainListIndexFromId(taskId);
      this.SET_ACTIVE_TASK(index);
    },
    // setActivateThisFieldIndex(index) {
    // this.activateThisFieldIndex = index;
    // this.$nextTick(() => this.$refs["inputField" + index][0].$children[0].focus());
    // },
    completeChildren(currentTaskIndex) {
      // const currentTaskIndex = this.getMainListIndexFromId(taskId);
      // this.taskList[currentTaskIndex].done = !this.taskList[currentTaskIndex].done;
      if (this.taskList[currentTaskIndex].done == false) {
        let a = this.findNextNonChild(
          this.taskList,
          this.taskList[currentTaskIndex].id
        ); // complete task + children
        for (let i = a[0]; i < a[1]; i++) {
          // this.taskList[i].done = true;
          this.UPDATE_A_TASK([i, "done", true]);
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
        // this.taskList[currentTaskIndex].done = false;
        this.UPDATE_A_TASK([currentTaskIndex, "done", false]);
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
        if (
          // Don't indent first task, nor if difference will be more than one towards parent
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
      this.setActivateThisFieldIndex(value + index);
      this.SET_ACTIVE_TASK(value + indexInMainList);
      // this.$nextTick(() =>
      //   this.$refs["inputField" + (value + index)][0].$el.focus()
      // );
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
        this.setActivateThisFieldIndex(index + 1);
        // this.$nextTick(() =>
        //   this.$refs["inputField" + (index + 1)][0].$el.focus()
        // );
        this.temporaryEdit = "";
        this.taskList[indexInMainList + 1].id = this.newId;
        this.taskList[indexInMainList + 1].indent = this.taskList[
          indexInMainList
        ].indent;
        this.recalculateIsNext(indexInMainList + 1);
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
    for (let q = 0; q < this.taskList.length; q++) {
      // Go through all root tasks and check its nexts
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

<style>
.indent {
  background: green;
  width: 100px;
  border: 1px solid black;
  position: relative;
  margin-left: 10px;
}

/* input[type="text"] {
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
} */

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

.flip-list-move {
  /* transition: transform 0.5s;  Add this back when/if render is quicker as now there is a delay between render and animation*/
}
.no-move {
  transition: transform 0s;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
</style>
