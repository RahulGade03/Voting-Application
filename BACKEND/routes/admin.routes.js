import  express from 'express';
import isAuthenticated from '../middlewares/authMiddleware.js';
import { adminLogin, adminLogout, createPoll, deleteVoter, pollList, pollResult, registerVoter, viewVoter, viewVoters } from '../controllers/admin.controller.js';

const router = express.Router();

router.route('/adminLogin').post(adminLogin);
router.route('/adminLogout').post(authMiddleware, adminLogout);
router.route('/createPoll').post(authMiddleware, createPoll);
router.route('/registerVoter').post(authMiddleware, registerVoter);
router.route('/pollList').get(authMiddleware, pollList);
router.route('/pollResult/:pollId').get(authMiddleware, pollResult);
router.route('/viewVoters').get(authMiddleware, viewVoters);
router.route('/viewVoter/:id').get(authMiddleware, viewVoter);
router.route('/deleteVoter/:id').delete(authMiddleware, deleteVoter);

export default router;