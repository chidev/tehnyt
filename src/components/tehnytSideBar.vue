<template>
<div style="position: fixed">
{{taskList[activeTask]}}
<hr/>
<draggable v-model="taskList">
   <div v-for="element in taskList" :key="element.id">{{element.taskName}}</div>
</draggable>
</div>
</template>

<script>
import {mapGetters} from 'vuex';
import draggable from 'vuedraggable';
export default {
          components: {
            draggable,
        },
  data() {
    return {
      right: true,
    }
  },
  computed: {
        ...mapGetters([
'taskList',
'activeTask'
    ])
  }
}
</script>