export const authService = {
  login: async (email: string, password: string) => {
    return { token: 'dummy-token' };
  },
  logout: () => {
    localStorage.removeItem('token');
  },
  getUser: () => null,
};
