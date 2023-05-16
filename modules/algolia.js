import fetch from 'node-fetch';
import { getErrorResponse, unWrap  } from '../utils/fetchUtils';

export default function() {
  const algoliaConfig = this.options.privateRuntimeConfig.algolia;
  const headers = {
    'X-Algolia-API-Key': algoliaConfig.key,
    'X-Algolia-Application-Id': algoliaConfig.appId,
  };
  this.nuxt.hook('render:setupMiddleware', (app) => {
    app.use('/api/user', getUserRoute);
  });

  async function getUserRoute(req, res, next) {
    console.log('getUserRoute', req.identity);
    await createUser(req.identity);
    next();
  };

  const createUser = async (identity) => {
    try {
      const response = await fetch(
          `${`https://${algoliaConfig.appId}-dsn.algolia.net`}/1/indexes/users/${identity.id}`,
          {
              headers,
              method: 'PUT',
              body: JSON.stringify(makeUserPayload(identity)),
          },
      );

      const data = await unWrap(response);

      return data;
  } catch(error) {
      return getErrorResponse(error);
  }
  };

  function makeUserPayload(identity) {
    return {
      name: identity.name,
      email: identity.email,
      image: identity.image,
      homeId: [],
      reviewCount: 0,
      descriptions: '',
      joined: new Date().toISOString(),
    };
  }
};