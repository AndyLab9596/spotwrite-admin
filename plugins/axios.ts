import { Context } from '@nuxt/types';

// @ts-ignore
// eslint-disable-next-line import/no-mutable-exports
export let axios;
export default ({ $axios, redirect, store, route }: Context) => {
  // BaseURLを設定
  const baseURL: string = process.env.ApiHostUrl || 'http://localhost:3000';
  $axios.setBaseURL(baseURL);

  // リクエスト時の処理
  // eslint-disable-next-line @typescript-eslint/typedef
  $axios.onRequest((config) => {
    const bearer = JSON.parse(localStorage.getItem('ACCESS_TOKEN') as string);
    const requestConfig = config;
    if (bearer) {
      requestConfig.headers = {
        ...requestConfig.headers,
        Authorization: `Bearer ${bearer}`,
      };
    }
    return requestConfig;
  });

  // レスポンスエラー時の処理
  // eslint-disable-next-line @typescript-eslint/typedef
  $axios.onResponseError(async (axiosError) => {
    const response = axiosError.response!;
    if (response.status === 401) {
      await store.dispatch('logout');
      if (route.fullPath.startsWith('/')) {
        if (!route.fullPath.includes('/login')) {
          redirect('/login');
        }
      } else {
        redirect('/admin/login');
      }
    }
    return Promise.reject(axiosError);
  });

  axios = $axios;
};
