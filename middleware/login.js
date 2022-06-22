export default async ({ store, route, redirect }) => {
  const isAuth = store.getters.isAuthenticated;

  const appLoginRoutes = '/login';

  const adminLoginRoutes = '/admin/login';

  if (isAuth && route.path === appLoginRoutes) {
    redirect('/');
  }

  if (isAuth && route.path === adminLoginRoutes) {
    redirect('/admin');
  }
};
