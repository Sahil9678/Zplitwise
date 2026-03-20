import {sql} from '../config/db.js';

export async function getTransactionByUserId (req,res) {

        try{
            const {user_id} = req.params;
            const user_details = await sql`
                SELECT * FROM transactions WHERE
                user_id= ${user_id} order by created_at DESC
            `;
            res.status(200).json(user_details);
    
        }catch(error) {
            console.error("Error getting the transaction: ", error);
            res.status(500).json({error: "Internal Server Error"});
        }
}

export async function createTransaction (req,res) {
        //title, amount, category, userid 
        try{
            const {title, amount, category, user_id} = req.body;
            if(!title || !user_id || !category || amount === undefined ){
                return res.status(400).json({message : "All fields are required"});
            }
    
            const transaction = await sql`
                INSERT INTO transactions (user_id, title, amount, category)
                VALUES (${user_id}, ${title}, ${amount}, ${category})
                RETURNING *
            `;
    
            console.log("transaction -", transaction);
            res.status(201).json(transaction[0]);
    
        } catch (error) {
            console.error("Error creating transaction: ", error);
            res.status(500).json({error: "Internal Server Error"});
        }

}

export async function deleteTransaction (req,res) {
    try{
        const {id } = req.params;

        if(isNaN(Number(id))) {
            return res.status(400).json({message: "Invalid transaction id"});
        }

        const result  = await sql`
            DELETE FROM transactions WHERE id=${id} RETURNING *
        `;

        if(result.length === 0) {
            return res.status(404).json({message: "Transaction not found"});
        }

        res.status(200).json({message: "Transaction deleted successfully"});
    }catch(error) {
        console.error("Error deleting transaction: ", error);
        res.status(500).json({error: "Internal Server Error"});
    }
}

export async function getSummaryByUserId (req,res) {
    try{
        const {user_id} = req.params;
        
        const BalanceResult = await sql`
            SELECT COALESCE(SUM(amount), 0) as balance FROM transactions WHERE user_id=${user_id}
        `;

        const IncomeResult = await sql`
            SELECT COALESCE(SUM(amount), 0) as income FROM transactions WHERE user_id=${user_id} AND amount > 0
        `;

        const ExpenseResult = await sql`
            SELECT COALESCE(SUM(amount), 0) as expense FROM transactions WHERE user_id=${user_id} AND amount < 0
        `;

        res.status(200).json({
            balance: BalanceResult[0].balance,
            income: IncomeResult[0].income,
            expense: ExpenseResult[0].expense
        })
    

    }catch(error) {
        console.error("Error getting transaction summary: ", error);
        res.status(500).json({error: "Internal Server Error"});
    }
}