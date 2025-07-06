import { supabase } from './supabaseClient';
import { createClient } from '@supabase/supabase-js';

// Cliente alternativo com service role para uploads (caso necessário)
const getServiceRoleClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;
  
  if (supabaseUrl && serviceRoleKey) {
    return createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
  }
  return null;
};

/**
 * Uploads a file to Supabase Storage
 * @param file - The file to upload
 * @param bucket - The storage bucket name (default: 'news-media')
 * @param folder - Optional folder path within the bucket
 * @returns Promise with the public URL of the uploaded file
 */
export async function uploadFile(
  file: File,
  bucket: string = 'news-media',
  folder?: string
): Promise<string> {
  try {
    // Create a unique filename to avoid conflicts
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const fileExtension = file.name.split('.').pop();
    const fileName = `${timestamp}-${randomString}.${fileExtension}`;
    
    // Build the file path
    const filePath = folder ? `${folder}/${fileName}` : fileName;
    
    console.log('Uploading file:', { fileName, filePath, bucket });
    
    // Try upload with main client first
    let uploadResult = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    // If upload fails due to RLS, try with service role client
    if (uploadResult.error) {
      console.log('Main upload failed, trying with service role:', uploadResult.error);
      
      const serviceClient = getServiceRoleClient();
      if (serviceClient) {
        uploadResult = await serviceClient.storage
          .from(bucket)
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });
      }
    }
    
    if (uploadResult.error) {
      console.error('Error uploading file:', uploadResult.error);
      throw new Error(`Failed to upload file: ${uploadResult.error.message}`);
    }
    
    // Get the public URL
    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);
    
    if (!publicUrlData?.publicUrl) {
      throw new Error('Failed to get public URL for uploaded file');
    }
    
    console.log('Upload successful:', publicUrlData.publicUrl);
    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Error in uploadFile:', error);
    throw error;
  }
}

/**
 * Deletes a file from Supabase Storage
 * @param filePath - The path of the file to delete
 * @param bucket - The storage bucket name (default: 'news-media')
 * @returns Promise<void>
 */
export async function deleteFile(
  filePath: string,
  bucket: string = 'news-media'
): Promise<void> {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);
    
    if (error) {
      console.error('Error deleting file:', error);
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  } catch (error) {
    console.error('Error in deleteFile:', error);
    throw error;
  }
}

/**
 * Extracts the file path from a Supabase Storage URL
 * @param url - The full Supabase Storage URL
 * @returns The file path within the bucket
 */
export function extractFilePathFromUrl(url: string): string {
  // Example URL: https://abc.supabase.co/storage/v1/object/public/news-media/folder/file.jpg
  const parts = url.split('/');
  const bucketIndex = parts.findIndex(part => part === 'public') + 1;
  const filePath = parts.slice(bucketIndex + 1).join('/');
  return filePath;
}
