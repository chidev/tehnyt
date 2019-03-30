<template>
<div>
  <!-- <div v-if="!showTagPicker" @click="showTagPicker=true">{{ truncatedTagList }}  </div> -->
      <!-- <v-dialog
      v-model="showTagPicker"
      width=500> -->
                  <v-combobox
    :items="tagList"
    label="Add some tags"
    multiple
    dense
    solo
    auto-select-first
    hide-details
    @input="addTag"
    :value="message"
  >
   <template v-slot:selection="{ item, index }">
      <v-chip v-if="index < 1">
        <span>{{ item }}</span>
      </v-chip>
      <span
        v-if="index === 1"
        class="grey--text caption"
      >(+{{ message.length - 1 }} others)</span>
    </template>
    </v-combobox>
<!-- </v-dialog> -->
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
     const newTag = v[v.length-1].charAt(0).toUpperCase() + v[v.length-1].slice(1); // Tag in input must have first character capitalised to match taglist
     v[v.length-1] = newTag
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
           