/**
 * 契約時、確認画面までに選択したプランや会社情報などを保持しておく
 */
/* eslint no-shadow: ["error", { "allow": ["state"] }] */
/* eslint no-param-reassign: ["error", { "ignorePropertyModificationsFor": ["state"] }] */
import { ActionContext } from 'vuex';
import { getterTree, mutationTree, actionTree } from 'typed-vuex';

export type ContractPlan = ApiResponse.ContractPlan;
export type DowngradingStatus = ApiResponse.ContractPlanDowngradingStatusBody;
export type Subscription = ApiResponse.CurrentSubscription;

export type CompanyForm = Omit<
  ApiResponse.Owner,
  'uuid' | 'stripe_customer_id'
>;

export type CreditCard = {
  token: string;
  name: string;
  brand: string;
  last4: string;
  exp_year: string;
  exp_month: string;
};

type State = {
  selectedPlan?: ContractPlan;
  company?: CompanyForm;
  card?: CreditCard;
  downgradingStatus?: DowngradingStatus;
  subscription?: Subscription;
  changePlanResponse?: any;
};

type Context = ActionContext<State, State>;

export const state = (): State => ({
  selectedPlan: undefined,
  company: undefined,
  card: undefined,
  downgradingStatus: undefined,
  subscription: undefined,
  changePlanResponse: undefined,
});

export const getters = getterTree(state, {
  selectedPlan: (state: State): ContractPlan | undefined => {
    return state.selectedPlan;
  },
  company: (state: State): CompanyForm | undefined => {
    return state.company;
  },
  card: (state: State): CreditCard | undefined => {
    return state.card;
  },
  downgradingStatus: (state: State): DowngradingStatus | undefined => {
    return state.downgradingStatus;
  },
  subscription: (state: State): Subscription | undefined => {
    return state.subscription;
  },
  changePlanResponse: (state: State): any | undefined => {
    return state.changePlanResponse;
  },
});

export const mutations = mutationTree(state, {
  setSelectedPlan(state: State, payload: ContractPlan) {
    state.selectedPlan = { ...payload };
  },
  setCompany(state: State, payload: CompanyForm) {
    state.company = { ...payload };
  },
  setCard(state: State, payload: CreditCard) {
    state.card = { ...payload };
  },
  setDowngradingStatus(state: State, payload: DowngradingStatus) {
    state.downgradingStatus = payload;
  },
  setSubscription(state: State, payload: Subscription) {
    state.subscription = payload;
  },
  setChangePlanResponse(state: State, payload: any) {
    state.changePlanResponse = { ...payload };
  },
});

export const actions = actionTree(
  { state, getters, mutations },
  {
    selectPlan({ commit }: Context, payload: ContractPlan) {
      commit('setSelectedPlan', payload);
    },
    saveCompany({ commit }: Context, payload: CompanyForm) {
      commit('setCompany', payload);
    },
    saveCard({ commit }: Context, payload: CreditCard) {
      commit('setCard', payload);
    },
    storeDowngradingStatus({ commit }: Context, payload: DowngradingStatus) {
      commit('setDowngradingStatus', payload);
    },
    storeSubscription({ commit }: Context, payload: Subscription) {
      commit('setSubscription', payload);
    },
    storeChangePlanResponse({ commit }: Context, payload: any) {
      commit('setChangePlanResponse', payload);
    },
    flush({ commit }: Context) {
      commit('setSelectedPlan', undefined);
      commit('setCompany', undefined);
      commit('setCard', undefined);
      commit('setDowngradingStatus', undefined);
      commit('setSubscription', undefined);
      commit('setChangePlanResponse', undefined);
    },
  }
);
