import Cookies from "js-cookie";
import { unWrap } from "../utils/fetchUtils";

export default ({ $config, store }, inject) => {
  window.initAuth = init;
  addScript();

  inject('auth', {
    signOut
  });

  function addScript() {
    const script = document.createElement("script");
    script.src = `https://apis.google.com/js/platform.js?onload=initAuth`;
    script.async = true;
    document.head.appendChild(script);
  }

  function init() {
    window.gapi.load('auth2', async () => {
      const auth2 = await window.gapi.auth2.init({
        plugin_name: 'test',
        client_id: $config.auth.clientId,
      });

      auth2.currentUser.listen(parseUser);
    });

    window.gapi.signin2.render('googleButton', {
        onsuccess: parseUser
      });
  }

  async function parseUser(user) {
    console.log('ppp', user.isSignedIn());
    if (!user.isSignedIn()) {
      Cookies.remove($config.auth.cookieName);
      store.commit('auth/user', null);
      return;
    }

    const idToken = user?.getAuthResponse().id_token;

    Cookies.set(
      $config.auth.cookieName,
      idToken,
      { expires: 1/24, sameSite: 'Lax' },
    );

    try {
      const response = await unWrap(await fetch('/api/user'));
      user = response.json;
      console.log({ user });
      store.commit('auth/user', {
        fullName: user.name,
        profileUrl: user.image,
      });
    } catch(e) {
      console.log(e);
    }

  }

  function signOut() {
    const auth2 = window.gapi.auth2.getAuthInstance();
    auth2.signOut();
  };
};
