import express from 'express'
import OrderController from '../Controller/OrderController.js'
import authroute from '../utils/cookies.js'

const router=express.Router()
router.post('/neworder', authroute.sendTokenInHeader, OrderController.newOrder)
router.get('/getsingleoder/:id', authroute.sendTokenInHeader, OrderController.getsingleorder)
router.get('/myorder', authroute.sendTokenInHeader, OrderController.myorder)

// admin routes
 router.get('/gellallordereduser', authroute.sendTokenInHeader,authroute.authorizeRoles('admin'),OrderController.getallorderbyadmin)
// router.get('/getproductbyid/:id', ProductDetails.getproductbyid)
router.put('/upadateitem/:id',authroute.sendTokenInHeader,authroute.authorizeRoles('admin'), OrderController.updatebyadmin)
router.delete('/deleteorder/:id', authroute.sendTokenInHeader,authroute.authorizeRoles('admin'), OrderController.deleteOrder)


export default router
