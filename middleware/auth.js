import { fetchUserProfile } from '@/libs/api';
import { enumUserPermissions } from '@/libs/definition';

export default async ({ store, route, redirect }) => {
  const isAuth = store.getters.isAuthenticated;
  const { userProfile } = store.getters;

  const authRoutes = [
    '/admin/login',
    '/admin/account-holder/login',
    '/admin/register',
    '/admin/register/success',
    '/admin/verify-email',
    '/login',
  ];

  if (!isAuth && !authRoutes.includes(route.name)) {
    redirect('/login');
  }

  const fullPath = route.fullPath.replace(/\?.*/, '').replace(/\/$/, '');

  // ownersテーブルにデータをもたないアカウントホルダーの場合
  if (isAuth && store.getters.isAccountHolderWithoutOwner) {
    redirect('/admin/register/select-plan');
  }

  // URLが企業管理画面の場合
  if (fullPath.startsWith('/admin')) {
    const role = userProfile.is_account_holder
      ? 'account-holder'
      : 'employee-general';

    // アカウントホルダーの場合
    if (role === 'account-holder') {
      return;
    }
    // 自分の情報を取得する
    const { data } = await fetchUserProfile();
    store.commit('setUserProfile', data);

    // 利用権限がビジター権限の場合
    if (['visitor'].includes(data.access_permission)) {
      redirect(enumUserPermissions['access-permission'].all[0] ?? '/');
    }
    // 認証関連のURLだった場合
    if (authRoutes.includes(route.name)) {
      redirect(enumUserPermissions[role].all[0] ?? '/admin');
      // 各権限の中で使用できる画面のURLだった場合
    } else if (
      !enumUserPermissions[role].all.includes(fullPath) &&
      !enumUserPermissions[role].all.includes(route.name)
    ) {
      let forwardUrl = enumUserPermissions[role].all[0];
      const userAuthorities = Object.keys(data.authorities).filter(
        (authorityKey) =>
          data.authorities[authorityKey] &&
          (authorityKey === 'read_personal_information' ||
            data.authorities[authorityKey].length)
      );
      const filteredAuthorities = userAuthorities.filter(
        (authorityKey) =>
          enumUserPermissions[role][authorityKey].includes(fullPath) ||
          enumUserPermissions[role][authorityKey].includes(route.name)
      );
      const hasUseCheckPermission =
        enumUserPermissions[role].all.includes('/admin/analysis/useCheck') ||
        enumUserPermissions[role].all.includes('admin-analysis-useCheck') ||
        userAuthorities.filter(
          (authorityKey) =>
            enumUserPermissions[role][authorityKey].includes(
              '/admin/analysis/useCheck'
            ) ||
            enumUserPermissions[role][authorityKey].includes(
              'admin-analysis-useCheck'
            )
        ).length;
      if (hasUseCheckPermission && fullPath === '/admin/analysis/mentalCheck') {
        forwardUrl = '/admin/analysis/useCheck';
      } else {
        forwardUrl =
          enumUserPermissions[role][userAuthorities[0] ?? 'all'][0] ??
          forwardUrl;
      }
      if (!filteredAuthorities.length) {
        redirect(forwardUrl);
      }
    }
    // URLが従業員画面の場合
  } else if (
    fullPath.startsWith('/') &&
    fullPath.includes('/system-admin') === false
  ) {
    const role = 'access-permission';
    if (
      !enumUserPermissions[role].all.includes(fullPath) &&
      !enumUserPermissions[role].all.includes(route.name)
    ) {
      const { data } = await fetchUserProfile();
      store.commit('setUserProfile', data);

      const userPermissionRoles =
        enumUserPermissions[role][data.access_permission] ?? [];
      let forwardUrl = enumUserPermissions[role].all[0];
      forwardUrl = userPermissionRoles[0] ?? forwardUrl;
      if (
        !userPermissionRoles.includes(fullPath) &&
        !userPermissionRoles.includes(route.name)
      ) {
        redirect(forwardUrl);
      }
    }
  }
};
