<template>
    <input type="checkbox" v-model="task.selected">
</template>
<script>
export default {
    props: ['task']
}
</script>