<template>
<b-field><b-datepicker v-model="task.due"
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

</template>
<script>
import moment from "moment";
export default {
    props: ['task']
,
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
      return a;
    },
}
}
</script>
           