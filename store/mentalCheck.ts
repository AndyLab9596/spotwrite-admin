/* eslint no-shadow: ["error", { "allow": ["state"] }] */
/* eslint no-param-reassign: ["error", { "ignorePropertyModificationsFor": ["state"] }] */
import { getterTree, mutationTree } from 'typed-vuex';
import dayjs from '@/libs/dayjs';

export const state = () => ({
  mentalCheckedAt: 0 as number,
});

export type RootState = ReturnType<typeof state>;

export const getters = getterTree(state, {
  mentalCheckedAt: (state: RootState): number => {
    return state.mentalCheckedAt;
  },
  isBeforeCurrent: (state: RootState): boolean => {
    const today = dayjs().format('YYYY/MM/DD 00:00:00');
    return state.mentalCheckedAt < dayjs(today).unix();
  },
});

export const mutations = mutationTree(state, {
  setMentalCheckedAt(state: RootState) {
    state.mentalCheckedAt = dayjs().unix();
  },
});
