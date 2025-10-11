import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request) {
  try {
    const data = await request.formData();
    const file = data.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file received' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name}`;

    // Use environment variable for upload directory or default to public/packages
    const uploadDir = process.env.UPLOAD_DIR || path.resolve(process.cwd(), 'public', 'packages');
    const filepath = path.join(uploadDir, filename);

    console.log('Upload directory:', uploadDir);
    console.log('File path:', filepath);

    // Ensure directory exists
    try {
      await mkdir(path.dirname(filepath), { recursive: true });
      console.log('Directory ensured:', path.dirname(filepath));
    } catch (dirError) {
      console.error('Failed to create directory:', dirError);
      return NextResponse.json({ error: 'Failed to create upload directory' }, { status: 500 });
    }

    // Write file
    try {
      await writeFile(filepath, buffer);
      console.log('File written successfully:', filepath);
    } catch (writeError) {
      console.error('Failed to write file:', writeError);
      return NextResponse.json({ error: 'Failed to write file' }, { status: 500 });
    }

    // Return the public URL
    const url = `/packages/${filename}`;

    return NextResponse.json({ url });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
