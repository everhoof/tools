import {
  actionTree, getAccessorType, getterTree, mutationTree,
} from 'typed-vuex';
import { Context } from '@nuxt/types';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/explicit-function-return-type
export const state = () => ({
  now: 0 as number,
});

export type RootState = ReturnType<typeof state>;

export const mutations = mutationTree(state, {
  SET_NOW: (_state, payload: number) => (_state.now = payload),
});

export const getters = getterTree(state, {});

export const actions = actionTree(
  { state, getters, mutations },
  {
    nuxtServerInit({ commit }, _context: Context): void {
      commit('SET_NOW', Date.now());
    },

    nuxtClientInit({ commit }, _context): void {
      commit('SET_NOW', Date.now());
      setInterval(() => commit('SET_NOW', Date.now()), 1000);
    },
  },
);

export const accessorType = getAccessorType({
  state,
  actions,
  mutations,
});
