
export const cookies = {
  getOptions: () => ({
    httpOnly: true,                  // accessible only by the http web server (more secure)
    secure: process.env.NODE_ENV === 'production',   
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000,    // 15 minutes; for security, the user can login again after expiry
  }),

  set: (res, name, value, options = {}) => {
    res.cookie(name, value, {...cookies.getOptions(), ...options });
  },

  clear: (res, name, options = {}) => {
    res.clearCookie(name, {...cookies.getOptions(), ...options });

  },

  get: (req, name) => {
    return req.cookies[name];
  },
};