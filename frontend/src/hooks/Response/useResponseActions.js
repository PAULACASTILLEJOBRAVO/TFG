import { useState } from "react";
import { deleteResponse, restoreResponse, updateResponse, createResponse } from "@/services/response.service";

export const useResponseActions = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState("");

    const create = async (payload) => {
        try {
            setLoading(true);
            const data = await createResponse(payload);
            
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
            const data = await deleteResponse(id, payload);

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
            const data = await restoreResponse(id);

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
            const data = await updateResponse(id, payload);
            
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

    return { create, update, remove, restore, loading, error, message };
}