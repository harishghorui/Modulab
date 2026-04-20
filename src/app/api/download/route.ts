import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');

  if (!url) {
    return new NextResponse('URL is required', { status: 400 });
  }

  try {
    let fetchUrl = url;

    // If it's a Cloudinary URL, try to generate a signed version to bypass "untrusted" restrictions
    if (url.includes('res.cloudinary.com')) {
      try {
        // Parse the URL to get resource_type and public_id
        // Pattern: /<resource_type>/<delivery_type>/<transformations>/v<version>/<public_id>
        const regex = /res\.cloudinary\.com\/[^/]+\/(image|video|raw)\/(upload|authenticated|private)\/(?:.[^/]+\/)*(?:v\d+\/)?([^?#]+)$/;
        const match = url.split('?')[0].match(regex);

        if (match) {
          const resourceType = match[1] as 'image' | 'video' | 'raw';
          const deliveryType = match[2];
          let publicId = match[3];

          // For images/videos, remove the extension from public_id as the SDK adds it
          if (resourceType !== 'raw') {
            publicId = publicId.replace(/\.[^/.]+$/, "");
          }

          // Generate a signed URL (expires in 1 hour)
          fetchUrl = cloudinary.url(publicId, {
            resource_type: resourceType,
            type: deliveryType,
            sign_url: true,
            secure: true,
          });
        }
      } catch (e) {
        console.error('Error parsing Cloudinary URL for signing:', e);
        // Fallback to original URL
      }
    }

    const response = await fetch(fetchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Cloudinary fetch failed:', response.status, errorText);
      throw new Error(`Cloudinary returned ${response.status}`);
    }

    const buffer = await response.arrayBuffer();
    const contentType = response.headers.get('Content-Type') || 'application/octet-stream';

    // Determine extension from content type or original URL
    let extension = '';
    const lowerUrl = url.toLowerCase();
    
    if (contentType.includes('word') || contentType.includes('msword') || contentType.includes('officedocument')) {
      extension = '.docx';
    } else if (contentType.includes('pdf')) {
      extension = '.pdf';
    } else if (lowerUrl.endsWith('.docx')) {
      extension = '.docx';
    } else if (lowerUrl.endsWith('.doc')) {
      extension = '.doc';
    } else if (lowerUrl.endsWith('.pdf')) {
      extension = '.pdf';
    } else {
      extension = '.pdf';
    }

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="Resume${extension}"`,
        'Cache-Control': 'no-cache'
      },
    });
  } catch (error: any) {
    console.error('Download proxy error:', error.message);
    // If proxy fails, redirect to the original URL as a absolute fallback
    return NextResponse.redirect(url);
  }
}
