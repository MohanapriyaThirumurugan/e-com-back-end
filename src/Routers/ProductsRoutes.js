import express from 'express';
import ProductDetails from '../Controller/ProductDetails.js';
import cookies from '../utils/cookies.js';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../cloudinary.js';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'productsimages',
    format: async (req, file) => 'jpg', // supports promises as well
    public_id: (req, file) => file.originalname.split('.')[0]
  },
});

const upload = multer({ storage: storage });

const router = express.Router();

router.get('/getall', ProductDetails.getproductall);
router.post('/createproduct', upload.array('images'), cookies.sendTokenInHeader, cookies.authorizeRoles('admin'), ProductDetails.createproduct);
router.get('/getproductbyid/:id', cookies.sendTokenInHeader, ProductDetails.getproductbyid);
router.put('/edit/:id', upload.array('images'), cookies.sendTokenInHeader, cookies.authorizeRoles('admin'), ProductDetails.editproductbyid);
router.delete('/delete/:id', cookies.sendTokenInHeader, cookies.authorizeRoles('admin'), ProductDetails.deleteproductbyid);
router.put('/review/', cookies.sendTokenInHeader, ProductDetails.createreveiw);
router.get('/admin/getadminproducts', cookies.sendTokenInHeader, cookies.authorizeRoles('admin'), ProductDetails.getAdminProducts);
router.get('/getsinglereview', cookies.sendTokenInHeader, cookies.authorizeRoles('admin'), ProductDetails.getReviews);
router.delete('/deletereveiw/:id/:reviewId', cookies.sendTokenInHeader, cookies.authorizeRoles('admin'), ProductDetails.deleteReview);

export default router;
