const { authResolver } = require('./auth.resolver');
const { categoryResolver } = require('./category.resolver');
const { fileResolver } = require('./file.resolver');
const { folderResolver } = require('./folder.resolver');
const { goalResolver } = require('./goal.resolver');
const { handymanResolver } = require('./handyman.resolver');
const { inventoryResolver } = require('./inventory.resolver');
const { propertyResolver } = require('./property.resolver');
const { propertyTypeResolver } = require('./propertytype.resolver');
const { taskResolver } = require('./task.resolver');

const rootResolver = {
  Query: {
    ...authResolver.Query,
    ...categoryResolver.Query,
    ...goalResolver.Query,
    ...propertyTypeResolver.Query,
    ...fileResolver.Query,
    ...folderResolver.Query,
    ...handymanResolver.Query,
    ...inventoryResolver.Query,
    ...propertyResolver.Query,
    ...taskResolver.Query,
  },
  Mutation: {
    ...authResolver.Mutation,
    ...categoryResolver.Mutation,
    ...goalResolver.Mutation,
    ...propertyTypeResolver.Mutation,
    ...fileResolver.Mutation,
    ...folderResolver.Mutation,
    ...handymanResolver.Mutation,
    ...inventoryResolver.Mutation,
    ...propertyResolver.Mutation,
    ...taskResolver.Mutation,
  },
};

module.exports = rootResolver;
