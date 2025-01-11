import { supabase } from "../lib/supabase";

export const getUserData = async (userId)=>{
    try{
        const {data,error} = await supabase
        //getting the data from users, then selecting it, checking for equivalence with id and then selecting a single component
        .from('users')
        .select()
        .eq('id',userId)
        .single();
        if(error) {
            return {success:false,msg:error?.message};

        }
        return {success:true,data};
    }
    catch(error){
        console.log('Got error',error);
        return {success:false,msg:error.message};
    }
}

export const updateUser = async (userId,data)=>{
    try{
        const {error} = await supabase
        //getting the data from users, then selecting it, checking for equivalence with id and then selecting a single component
        .from('users')
        .update(data)
        .eq('id',userId)
        if(error) {
            return {success:false,msg:error?.message};

        }
        return {success:true,data};
    }
    catch(error){
        console.log('Got error',error);
        return {success:false,msg:error.message};
    }
}