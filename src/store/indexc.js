import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    data: 0
  },
  getters: {
    d2(state){
      return state.data*2
    }
  },
  mutations: {
    increment(state, n) {
      state.data+= n
    },
    step2(state, n) {
      state.data += n
    },
    decrement(state, n) {
      state.data-= n
    }
  },
  actions: {
    actIncrement(context, n) {
      setTimeout(() => {
        const {dispatch,commit, state, getters} = context
        commit('increment', n)
        commit('step2', 2)
      }, 500);
      
    }
  },
  modules: {
  }
})
