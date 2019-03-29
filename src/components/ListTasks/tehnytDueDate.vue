<template>
<div>
  <div v-if="!showDatePicker" @click="showDatePicker=true">{{showRelativeDate}}</div>
<template>
  <div class="text-xs-center">
    <v-dialog
    width=290px
      v-model="showDatePicker"
    >
      <v-date-picker   :value="message" @input="handleInput"></v-date-picker>
      <v-btn @click="setToToday">Today</v-btn>
      <v-btn @click="setToTomorrow">Tomorrow</v-btn>
    </v-dialog>
  </div>
</template>


<!-- <b-field v-else><b-datepicker @input="showDatePicker = false" v-model="task.start"
            :first-day-of-week="1" :date-formatter="(date) => (showRelativeDate(task, 'start'))"   >
            
             <button class="button is-primary"
                @click="task.start = new Date()">
                <b-icon icon="calendar-today"></b-icon>
                <span>Today</span>
            </button>
              <button class="button is-danger"
                @click="task.start = null">
                <b-icon icon="close"></b-icon>
                <span>None</span>
            </button></b-datepicker></b-field> -->

</div>
</template>
<script>
import moment from "moment";
import {mapMutations} from 'vuex';
export default {
    props: ['task']
,
data () {
  return {
 showDatePicker: false
  }
},
computed: {
  showRelativeDate: function () {
          let a;
      if (moment(this.task.dueDate).diff(new Date(), "days") < 7) {
        a = moment(this.task.dueDate)
          .startOf("day")
          .fromNow();
      } else {
        a = moment(this.task.dueDate).format("MMM Do YY");
      }
      if (a == "Invalid date") {
        a = "-";
      }
      return a;
  },
   message : {
      get() {
        return this.task.dueDate
      }, set(v) {
        // this.task.taskName=v   
        this.UPDATE_A_TASK([this.task.taskIndexInMainList, 'dueDate', v])
      }
    }
  // stringedDate: function () {
  //   return this.task.start.toISOString().substr(0, 10)
  // }
},
methods: {
                ...mapMutations([
'UPDATE_A_TASK'
    ]),
    handleInput (v) {
      // v => message = v
     this.message = v
      this.showDatePicker = false
    },
   setToToday () {
// this.task.dueDate = new Date().toISOString().substr(0, 10)
        this.UPDATE_A_TASK([this.task.taskIndexInMainList, 'dueDate', new Date().toISOString().substr(0, 10)])
this.showDatePicker = false
      },
         setToTomorrow () {
// this.task.dueDate = moment(new Date()).add(1, 'days').toISOString().substr(0, 10)
this.UPDATE_A_TASK([this.task.taskIndexInMainList, 'dueDate', moment(new Date()).add(1, 'days').toISOString().substr(0, 10)])
this.showDatePicker = false
      }
}
//   showRelativeDate(task, type) {
//       let a;
//       if (moment(task[type]).diff(new Date(), "days") < 7) {
//         a = moment(task[type])
//           .endOf("day")
//           .fromNow();
//       } else {
//         a = moment(task[type]).format("MMM Do YY");
//       }
//       if (a == "Invalid date") {
//         a = "-";
//       }
//       return a;
//     },
// }
}
</script>
           