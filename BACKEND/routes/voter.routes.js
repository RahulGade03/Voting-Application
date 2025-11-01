import  express from 'express';
const voterRoutes = express.Router();

import { voterLogin, voterLogout, availablePolls, pollResult, myVotedPolls, changePassword, forgotPassword } from '../controllers/voter.controller.js';
import authMiddleware from '../middlewares/authMiddleware.js';

voterRoutes.route('/login').post(voterLogin);
voterRoutes.route('/logout').post(voterLogout);
voterRoutes.route('/polls').get(authMiddleware, availablePolls);
voterRoutes.route('/poll-result/:pollId').get(authMiddleware, pollResult);
voterRoutes.route('/my-voted-polls').get(authMiddleware, myVotedPolls);
voterRoutes.route('/change-password').post(authMiddleware, changePassword);
voterRoutes.route('/forgot-password').post(forgotPassword);

export default voterRoutes;