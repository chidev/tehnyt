<template>
<div>
  <div v-if="!showTagPicker" @click="showTagPicker=true">{{ truncatedTagList }}  </div>
      <v-dialog
      v-model="showTagPicker"
      width=500>
                  <v-combobox
          v-model="task.tags"
    :items="tagList"
    autofocus
    hide-selected
    label="Add some tags"
    multiple
    small-chips
    deletable-chips
    dense
    single-line
    solo
    hide-details
    @input="addTag"
  ></v-combobox>
</v-dialog>
     </div>
</template>
<script>
export default {
    props: ['task', 'tagList']
,
data () {
  return {
 showTagPicker: false
  }
},
computed: {
  truncatedTagList: function () {
          let a = this.task.tags.join(', ');
          if (a.length>15) {
              a = (a.substr(0, 15) + "...")
          } else if (a.length == 0) {
a= "..."
          }
      return a;
  }
  // stringedDate: function () {
  //   return this.task.start.toISOString().substr(0, 10)
  // }
},
methods: {
   addTag () {
    this.$emit('addTagsToTagList', this.task.tags[this.task.tags.length-1]) 
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
           