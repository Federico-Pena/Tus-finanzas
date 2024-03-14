const BaseUrl = /* 'https://tus-finanzasapp.vercel.app' */ 'http:192.168.1.2:3000'
export const RUTES = {
  CATEGORIES: {
    getCategories: `${BaseUrl}/api/categories/`,
    postCategories: `${BaseUrl}/api/categories/new/`,
    putCategories: `${BaseUrl}/api/categories/update/`,
    deleteCategories: `${BaseUrl}/api/categories/delete/`
  },
  TRANSACTIONS: {
    getTransactions: `${BaseUrl}/api/transactions/`,
    postTransactions: `${BaseUrl}/api/transactions/new/`,
    putTransactions: `${BaseUrl}/api/transactions/update/`,
    deleteTransactions: `${BaseUrl}/api/transactions/delete/`
  },
  USER: {
    registerUser: `${BaseUrl}/api/user/register`,
    loginUser: `${BaseUrl}/api/user/login`,
    deleteUserAccount: `${BaseUrl}/api/user/delete/`,
    postPushNotificationToken: `${BaseUrl}/api/user/push-token`
  },
  STATS: {
    getCategoriesStats: `${BaseUrl}/api/stats/categories/`,
    getCategoriesStatsYear: `${BaseUrl}/api/stats/categories/`,
    getCategoriesStatsMonth: `${BaseUrl}/api/stats/categories/`
  }
} as const
