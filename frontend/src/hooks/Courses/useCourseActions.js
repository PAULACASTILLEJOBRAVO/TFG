import { useState } from "react";
import {
    createCourse,
    patchCourse,
    deleteCourse
} from "../../services/course.service"

export const useCourseActions = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState("");

    const create = async (payload) => {
        try {
            setLoading(true);
            const data = await createCourse(payload);
            
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

    const patch = async (id, payload) => {
        try {
            setLoading(true);
            const data = await patchCourse(id, payload);
            
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

    const remove = async (id) => {
        try {
            setLoading(true);
            const data = await deleteCourse(id);

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

    return { create, patch, remove, loading, error, message };
}