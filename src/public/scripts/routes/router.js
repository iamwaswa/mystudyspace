const initializeCommentRoutes = require('./comment');
const initializeHomeRoutes = require('./home');
const initializeNotFoundRoutes = require('./notfound');
const initializePromptRoutes = require('./prompt');
const initializeStudySpaceRoutes = require('./studyspace');
const initializeStudySpacesRoutes = require('./studyspaces');
const initializeUserAuthenticationRoutes = require('./userauthentication');

const SUCCESS_FLASH_KEY = `success`;
const ERROR_FLASH_KEY = `error`;
const DEFAULT_FLASH_KEY = `default`;

const initializeRoutes = (router, passport) => {
  initializeCommentRoutes(router);
  initializeHomeRoutes(router);
  initializeNotFoundRoutes(router);
  initializePromptRoutes(router);
  initializeStudySpaceRoutes(router);
  initializeStudySpacesRoutes(router);
  initializeUserAuthenticationRoutes(router, passport);
};

module.exports = {
  SUCCESS_FLASH_KEY,
  ERROR_FLASH_KEY,
  DEFAULT_FLASH_KEY,
  initializeRoutes,
};