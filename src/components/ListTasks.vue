<template>
    <v-content>
            <v-container fluid>
                      <v-layout align-start justify-space-around row>
     <v-flex> <v-btn @click="addTasks()">Add tasks</v-btn>
      <v-btn @click="checkThings">Check things</v-btn></v-flex>


          <v-flex>Show future tasks
            <v-switch
              v-model="showFuture"
              true-value="Yes"
              false-value="No"
              color="green"
            >{{ showFuture }}</v-switch>
          </v-flex>
          <v-flex xs-12>Show completed tasks
            <v-switch
              v-model="showDone"
              true-value="Yes"
              false-value="No"
              color="green"
            >{{ showDone }}</v-switch>
          </v-flex>
          <v-flex xs-12>Show NextActions only
            <v-switch
              v-model="showOnlyNext"
              true-value="Yes"
              false-value="No"
              color="green"
            >{{ showOnlyNext }}</v-switch>
          </v-flex>
          <v-flex xs-12>Batch edit
            <v-switch
              v-model="batchEdit"
              true-value="On"
              false-value="Off"
              color="green"
            >{{ batchEdit }}</v-switch>
          </v-flex>
        </v-layout>
        <v-layout align-center justify-start row>
          <v-flex xs1></v-flex>
          <v-flex xs4>Task</v-flex>
          <v-flex>Start-date</v-flex>
          <v-flex>Due-date</v-flex>
          <v-flex>Tags</v-flex>
          <v-flex>Importance</v-flex>
        </v-layout>
        <v-layout
          align-start
          justify-space-around
          row
          v-for="(task, index) in filteredTaskList"
          :key="task.id"
        >
          <v-flex xs1>
            <!-- <tehnytShowIcon v-if="batchEdit == 'On'" :task="task"></tehnytShowIcon>
            <tehnytDeleteTask @deleteTask="deleteTask(task.id, 'trashcan')"></tehnytDeleteTask> -->
          </v-flex>
          <v-flex xs4>
            <v-card :style="'margin-left: ' + task.indent * 20 + 'px'">
              <v-layout pa-0 mt-1 align-center justify-start row >
                                 <v-icon small>fas fa-grip-vertical</v-icon>
               <tehnytForceNextAction @clickedNext="clickedNext(task.id)" :task="task"></tehnytForceNextAction>
                <tehnytFlag @clickedFlag="clickedFlag(task.id)" :task="task"></tehnytFlag>
                <tehnytcompleteChildren @completeChildren="completeChildren(task.id)" :task="task"></tehnytcompleteChildren>
                <tehnytShowNameInput
                  :ref="'inputField' + index"
                  :task="task"
                  :index="index"
                  @setActivateThisFieldIndex="setActivateThisFieldIndex(index)"
                  @tabPress="tabPress"
                  @inputWasFocused="inputWasFocused"
                  @arrowPress="arrowPress"
                  @pressedEsc="pressedEsc"
                  @pressedEnter="pressedEnter"
                  @deleteTask="deleteTask"
                  @deleteKeyUp="fliphasBeenStopped"
                  @taskBlurred="taskBlurred"
                ></tehnytShowNameInput> 
                <!-- <tehnytShowJustName v-else :taskname="task.taskName" @setActivateThisFieldIndex="setActivateThisFieldIndex(index)"></tehnytShowJustName> -->
              </v-layout  >
            </v-card>
          </v-flex>
          <v-flex>
            <tehnytStartDate :task="task"></tehnytStartDate>
          </v-flex>
          <v-flex>
            <tehnytDueDate :task="task"></tehnytDueDate>
          </v-flex>

          <v-flex>
            <tehnytChangeTags :task=task :tagList=tagList @addTagsToTagList="addTagsToTagList"></tehnytChangeTags>

    <!-- <template v-slot:no-data>
      <v-list-tile>
        <v-list-tile-content>
          <v-list-tile-title>
            No results matching "<strong>{{ search }}</strong>". Press <kbd>enter</kbd> to create a new one
          </v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </template> -->
  <!-- </v-combobox> -->
  </v-flex>
          <v-flex>{{task.importance}}</v-flex>
        </v-layout>
        <!-- Importance: {{taskListWithImportance[0].flagged}} -->
        Tasklist:
        <pre>{{taskList}}</pre>
        <br>Filtered:
        <pre>{{filteredTaskList}}</pre>
        <br>Importance:
        <!-- <pre>{{taskListWithImportance}}</pre> -->
        <br>
      </v-container>
    </v-content>
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
import tehnytShowNameInput from "./tehnytShowNameInput.vue";
import tehnytShowJustName from "./tehnytShowJustName.vue";
import tehnytChangeTags from "./tehnytChangeTags.vue";

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
  },
  data() {
    return {
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
      tagList: ["Family", "Work", "Outside"],
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
        id: 99
      },
      taskList: [
        {
          taskName: "1: flagged and next",
          indent: 0,
          done: false,
          startDate: "2018-11-10",
          dueDate: "2018-11-10",
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
          startDate: "2018-11-10",
          dueDate: "2018-11-18",
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
          startDate: "2018-11-10",
          dueDate: "2018-11-25",
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
          startDate: "2018-11-10",
          dueDate: "2018-11-25",
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
          startDate: "2018-11-10",
          dueDate: "2018-11-28",
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
          startDate: "2018-11-10",
          dueDate: "2018-12-02",
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
          startDate: "2018-11-10",
          dueDate: "2018-12-18",
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
          startDate: "2018-11-10",
          dueDate: "2019-01-18",
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
          startDate: "2018-11-10",
          dueDate: "2018-11-05",
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
          startDate: "2019-11-10",
          dueDate: "2018-11-05",
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
          startDate: "2018-11-10",
          dueDate: "2018-11-05",
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
          if (task.startDate == null) {
            shouldBeZeroForTrue = shouldBeZeroForTrue + task.startDate ? 1 : 0; // Empty start date should be shown
          } else {
            shouldBeZeroForTrue =
              shouldBeZeroForTrue + (moment(task.startDate).isBefore() !== true); // Future start date
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
    checkThings() {
console.log(this.taskList[0].due.toISOString().substr(0, 10))
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
      this.$nextTick(() => this.$refs["inputField" + index][0].$children[0].focus());
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
      console.log("arrow")
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
