<template>
<div>
  <!-- <div v-if="!showDatePicker" @click="showDatePicker=true">{{showRelativeDate}}</div> -->
    <b-field><b-datepicker @input="handleInput" :value="message"
            :first-day-of-week="1" :date-formatter="(date) => (showRelativeDate(task, 'startDate'))"   >
            
             <button class="button is-primary"
                @click="message = new Date()">
                <b-icon icon="sun"></b-icon>
                <span>Today</span>
            </button>
              <button class="button is-danger"
                @click="message = null">
                <b-icon icon="times"></b-icon>
                <span>None</span>
            </button></b-datepicker></b-field>
  </div>
</template>


    <!-- <v-dialog
    width=290px
      v-model="showDatePicker"
    >
      <v-date-picker   :value="message" @input="handleInput"></v-date-picker>
      <v-btn @click="setToToday">Today</v-btn>
      <v-btn @click="setToTomorrow">Tomorrow</v-btn>
    </v-dialog> -->

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
  // showRelativeDate: function () {
  //         let a;
  //     if (moment(this.task.startDate).diff(new Date(), "days") < 7) {
  //       a = moment(this.task.startDate)
  //         .startOf("day")
  //         .fromNow();
  //     } else {
  //       a = moment(this.task.startDate).format("MMM Do YY");
  //     }
  //     if (a == "Invalid date") {
  //       a = "-";
  //     }
  //     return a;
  // },
   message : {
      get() {
        return this.task.startDate
      }, set(v) {
        // this.task.taskName=v   
        this.UPDATE_A_TASK([this.task.taskIndexInMainList, 'startDate', v])
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
        showRelativeDate(task, type) {
      let a;
      if (moment(task[type]).diff(new Date(), "days") < 7) {
        a = moment(task[type])
          .endOf("day")
          .fromNow();
      } else {
        a = moment(task[type]).format("MMM Do YY");
      }
      return a;
    },
    handleInput (v) {
      // v => message = v
     this.message = v
      this.showDatePicker = false
    },
//    setToToday () {
// // this.task.startDate = new Date().toISOString().substr(0, 10)
//         this.UPDATE_A_TASK([this.task.taskIndexInMainList, 'startDate', new Date().toISOString().substr(0, 10)])
// this.showDatePicker = false
//       },
//          setToTomorrow () {
// // this.task.startDate = moment(new Date()).add(1, 'days').toISOString().substr(0, 10)
// this.UPDATE_A_TASK([this.task.taskIndexInMainList, 'startDate', moment(new Date()).add(1, 'days').toISOString().substr(0, 10)])
// this.showDatePicker = false
//       }
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
           