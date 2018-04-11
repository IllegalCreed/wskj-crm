<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
  </div>
</template>

<script>
// vuex
import { mapActions, mapState, mapGetters } from 'vuex'

export default {
  name: 'HelloWorld',
  data () {
    return {
    }
  },
  mounted () {
    this.hello()
  },
  computed: {
    ...mapGetters({
    }),
    ...mapState({
      msg: state => state.hello.hello
    })
  },
  methods: {
    ...mapActions({
      hello: 'hello'
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
</style>
