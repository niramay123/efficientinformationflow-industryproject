import {Router} from 'express';
import {  forgotPassword, getAllOperators, getMyProfile, loginUser, registerUser, updateMyProfile, updateOperator, updateProfilePic, verifyOtp } from '../controllers/user.controllers.js';
import { isAuth, isSupervisor } from '../middlewares/isAuth.middlewares.js';
import { uploadFiles } from '../middlewares/multer.middlewares.js';
import { resetPassword } from '../middlewares/sendMail.middlewares.js';

const router = Router();

router.post('/user/register',registerUser);
router.post('/user/verify-user',verifyOtp);
router.post('/user/login',loginUser);
router.get('/user/my-profile',isAuth,getMyProfile);
router.put('/user/my-profile',isAuth,updateMyProfile);
router.put('/user/my-profile/profilepic',isAuth,uploadFiles,updateProfilePic);
router.post('/user/forgot',forgotPassword);
router.post('/user/reset',resetPassword);

router.get('/user/operators', isAuth, isSupervisor, getAllOperators);

router.put('/user/operators/:operatorId',isAuth, isSupervisor,updateOperator);



export default router;