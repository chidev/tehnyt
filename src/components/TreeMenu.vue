<template>
  <div>
   <div class="tree-menu">
    <div class="label-wrapper" @click="toggleChildren">
      <div :style="indent" :class="labelClasses">
        <i v-if="nodes" class="fa" :class="iconClasses"></i>
        {{ label }}
      </div>
    </div>
    <tree-menu 
      v-if="showChildren"
      v-for="node in nodes" 
      :nodes="node.nodes" 
      :label="node.label"
      :depth="depth + 1"   
    >
    </tree-menu>
  </div>
</div>
</template>
<script>
  export default { 
    data() {
     return {
       showChildren: false
     }
   },
   template: '#tree-menu',
   props: [ 'label', 'nodes', 'depth' ],
   name: 'tree-menu',
   computed: {
    iconClasses() {
      return {
        'fa-plus-square-o': !this.showChildren,
        'fa-minus-square-o': this.showChildren
      }
    },
    labelClasses() {
      return { 'has-children': this.nodes }
    },
    indent() {
      return { transform: `translate(${this.depth * 50}px)` }
    }
  },
  methods: {
    toggleChildren() {
       this.showChildren = !this.showChildren;
    }
  }
}
</script>

<style scoped>
body {
  font-family: "Open Sans", sans-serif;
  font-size: 18px;
  font-weight: 300;
  line-height: 1em;
}

.container {
  width: 300px;
  margin: 0 auto;
}

.tree-menu {
  .label-wrapper {
    padding-bottom: 10px;
    margin-bottom: 10px;
    border-bottom: 1px solid #ccc;
    .has-children {
      cursor: pointer;
    }
  }
}
</style>