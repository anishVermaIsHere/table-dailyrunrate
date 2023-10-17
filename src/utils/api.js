import axios from 'axios';

axios.defaults.baseURL=import.meta.env.VITE_BASE_URL;

export const get=async()=>{
    const URL='/drr';
    const response=await axios({
        method:'GET',
        url:URL
    })
    return response.data;
}

export const getById=async(id)=>{
    const URL=`/drr/${id}`;
    const response=await axios({
        method:'GET',
        url:URL
    })
    return response.data;
}


export const save=async(data)=>{
    const URL="/drr";
    const response=await axios({
        url:URL,
        method:'POST',
        data:data
    })
    return response;
}


export const updatedById=async(id,data)=>{
    const URL=`/drr/${id}`;
    const response=await axios({
        url:URL,
        method:'PUT',
        data:data
    })
    return response;
}

export const deleteById=async(id)=>{
    const URL=`/drr/${id}`;
    const response=await axios({
        url:URL,
        method:'DELETE'
    })
    return response;
}