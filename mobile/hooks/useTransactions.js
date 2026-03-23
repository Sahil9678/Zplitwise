import React, { useCallback, useState } from 'react'
import { Alert } from 'react-native'

const API_URL = "http://localhost:5001/api"

export const useTransactions = (userId) => {
    const [transactions, setTransactions] = useState([])
    const [summary, setSummary] = useState({
        balance: 0,
        income: 0,
        expense: 0
    });

    const [IsLoading, setIsLoading] = useState(true);

    //usecallback is used for performance reason, it will memoize the function
    const fetchTransactions = useCallback(async () => {
        try{
            const response = await fetch(`${API_URL}/transactions/${userId}`)
            const data = await response.json()
            setTransactions(data)
        }catch(error) {
            console.error('Error fetching transactions ', error)
        }
    },[userId])

    const fetchSummary = useCallback(async () => {
        try{
            const response = await fetch(`${API_URL}/transactions/summary/${userId}`)
            const data = await response.json()
            setSummary(data)
        }catch(error) {
            console.error('Error fetching summary ', error)
        }
    },[userId])

    const loadData = useCallback(async () => {
        if(!userId) return;

        setIsLoading(true);

        try{
            //both function will run in parallel. Both function are fetching data for themselves and not effecting each other
            await Promise.all([fetchTransactions(),fetchSummary()])

        }catch(error) {
            console.error('Error Loading data ', error)
        } finally {
            setIsLoading(false);
        }
    },[fetchTransactions,fetchSummary, userId])

    const deleteTransactions = async (id) => {
        try{
            const response = await fetch(`${API_URL}/transactions/${id}`, {method : "DELETE"})

            if(!response.ok){
                throw new Error("Failed to delete transaction")
            }
            loadData();
            Alert.alert("success","Transaction Deleted Successfully");
        }catch(error) {
            console.error('Error fetching transactions ', error)
            Alert.alert("error",error);
        }
    }

    return { transactions, summary, IsLoading , loadData, deleteTransactions };
}
