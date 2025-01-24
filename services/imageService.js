import * as FileSystem from 'expo-file-system'
import { supabase } from '../lib/supabase'
import { decode } from 'base64-arraybuffer';
import { supabaseUrl } from '../constants';
export const getUserImageSource = imagePath =>{
    if(imagePath) {
        return getSupabaseFileUrl(imagePath);
    }
    else {
        return require('../assets/images/defaultUser.png')
    }
}

export const getSupabaseFileUrl = filePath =>{
    if(filePath){
        
        // console.log("filepath",filePath);
        return {uri:`${supabaseUrl}/storage/v1/object/public/uploadprofiles/${filePath}`}
    }
    return null;
}

// export const downloadFile=async(url)=>{
//     try{
//         const {uri}=await FileSystem.downloadAsync(url,getLocalFilePath(url))
//         if (uri) {
//             console.log("File downloaded successfully to:", uri);
//             return uri;
//           } else {
//             console.error("File download failed, no URI returned.");
//             return null;
//           }
//     }catch(error){
//         return null;
//     }
// }

export const downloadFile = async (fileUrl) => {
    try {
      // Ensure the file URL is valid
      if (!fileUrl) {
        console.error("Invalid file URL");
        return null;
      }
  
      // Generate a local file path using the file's name
      const localFilePath = getLocalFilePath(fileUrl);
      console.log("Downloading file to:", localFilePath);
  
      // Download the file and get its local URI
      const { uri } = await FileSystem.downloadAsync(fileUrl, localFilePath);
  
      // Check if the download was successful
      if (uri) {
        console.log("File downloaded successfully to:", uri);
        return uri;
      } else {
        console.error("File download failed, no URI returned.");
        return null;
      }
    } catch (error) {
      console.error("Error downloading file:", error.message);
      return null;
    }
  };
  
export const getLocalFilePath=filePath=>{
    let fileName=filePath.split('/').pop();
    return `${FileSystem.documentDirectory}${fileName}`;
}

export const uploadFile = async (folderName,fileUri,isImage=true)=>{
    try{
        let fileName=getFilePath(folderName,isImage);
        const fileBase64=await FileSystem.readAsStringAsync(fileUri,{
            encoding:FileSystem.EncodingType.Base64
        });
        let imageData=decode(fileBase64); //arrayBuffer

        let {data,error} = await supabase
        .storage
        .from('uploadprofiles')
        .upload(fileName,imageData,{
            cacheControl:'3600',
            upsert:false,
            contentType:isImage?'image/*':'video/*'
        });
        if(error){
            console.log('File upload error: ',error);
        return {success: false,msg:'Could not upload media'};
        }
        // console.log('data: ',data);
        return {success:true,data:data.path}
    }catch(error)
    {
        console.log('File upload error: ',error);
        return {success: false,msg:'Could not upload media'};
    }
}

export const getFilePath=(folderName,isImage)=>{
    return `/${folderName}/${(new Date()).getTime()}${isImage?'.jpeg':'.mp4'}`;
}