<template>
<div>
  <div v-if="!showTagPicker" @click="showTagPicker=true">{{ truncatedTagList }}  </div>
      <v-dialog
      v-model="showTagPicker"
      width=500>
                  <v-combobox
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
    :value="message"
  ></v-combobox>
</v-dialog>
     </div>
</template>
<script>
import {mapMutations} from 'vuex';
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
  },
      message : {
      get() {
        return this.task.tags
      }, set(v) {
        // this.task.taskName=v   
        this.UPDATE_A_TASK([this.task.taskIndexInMainList, 'tags', v])
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
   addTag (v) {
     this.message = v
    this.$emit('addTagsToTagList', v[v.length-1]) 
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
           