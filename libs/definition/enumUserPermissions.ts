const enumUserPermissions = {
  'account-holder': {
    all: [
      '/admin',

      '/admin/organization-management/organizations',
      '/admin/organization-management/organizations/registration',
      '/admin/organization-management/grouping/groups',
      '/admin/organization-management/grouping/organizations',
      'admin-organization-management-organizations-companies-id',
      'admin-organization-management-organizations-departments-id',
      'admin-organization-management-organizations-managements-id',
      'admin-organization-management-organizations-others-id',
      'admin-organization-management-organizations-shops-id',

      '/admin/employee-management/registration',
      '/admin/employee-management/addition',
      '/admin/employee-management/employees/list/1',
      '/admin/employee-management/employees/bulk-registration',
      'admin-employee-management-employees-list-id',
      'admin-employee-management-employees-id',

      '/admin/post-rule/organization',
      'admin-post-rule-community',

      '/admin/authority-setting',

      '/admin/master-setting',

      '/admin/extensions',

      '/admin/account-management',

      '/admin/contract-info',
      '/admin/contract-info/change-plan',

      '/admin/payment-history',

      '/admin/send-contact',
    ],
    admin: [],
    read_motivation_analytics: [],
    read_usage_check: [],
    read_personal_information: [],
  },
  'employee-general': {
    all: [
      '/admin/community-management/registration',
      '/admin/community-management',
      'admin-community-management-create',
      'admin-community-management-detail-id',
    ],
    admin: [
      '/admin',

      '/admin/analysis/useCheck',
      'admin-analysis-useCheck-employees-id',
      'admin-analysis-useCheck-organizations-id',

      '/admin/internal-communications',
      'admin-internal-communications-history',

      '/admin/article-theme',

      '/admin/company-files',

      '/admin/organization-management/organizations',
      '/admin/organization-management/organizations/registration',
      '/admin/organization-management/grouping/groups',
      '/admin/organization-management/grouping/organizations',
      'admin-organization-management-organizations-companies-id',
      'admin-organization-management-organizations-departments-id',
      'admin-organization-management-organizations-managements-id',
      'admin-organization-management-organizations-others-id',
      'admin-organization-management-organizations-shops-id',

      '/admin/employee-management/registration',
      '/admin/employee-management/addition',
      '/admin/employee-management/employees/list/1',
      '/admin/employee-management/employees/bulk-registration',
      'admin-employee-management-employees-list-id',
      'admin-employee-management-employees-id',

      '/admin/community-management',
      'admin-community-management-create',
      'admin-community-management-detail-id',

      '/admin/post-rule/organization',
      'admin-post-rule-community',

      '/admin/authority-setting',

      '/admin/master-setting',

      '/admin/extensions',

      '/admin/notice',
      'admin-notice-detail-id',

      '/admin/internal-communications',
      'admin-internal-communications-history',

      '/admin/account-management',

      '/admin/contract-info',
      '/admin/contract-info/change-plan',

      '/admin/payment-history',

      '/admin/send-contact',
    ],
    read_motivation_analytics: [
      '/admin/analysis/mentalCheck',
      'admin-analysis-mentalCheck-employees-id',
      'admin-analysis-mentalCheck-organizations-id',
    ],
    read_usage_check: [
      '/admin/analysis/useCheck',
      'admin-analysis-useCheck-employees-id',
      'admin-analysis-useCheck-organizations-id',
    ],
    read_personal_information: [],
  },
  'employee-analysis': {
    admin: [],
    read_motivation_analytics: [],
    read_usage_check: [],
    read_personal_information: [],
  },
  'employee-private': {
    admin: [],
    read_motivation_analytics: [],
    read_usage_check: [],
    read_personal_information: [],
  },
  'employee-admin': {
    admin: [],
    read_motivation_analytics: [],
    read_usage_check: [],
    read_personal_information: [],
  },
  'access-permission': {
    all: [
      '',
      '/',
      '/bulletin-board',
      '/communities',
      '/company',
      '/daily-report-create',
      '/daily-reports',
      '/daily-reports-settings',
      '/daily-reports-settings-create',
      '/events',
      '/internal-communications',
      '/internal-communications-pickup',
      '/internal-files',
      '/mental-check',
      '/message',
      '/my-page',
      '/organizations',
      '/post-news/communities',
      'app-posts-id',
      'app-post-news-id',
      'app-events-id',
      'app-organizations-id',
      'app-communities-id',
      'app-post-news-communities-id',
      'app-daily-reports-settings-id',
    ],
    member: ['/admin/analysis/mentalCheck', 'app-users-id'],
    associate_member: ['/admin/analysis/mentalCheck', 'app-users-id'],
    visitor: [],
  },
};

export default enumUserPermissions;
