<template>
    <v-navigation-drawer
    right
    fixed
    app
    clipped
      mobile-break-point="800">
  <v-layout row wrap>
    <v-flex>
            <v-card>
        <v-card-text>
{{taskList[activeTask]}}
</v-card-text>
      </v-card>
    </v-flex>
    <v-flex>
      <v-card>
        <v-card-text>
hej
</v-card-text>
      </v-card>
    </v-flex>
</v-layout>
</v-navigation-drawer>
</template>

<script>
import {mapGetters} from 'vuex';
export default {
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