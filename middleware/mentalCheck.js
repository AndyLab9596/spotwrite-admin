import { isMentalChecked } from '@/libs/api/app';

export default async ({ store, route, redirect }) => {
  if (route.name !== 'mental-check') {
    if (store.getters['mentalCheck/isBeforeCurrent']) {
      const { data } = await isMentalChecked();
      if (data.is_checked) {
        store.commit('mentalCheck/setMentalCheckedAt');
      } else {
        redirect('/mental-check');
      }
    }
  } else if (store.getters['mentalCheck/isBeforeCurrent']) {
    // TODO: 冗長な書き方になっている。vuexを永続化させれば、アクセス毎に await isMentalChecked() を呼び出さなくてもよくなるはず。
    const { data } = await isMentalChecked();
    if (data.is_checked) {
      store.commit('mentalCheck/setMentalCheckedAt');
      redirect('/');
    }
  } else {
    redirect('/');
  }
};
