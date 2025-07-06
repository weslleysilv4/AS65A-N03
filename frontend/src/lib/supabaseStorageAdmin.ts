/**
 * Função de upload simplificada usando Service Role
 * Use esta versão se houver problemas com políticas RLS
 */

import { supabaseAdmin } from './supabaseAdmin';

export async function uploadFileAdmin(
  file: File,
  bucket: string = 'news-media',
  folder?: string
): Promise<string> {
  try {
    // Create a unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const fileExtension = file.name.split('.').pop();
    const fileName = `${timestamp}-${randomString}.${fileExtension}`;
    
    // Build the file path
    const filePath = folder ? `${folder}/${fileName}` : fileName;
    
    console.log('Uploading with admin client:', { fileName, filePath, bucket });
    
    // Upload using admin client (service role)
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.error('Admin upload error:', error);
      throw new Error(`Failed to upload file: ${error.message}`);
    }
    
    console.log('Upload data:', data);
    
    // Get the public URL
    const { data: publicUrlData } = supabaseAdmin.storage
      .from(bucket)
      .getPublicUrl(filePath);
    
    if (!publicUrlData?.publicUrl) {
      throw new Error('Failed to get public URL for uploaded file');
    }
    
    console.log('Upload successful:', publicUrlData.publicUrl);
    return publicUrlData.publicUrl;
    
  } catch (error) {
    console.error('Error in uploadFileAdmin:', error);
    throw error;
  }
}
