export const state = () => ({
  isLoggedIn: false,
  user: {},
});

export const mutations = {
  user(state, user) {
    console.log('mutations', user);
    state.isLoggedIn = !!user;
    state.user = user || {};
  },
};