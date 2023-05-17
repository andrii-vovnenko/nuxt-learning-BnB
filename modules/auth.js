import cookie from 'cookie';
import { OAuth2Client } from 'google-auth-library';

export default function() {
  const authConfig = this.options.publicRuntimeConfig.auth;

  const getUser = async (idToken) => {
    const client = new OAuth2Client(authConfig.clientId);
    try {
      const ticket = await client.verifyIdToken({
        idToken,
        audience: authConfig.clientId,
      });
  
      return ticket.getPayload();
    } catch (e) {
      console.error(e);
    }
  };

  const rejectHit = (res) => {
    res.statusCode = 401;
    res.end();
  };

  this.nuxt.hook('render:setupMiddleware', (app) => {
    app.use('/api', handler);
  });

  this.nuxt.hook('render:setupMiddleware', (app) => {
    app.use('/admin', (req, res, next) => {
      res.spa = true;
      next();
    });
  });

  async function handler(req, res, next) {
    const token = cookie.parse(req.headers.cookie)[authConfig.cookieName];
    
    if (!token) return rejectHit(res);

    const ticket = await getUser(token);

    if (!ticket) return rejectHit(res);

    req.identity = {
      id: ticket.sub,
      email: ticket.email,
      name: ticket.name,
      image: ticket.picture,
    };
    next();
  }
};