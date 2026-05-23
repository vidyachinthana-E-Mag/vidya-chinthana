import { v2 as cloudinary } from 'cloudinary';

export async function onRequest(context: { request: Request; env: any }): Promise<Response> {
  const { request, env } = context;

  // Only POST allowed
  if (request.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const { username, password, dataUrl, filename } = await request.json();

    // TODO: Authenticate user – check app_users table
    // For now, simple password check (you can implement proper auth)
    // This is just a demo; in production use JWT or session.

    // Configure Cloudinary
    cloudinary.config({
      cloud_name: env.CLOUDINARY_CLOUD_NAME,
      api_key: env.CLOUDINARY_API_KEY,
      api_secret: env.CLOUDINARY_API_SECRET,
    });

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataUrl, {
      folder: 'vidya-chinthana',
      public_id: filename ? filename.replace(/\.[^/.]+$/, '') : `upload_${Date.now()}`,
      overwrite: true,
    });

    return Response.json({ url: result.secure_url });
  } catch (error: any) {
    console.error(error);
    return Response.json({ error: error.message || 'Upload failed' }, { status: 500 });
  }
}