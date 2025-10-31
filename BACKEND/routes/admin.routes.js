import  express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { adminLogin, adminLogout, createPoll, deleteVoter, pollList, pollResult, registerVoter, viewVoter, viewVoters, changePassword, forgotPassword, getVoterListByName } from '../controllers/admin.controller.js';

const adminRoutes = express.Router();

adminRoutes.route('/login').post(adminLogin);
adminRoutes.route('/logout').post(adminLogout);
adminRoutes.route('/create-poll').post(authMiddleware, createPoll);
adminRoutes.route('/register-voter').post(authMiddleware, registerVoter);
adminRoutes.route('/poll-list').get(authMiddleware, pollList);
adminRoutes.route('/poll-result/:pollId').get(authMiddleware, pollResult);
adminRoutes.route('/view-voters').get(authMiddleware, viewVoters);
adminRoutes.route('/view-voter/:id').get(authMiddleware, viewVoter);
adminRoutes.route('/view-voter-byname').get(authMiddleware, getVoterListByName);
adminRoutes.route('/delete-voter/:id').delete(authMiddleware, deleteVoter);
adminRoutes.route('/change-password').post(authMiddleware, changePassword);
adminRoutes.route('/forgot-password').post(forgotPassword);

export default adminRoutes;