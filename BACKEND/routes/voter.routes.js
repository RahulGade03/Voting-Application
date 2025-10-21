import  express from 'express';
const voterRoutes = express.Router();
import { voterLogin, voterLogout, availablePolls, pollResults, myVotes, changePassword, forgotPassword } from '../controllers/voter.controller.js';
import authMiddleware from '../middlewares/authMiddleware.js';

voterRoutes.route('/login').post(voterLogin);
voterRoutes.route('/logout').post(voterLogout);
voterRoutes.route('/polls').get(authMiddleware, availablePolls);    // implement in frontend
voterRoutes.route('/poll-results/:pollId').get(authMiddleware, pollResults);
voterRoutes.route('/my-votes').get(authMiddleware, myVotes);        // implement in frontend
voterRoutes.route('/change-password').post(authMiddleware, changePassword);
voterRoutes.route('/forgot-password').post(forgotPassword);

export default voterRoutes;