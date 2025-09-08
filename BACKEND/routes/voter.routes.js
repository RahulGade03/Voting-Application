import  express from 'express';
const router = express.Router();

router.route('/voterlogin').post(voterLogin);
router.route('/logout').post(logout);
router.route('/polls').get(availablePolls);
router.route('/pollResults/:pollId').get(pollResults);
router.route('/myVotes').get(myVotes);

export default router;