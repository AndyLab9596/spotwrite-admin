/* eslint no-shadow: ["error", { "allow": ["state"] }] */
/* eslint no-param-reassign: ["error", { "ignorePropertyModificationsFor": ["state"] }] */
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  getAccessorType,
  getterTree,
  mutationTree,
  actionTree,
} from 'typed-vuex';

const localStorageKeys = {
  accessToken: 'ACCESS_TOKEN',
  userProfile: 'USER_PROFILE',
  internalTargetUsers: 'INTERNAL_TARGET_USERS',
  employees: 'EMPLOYEES',
};

const jsonFromLocalStorage = (key: string) => {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      return null;
    }
    return JSON.parse(item);
  } catch {
    return null;
  }
};

export const state = () => ({
  accessToken: jsonFromLocalStorage(localStorageKeys.accessToken) || null,
  userProfile: jsonFromLocalStorage(localStorageKeys.userProfile) || null,
  internalTargetUsers:
    jsonFromLocalStorage(localStorageKeys.internalTargetUsers) || null,
  employees: jsonFromLocalStorage(localStorageKeys.employees) || null,
  loading: false,
  isEnableBulletinBoard: false,
  isEnableMotivation: false,
  isEnableMessenger: false,
  showTutorialFlag: false,
  tutorialShowTimes: 0 as number,
});

type RootState = ReturnType<typeof state>;

export const getters = getterTree(state, {
  accessToken: (state: RootState): string => {
    return state.accessToken;
  },
  userProfile: (state: RootState): ApiResponse.AccountHolder => {
    return state.userProfile;
  },
  isAuthenticated: (state: RootState): boolean => {
    return !!state.accessToken;
  },
  loading: (state: RootState): boolean => {
    return state.loading;
  },
  isAccountHolderWithoutOwner: (state: RootState): boolean => {
    return (
      state.userProfile.is_account_holder && state.userProfile.owner === null
    );
  },
  isEnableBulletinBoard: (state: RootState): boolean => {
    return state.isEnableBulletinBoard;
  },
  isEnableMotivation: (state: RootState): boolean => {
    return state.isEnableMotivation;
  },
  isEnableMessenger: (state: RootState): boolean => {
    return state.isEnableMessenger;
  },
  showTutorialFlag: (state: RootState): boolean => {
    return state.showTutorialFlag;
  },
  tutorialShowTimes: (state: RootState): number => {
    return state.tutorialShowTimes;
  },
  internalTargetUsers: (state: RootState): { [s: string]: string[] } => {
    return state.internalTargetUsers;
  },
  employees: (state: RootState): AppApiResponse.Employee[] => {
    return state.employees;
  },
});

export const mutations = mutationTree(state, {
  clearAccessToken(state: RootState) {
    state.accessToken = null;
    localStorage.removeItem(localStorageKeys.accessToken);
  },
  setAccessToken(state: RootState, token: string) {
    state.accessToken = token;
    localStorage.setItem(
      localStorageKeys.accessToken,
      JSON.stringify(state.accessToken)
    );
  },

  setUserProfile(state: RootState, user: ApiResponse.AccountHolder) {
    state.userProfile = user;
    localStorage.setItem(
      localStorageKeys.userProfile,
      JSON.stringify(state.userProfile)
    );
  },
  setAdminUserProfile(state: RootState, admin: ApiResponse.Admin) {
    state.userProfile = admin;
    localStorage.setItem(
      localStorageKeys.userProfile,
      JSON.stringify(state.userProfile)
    );
  },

  deleteUserProfile(state: RootState) {
    state.userProfile = null;
    localStorage.removeItem(localStorageKeys.userProfile);
  },
  /**
   * @deprecated
   * VueLoadingを使用してください
   */
  setLoading(state: RootState, payload: boolean) {
    state.loading = payload;
  },
  setAdditionalFunctionStatuses(
    state: RootState,
    additionalFunctionStatuses: AppApiResponse.AdditionalFunctionStatuses
  ) {
    state.isEnableBulletinBoard = additionalFunctionStatuses.bulletin_board;
    state.isEnableMotivation = additionalFunctionStatuses.motivation;
    state.isEnableMessenger = additionalFunctionStatuses.messenger;
  },
  setShowTutorialFlag(state: RootState, payload: boolean) {
    state.showTutorialFlag = payload;
  },
  setTutorialShowTimes(state: RootState, payload: number) {
    state.tutorialShowTimes = payload;
  },
  clearInternalTargetUsers(state: RootState) {
    state.internalTargetUsers = null;
    localStorage.removeItem(localStorageKeys.internalTargetUsers);
  },
  setInternalTargetUsers(
    state: RootState,
    internalTargetUsers: { [s: string]: string[] }
  ) {
    state.internalTargetUsers = internalTargetUsers;
    localStorage.setItem(
      localStorageKeys.internalTargetUsers,
      JSON.stringify(state.internalTargetUsers)
    );
  },
  clearEmployees(state: RootState) {
    state.employees = null;
    localStorage.removeItem(localStorageKeys.employees);
  },
  setEmployees(state: RootState, employees: AppApiResponse.Employee[]) {
    state.employees = employees;
    localStorage.setItem(
      localStorageKeys.employees,
      JSON.stringify(state.employees)
    );
  },
});

export type AccessTokenObject = {
  accessToken: string;
};

export const actions = actionTree(
  { state, getters, mutations },
  {
    // eslint-disable-next-line @typescript-eslint/typedef
    logout({ commit, dispatch }): void {
      commit('clearAccessToken');
      commit('deleteUserProfile');
      dispatch('contract/flush');
      commit('clearInternalTargetUsers');
      commit('clearEmployees');
    },
    // eslint-disable-next-line @typescript-eslint/typedef
    setAccessToken({ commit }, payload: AccessTokenObject): void {
      commit('setAccessToken', payload.accessToken);
    },
    // eslint-disable-next-line @typescript-eslint/typedef
    setLoading({ commit }, payload: boolean): void {
      commit('setLoading', payload);
    },
    setEnrollmentStatus(
      // eslint-disable-next-line @typescript-eslint/typedef
      { commit, state },
      payload: AppApiRequest.EnrollmentStatus
    ): void {
      commit('setUserProfile', {
        ...state.userProfile,
        enrollment_text: payload.text,
        enrollment_color: payload.color_code,
        enrollment_description: payload.description,
      });
    },
    setAdditionalFunctionStatuses(
      // eslint-disable-next-line @typescript-eslint/typedef
      { commit },
      payload: AppApiResponse.AdditionalFunctionStatuses
    ) {
      commit('setAdditionalFunctionStatuses', payload);
    },
    // eslint-disable-next-line @typescript-eslint/typedef
    setShowTutorialFlag({ commit }, payload: boolean): void {
      commit('setShowTutorialFlag', payload);
    },
    // eslint-disable-next-line @typescript-eslint/typedef
    setTutorialShowTimes({ commit }, payload: number): void {
      commit('setTutorialShowTimes', payload);
    },
    setInternalTargetUsers(
      // eslint-disable-next-line @typescript-eslint/typedef
      { commit },
      internalTargetUsers: { [s: string]: string[] }
    ): void {
      commit('setInternalTargetUsers', internalTargetUsers);
    },
    setEmployees(
      // eslint-disable-next-line @typescript-eslint/typedef
      { commit },
      employees: AppApiResponse.Employee[]
    ): void {
      commit('setEmployees', employees);
    },
  }
);

export const accessorType = getAccessorType({
  state,
  getters,
  mutations,
  actions,
});
