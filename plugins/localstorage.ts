import createPersistedState from 'vuex-persistedstate';

export default ({ store }: any) => {
  // @ts-ignore
  window.onNuxtReady(() => {
    createPersistedState({
      key: 'state',
    })(store);
  });
};
