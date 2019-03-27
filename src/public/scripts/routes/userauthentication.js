const { SUCCESS_FLASH_KEY, ERROR_FLASH_KEY } = require('./router');

const initializeUserAuthenticationRoutes = (router, passport) => {
  // =====================================
  // SIGNUP ==============================
  // =====================================

  router.get(`/signup`, (req, res) => {
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

  router.post(`/signup`, passport.authenticate(`local-signup`, {
    successRedirect: `/`,
    failureRedirect: `/signup`,
    successFlash: true,
    failureFlash: true,
  }));

  // =====================================
  // LOGIN ===============================
  // =====================================

  router.get(`/login`, (req, res) => {
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

  router.post(`/login`, passport.authenticate(`local-login`, {
    successRedirect: `/`,
    failureRedirect: `/login`,
    successFlash: true,
    failureFlash: true,
  }));

  // =====================================
  // LOGOUT ==============================
  // =====================================

  router.get(`/logout`, (req, res) => {
    if (!req.user) {
      req.flash(ERROR_FLASH_KEY, `You are not logged in!`);
      return res.redirect(`/login`);
    }

    req.logout();
    req.flash(SUCCESS_FLASH_KEY, `You have been logged out`);
    return res.redirect(`/`);
  });
};

module.exports = initializeUserAuthenticationRoutes;