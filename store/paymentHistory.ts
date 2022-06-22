/* eslint no-shadow: ["error", { "allow": ["state"] }] */
/* eslint no-param-reassign: ["error", { "ignorePropertyModificationsFor": ["state"] }] */
import { actionTree, getterTree, mutationTree } from 'typed-vuex';

export const state = () => ({
  paymentHistories: [] as ApiResponse.PaymentHistory[],
});

export type RootState = ReturnType<typeof state>;

export const getters = getterTree(state, {
  paymentHistories: (state: RootState): ApiResponse.PaymentHistory[] => {
    return state.paymentHistories;
  },
});

export const mutations = mutationTree(state, {
  setPaymentHistories(state: RootState, payload: ApiResponse.PaymentHistory[]) {
    state.paymentHistories = payload;
  },
});

export const actions = actionTree(
  { state, getters, mutations },
  {
    // eslint-disable-next-line @typescript-eslint/typedef
    storePaymentHistories({ commit }, payload: ApiResponse.PaymentHistory[]) {
      commit('setPaymentHistories', payload);
    },
  }
);
