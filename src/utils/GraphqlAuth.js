const { GraphQLError } = require('graphql');
const { roleRights } = require('../config/roles');

module.exports = {
  checkUser: async (context, ...requiredRights) => {
    if (!context.user) {
      throw new GraphQLError('Please authenticated', {
        extensions: {
          code: 'UNAUTHENTICATED',
          http: { status: 401 },
        },
      });
    }

    const user = context.user;

    if (requiredRights.length) {
      const userRights = roleRights.get(user.role);
      const hasRequiredRights = requiredRights.every((requiredRight) => userRights.includes(requiredRight));
      if (!hasRequiredRights) {
        throw new GraphQLError('Forbbiden', {
          extensions: {
            code: 'FORBBIDEN',
            http: { status: 403 },
          },
        });
      }
    }
  },
};
