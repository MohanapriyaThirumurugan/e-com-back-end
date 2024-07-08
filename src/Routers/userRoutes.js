import express from 'express';
import usercontroller from '../Controller/usercontroller.js';
import authenticate from '../utils/cookies.js';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../cloudinary.js';
import multer from 'multer';
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'user',
    format: async (req, file) => 'jpg', // supports promises as well
    public_id: (req, file) => file.originalname.split('.')[0]
  },
});



const upload = multer({ storage: storage });
const router = express.Router();

router.post('/register', upload.single('avatar'), usercontroller.register);
router.post('/login', usercontroller.login);
router.get('/logout', usercontroller.logoutUser);
router.post('/forgotpassword', usercontroller.forgotpasword);
router.post('/resetpassword/:token', usercontroller.resetPassword);
router.get('/myprofile', authenticate.sendTokenInHeader, usercontroller.getUserProfile);
router.put('/changepassword/:id', authenticate.sendTokenInHeader, usercontroller.changepassword);
router.put('/updateprofile/:id',authenticate.sendTokenInHeader,upload.single('avatar'), usercontroller.updateprofile);

// Admin routes
router.get('/admin/getalluser', authenticate.sendTokenInHeader, authenticate.authorizeRoles('admin'), usercontroller.getAllUsers);
router.get('/admin/getbyid/:id', authenticate.sendTokenInHeader, authenticate.authorizeRoles('admin'), usercontroller.getUserbyId);
router.put('/admin/update/:id', authenticate.sendTokenInHeader, authenticate.authorizeRoles('admin'), usercontroller.updateUser);
router.delete('/admin/delete/:id', authenticate.sendTokenInHeader, authenticate.authorizeRoles('admin'), usercontroller.deleteUser);

export default router;

