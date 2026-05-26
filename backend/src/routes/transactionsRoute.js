import express from 'express';
import {
    getTransactionByUserId, 
    createTransaction, 
    deleteTransaction, 
    getSummaryByUserId,
    getAllTransaction
} from '../controller/transactionsController.js'

const router = express.Router();

router.get('/', getAllTransaction)
router.get('/:user_id', getTransactionByUserId)
router.post('/', createTransaction)
router.delete('/:id', deleteTransaction)
router.get('/summary/:user_id', getSummaryByUserId)

export default router;
