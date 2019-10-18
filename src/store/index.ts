import Vue from "vue";
import Vuex from "vuex";
import { createBoard } from "@/services/GameService";

Vue.use(Vuex);

const defaultState = {
  board: createBoard(7, 6, 3)
};

export default new Vuex.Store({
  state: defaultState,
  mutations: {},
  actions: {},
  modules: {}
});
