import { useState } from "react";
import { deleteUser, changePasswordUser, restoreUser, updateUser, createUser } from "@/services/user.service";

export const useUserActions = () => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState("");

    const create = async (payload) => {
        try {
            setLoading(true);
            const data = await createUser(payload);
            
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

    const changePassword = async (id, newPassword) => {
        try {
            setLoading(true);
            const data = await changePasswordUser(id, {newPassword: newPassword});
            
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

    const remove = async (id, payload) => {
        try {
            setLoading(true);
            const data = await deleteUser(id, payload);

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
            const data = await restoreUser(id);

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
            const data = await updateUser(id, payload);
            
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

    return { create, update, changePassword, remove, restore, loading, error, message };
}