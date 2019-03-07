<template>
<div>
  <div v-if="!showDatePicker" @click="showDatePicker = true">{{showRelativeDate(task, 'due')}}</div>
<b-field v-else><b-datepicker @input="showDatePicker = false" v-model="task.due"
            :first-day-of-week="1" :date-formatter="(date) => (showRelativeDate(task, 'due'))"   >
            
             <button class="button is-primary"
                @click="task.due = new Date()">
                <b-icon icon="calendar-today"></b-icon>
                <span>Today</span>
            </button>
              <button class="button is-danger"
                @click="task.due = null">
                <b-icon icon="close"></b-icon>
                <span>None</span>
            </button></b-datepicker></b-field>

</div>
</template>
<script>
import moment from "moment";
export default {
    props: ['task']
,
data () {
  return {
 showDatePicker: false
  }
},
methods: {
  showRelativeDate(task, type) {
      let a;
      if (moment(task[type]).diff(new Date(), "days") < 7) {
        a = moment(task[type])
          .endOf("day")
          .fromNow();
      } else {
        a = moment(task[type]).format("MMM Do YY");
      }
            if (a == "Invalid date") {
        a = "-";
      }
      return a;
    },
}
}
</script>
           