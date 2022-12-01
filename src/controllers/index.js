module.exports.authController = require('./auth.controller');

// User Controllers
module.exports.homeController = require('./User/home.controller');
module.exports.generalController = require('./User/general.controller');
module.exports.orderController = require('./User/_order.controller');
module.exports.productController = require('./User/product.controller');
module.exports.adController = require('./User/ad.controller');
module.exports.rentController = require('./User/rent.controller');

// Admin Controllers
module.exports.userController = require('./Admin/user.controller');
module.exports.dashboardController = require('./Admin/dashboard.controller');
// module.exports.campaignController = require('./Admin/campaign.controller');
module.exports.paymentController = require('./Admin/payment.controller');
module.exports.feedbackController = require('./Admin/feedback.controller');
module.exports.categoryController = require('./Admin/category.controller');
