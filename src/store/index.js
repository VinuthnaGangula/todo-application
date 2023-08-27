import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

const getDefaultState = () => {
    return {
      name: "Vinu",
      index: null,
      task_list: null
    }
};

export default new Vuex.Store({
    state: {
      name: "Vinu",
      index: null,
      task_list: null
    },
    mutations: {
      updateName(state, newName) {
        state.name = newName;
      },
      updateIndex(state, newIndex) {
        state.index = newIndex;
      },
      updateTaskList(state, newList) {
        state.task_list = newList;
      },
      resetState(state) {
        Object.assign(state, getDefaultState());
      }
    },
    actions: {
      changeName({commit}, newName) {
        commit('updateName', newName);
      },
      changeIndex({commit}, newIndex) {
        commit('updateIndex', newIndex);
      },
      changeTaskList({commit}, newList) {
        commit('updateTaskList', newList);
      },
      cleanVuex ({ commit }) {
        commit('resetState');
      }
    },
    modules: {

    },
	plugins: [ createPersistedState() ]
});
