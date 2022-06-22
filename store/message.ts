/* eslint no-shadow: ["error", { "allow": ["state"] }] */
/* eslint no-param-reassign: ["error", { "ignorePropertyModificationsFor": ["state"] }] */
import { getterTree, mutationTree, actionTree } from 'typed-vuex';

export const state = () => ({
  room_uuid: '' as string,
  content: {} as { [s: string]: AppApiResponse.MessageItem[] },
});

export type RootState = ReturnType<typeof state>;

export const getters = getterTree(state, {
  room_uuid: (state: RootState): string => {
    return state.room_uuid;
  },
  content: (
    state: RootState
  ): { [s: string]: AppApiResponse.MessageItem[] } => {
    return state.content;
  },
});

export const mutations = mutationTree(state, {
  setRoomUuid(state: RootState, room_uuid: string) {
    state.room_uuid = room_uuid;
  },
  setContent(
    state: RootState,
    content: { [s: string]: AppApiResponse.MessageItem[] }
  ) {
    state.content = content;
  },
});

export const actions = actionTree(
  { state, getters, mutations },
  {
    // eslint-disable-next-line @typescript-eslint/typedef
    setRoomUuid({ commit }, uuid: string): void {
      commit('setRoomUuid', uuid);
    },
    setContent(
      // eslint-disable-next-line @typescript-eslint/typedef
      { commit },
      content: { [s: string]: AppApiResponse.MessageItem[] }
    ): void {
      commit('setContent', content);
    },
  }
);
