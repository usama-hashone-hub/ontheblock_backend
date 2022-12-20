const allRoles = {
  user: [
    'verifyPhone',
    'verifyEmail',
    'getMyProfile',
    'updateProfile',
    'manageProducts',
    'manageAds',
    'createOrder',
    'getProfile',
    'getInventoryByCategory',
    'getProperties',
    'getInventories',
    'getTasks',
    'getFolders',
    'getNotifications',
  ],
  admin: [
    'getMyProfile',
    'updateProfile',
    'getDashboard',
    'getUsers',
    'manageUsers',
    'getProducts',
    'manageProducts',
    'getOrder',
    'getPayment',
    'getFeedback',
    'manageCategories',
    'getCategories',
  ],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
