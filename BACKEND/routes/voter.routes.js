import  express from 'express';
const voterRoutes = express.Router();
import { voterLogin, voterLogout, availablePolls, pollResults, myVotes } from '../controllers/voter.controller.js';

voterRoutes.route('/login').post(voterLogin);
voterRoutes.route('/logout').post(voterLogout);
voterRoutes.route('/polls').get(availablePolls);
voterRoutes.route('/poll-results/:pollId').get(pollResults);
voterRoutes.route('/my-votes').get(myVotes);

export default voterRoutes;