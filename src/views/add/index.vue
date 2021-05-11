<template>
  <div>
    <el-button @click="increment(1)">++</el-button>
    data:{{ data }}
    d2: {{d2}}
    <el-button @click="decrement(1)">--</el-button>

    <el-button @click="actIncrement(3)">action++</el-button>

  </div>
</template>

<script>
import { mapState,mapMutations,mapActions,mapGetters } from 'vuex'
export default {
  data() {
    return {
      // data: 0,
    };
  },
  computed: {
    ...mapState(['data']),
    ...mapGetters(['d2'])
  },
  methods: {
    ...mapMutations(['increment', 'decrement']),
    ...mapActions(['actIncrement'])
  },
};
</script>

<style lang="scss" scoped>
</style>