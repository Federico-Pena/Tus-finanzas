export const RUTES = {
  CATEGORIES: {
    getCategories: '/api/categories/',
    postCategories: '/api/categories/new/',
    putCategories: '/api/categories/update/:id',
    deleteCategories: '/api/categories/delete/:id'
  },
  TRANSACTIONS: {
    getTransactions: '/api/transactions/',
    postTransactions: '/api/transactions/new/',
    putTransactions: '/api/transactions/update/:id',
    deleteTransactions: '/api/transactions/delete/:id'
  },
  USER: {
    registerUser: '/api/user/register',
    loginUser: '/api/user/login',
    deleteUserAccount: '/api/user/delete/:username',
    postPushNotificationToken: '/api/user/push-token'
  },
  STATS: {
    getCategoriesStats: '/api/stats/categories/',
    getCategoriesStatsYear: '/api/stats/categories/:year',
    getCategoriesStatsMonth: '/api/stats/categories/:year/:month'
  }
} as const
