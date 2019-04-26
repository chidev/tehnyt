<template>
<div>
  <div v-if="!showTagPicker" @click="activateTagPicker">{{ truncatedTagList }}  </div>
      <!-- <v-dialog
      v-model="showTagPicker"
      width=500> -->
       <b-taginput v-else
                :value="message"
                @input="addTag"
                :data="filteredTags"
                size="is-small"
                attached
                ellipsis
                autocomplete
                allow-new
                :open-on-focus="hej"
                icon="label"
                placeholder="Click to add tag(s)"
@blur="blurred"
                :ref="'theTagFieldRef' + task.id"
                @typing="getFilteredTags">
            </b-taginput>
                  <!-- <v-combobox
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
    </v-combobox> -->
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
    hej: true,
 showTagPicker: false,
 filteredTags: this.tagList
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
    activateTagPicker (h) {
      this.showTagPicker=true
                       this.$nextTick(() => {
                         this.$refs["theTagFieldRef" + this.task.id].$el.querySelector('input').focus()
        // this.$refs["theTagFieldRef" + this.task.id].focus()
                       }
      );
                 
    },
   addTag (v) {
     const newTag = v[v.length-1].charAt(0).toUpperCase() + v[v.length-1].slice(1); // Tag in input must have first character capitalised to match taglist
     v[v.length-1] = newTag
     this.message = v
    this.$emit('addTagsToTagList', v[v.length-1]) 
      },
      blurred (v) {
        if (v.explicitOriginalTarget.nodeName !== "A" && v.explicitOriginalTarget.nodeName !== "#text") {
        this.showTagPicker = false
         }
      },
       getFilteredTags(text) {
                this.filteredTags  = this.tagList.filter((option) => {
                    return option
                        .toString()
                        .toLowerCase()
                        .indexOf(text.toLowerCase()) >= 0
                })
            }
}
}
</script>
     
           