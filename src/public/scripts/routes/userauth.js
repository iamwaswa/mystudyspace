const userAuthenticationRoutes = require(`express`).Router();
const { SUCCESS_FLASH_KEY, ERROR_FLASH_KEY } = require(`../config/router`);

const initializeAuthRoutes = (passport) => {
  // =====================================
  // SIGNUP ==============================
  // =====================================
  userAuthenticationRoutes.get(`/signup`, (req, res) => {
    if (req.user) {
      req.flash(
        SUCCESS_FLASH_KEY,
        `You don't need to sign up. You're already logged in as ${req.user.username}`
      );
      return res.redirect(`/`);
    }

    return res.render(`pages/signup`, {
      message: req.flash()
    });
  });

  // =====================================
  // SIGNUP AUTHENTICATION ===============
  // =====================================
  userAuthenticationRoutes.post(`/signup`, passport.authenticate(`local-signup`, {
    successRedirect: `/`,
    failureRedirect: `/signup`,
    successFlash: true,
    failureFlash: true,
  }));

  // =====================================
  // LOGIN ===============================
  // =====================================
  userAuthenticationRoutes.get(`/login`, (req, res) => {
    if (req.user) {
      req.flash(
        SUCCESS_FLASH_KEY,
        `You don't need to login. You're already logged in as ${req.user.username}`
      );
      return res.redirect(`/`);
    }

    return res.render(`pages/login`, {
      message: req.flash()
    });
  });

  // =====================================
  // LOGIN AUTHENTICATION ================
  // =====================================
  userAuthenticationRoutes.post(`/login`, passport.authenticate(`local-login`, {
    successRedirect: `/`,
    failureRedirect: `/login`,
    successFlash: true,
    failureFlash: true,
  }));

  // =====================================
  // LOGOUT ==============================
  // =====================================
  userAuthenticationRoutes.get(`/logout`, (req, res) => {
    if (!req.user) {
      req.flash(ERROR_FLASH_KEY, `You are not logged in!`);
      return res.redirect(`/login`);
    }

    req.logout();
    req.flash(SUCCESS_FLASH_KEY, `You have been logged out`);
    return res.redirect(`/`);
  });

  return userAuthenticationRoutes;
};

module.exports = initializeAuthRoutes;