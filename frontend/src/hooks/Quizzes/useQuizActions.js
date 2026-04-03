import { useState } from "react";
import { createQuiz, deleteQuiz, restoreQuiz, publishQuiz, updateQuiz } from "@/services/quizzes.service";

export const useQuizActions = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState("");

    const create = async (payload) => {
        try {
            setLoading(true);
            const data = await createQuiz(payload);
            
            if(data.error){
                setError(data.error);
                setMessage(data.message || "");
                return [];
            }else{
                setMessage(data.message || "");
                return data.data || [];
            }
        }catch(err){
            const errorMessage = err.response?.data?.message || err.message || "Error desconocido";
            setError(errorMessage)
            throw(err);
        }finally{
            setLoading(false);
        }
    };

    const remove = async (id, payload) => {
        try {
            setLoading(true);
            const data = await deleteQuiz(id, payload);

            if(data.error){
                setError(data.error);
                setMessage(data.message || "");
                return [];
            }else{
                setMessage(data.message || "");
                return data.data || [];
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || "Error desconocido";
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const restore = async (id) => {
        try {
            setLoading(true);
            const data = await restoreQuiz(id);

            if (data.error) {
                setError(data.error);
                setMessage(data.message || "");
                return null;
            }

            setMessage(data.message || "");
            return data.data;
        } catch (err) {
            const errorMessage =
            err.response?.data?.message || err.message || "Error desconocido";
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const publish = async (id) => {
        try {
            setLoading(true);

            const data = await publishQuiz(id);

            if (data.error) {
                setError(data.error);
                setMessage(data.message || "");
                return null;
            }

            setMessage(data.message || "");
            return data.data;
        } catch (err) {
            const errorMessage =
            err.response?.data?.message || err.message || "Error desconocido";
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const update = async (id, payload) => {
        try {
            setLoading(true);
            const data = await updateQuiz(id, payload);
            
            if(data.error){
                setError(data.error);
                setMessage(data.message || "");
                return [];
            }else{
                setMessage(data.message || "");
                return data.data || [];
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || "Error desconocido";
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { create, update, remove, restore, publish, loading, error, message };
}