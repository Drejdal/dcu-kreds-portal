# Google Drive API Setup Guide

This guide will help you set up Google Drive integration for the DCU Kreds Portal.

## Prerequisites

- Google account
- Access to Google Cloud Console

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Name: "DCU Kreds Portal"
4. Click "Create"

## Step 2: Enable Google Drive API

1. In your project, go to "APIs & Services" → "Library"
2. Search for "Google Drive API"
3. Click on it and press "Enable"

## Step 3: Choose Authentication Method

You have two options:

### Option A: Service Account (Recommended for server-side)

**Pros:**
- No user interaction needed
- Better for automated tasks
- Simpler to implement

**Setup:**

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "Service Account"
3. Name: "dcu-kreds-drive-service"
4. Click "Create and Continue"
5. Grant role: "Editor" or custom role with Drive permissions
6. Click "Done"
7. Click on the created service account
8. Go to "Keys" tab
9. Click "Add Key" → "Create new key"
10. Choose "JSON" format
11. Save the downloaded file securely

**Share Drive Folders:**
1. Create a main folder in Google Drive named "DCU Kreds"
2. Right-click → Share
3. Add the service account email (from the JSON file)
4. Give it "Editor" access
5. Copy the folder ID from the URL

**Update .env:**
```env
GOOGLE_SERVICE_ACCOUNT_EMAIL="your-service-account@project.iam.gserviceaccount.com"
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_DRIVE_FOLDER_ID="your-main-folder-id"
```

### Option B: OAuth 2.0 (For user authentication)

**Pros:**
- Access user's personal Drive
- Better user experience

**Setup:**

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. Configure consent screen if prompted
4. Application type: "Web application"
5. Name: "DCU Kreds Portal"
6. Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://your-domain.com/api/auth/callback/google` (production)
7. Click "Create"
8. Save Client ID and Client Secret

**Update .env:**
```env
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"
GOOGLE_DRIVE_FOLDER_ID="your-main-folder-id"
```

## Step 4: Folder Structure

Create the following folder structure in Google Drive:

```
DCU Kreds/
├── Stævner/
│   └── (event folders will be created automatically)
├── Dokumenter/
│   ├── Referater/
│   ├── Vedtægter/
│   └── Skabeloner/
└── Galleri/
    └── (album folders will be created automatically)
```

Get the ID of the main "DCU Kreds" folder:
1. Open the folder in Google Drive
2. Copy the ID from the URL: `https://drive.google.com/drive/folders/FOLDER_ID_HERE`

## Step 5: Implement Integration

Update the functions in `lib/drive.ts` to use the Google Drive API.

### Example Implementation (Service Account)

```typescript
import { google } from 'googleapis'

export function getDriveClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/drive'],
  })
  
  return google.drive({ version: 'v3', auth })
}

export async function listFiles(folderId: string) {
  const drive = getDriveClient()
  const response = await drive.files.list({
    q: `'${folderId}' in parents and trashed=false`,
    fields: 'files(id, name, mimeType, createdTime, modifiedTime, size, webViewLink)',
    orderBy: 'name',
  })
  
  return response.data.files || []
}

// ... implement other functions
```

## Step 6: Create API Routes

Create API routes for file operations:

```typescript
// app/api/drive/list/route.ts
import { listFiles } from '@/lib/drive'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const folderId = request.nextUrl.searchParams.get('folderId')
  
  if (!folderId) {
    return NextResponse.json({ error: 'Folder ID required' }, { status: 400 })
  }
  
  try {
    const files = await listFiles(folderId)
    return NextResponse.json(files)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to list files' }, { status: 500 })
  }
}
```

## Security Considerations

1. **Never commit credentials to Git**
   - Add `.env` to `.gitignore` ✅ (already done)
   - Keep service account JSON files secure

2. **Use environment variables**
   - All secrets in `.env` file
   - Different credentials for development/production

3. **Limit API access**
   - Use principle of least privilege
   - Only grant necessary permissions

4. **Rate limiting**
   - Implement rate limiting on API routes
   - Handle quota errors gracefully

5. **Validate file uploads**
   - Check file types
   - Limit file sizes
   - Scan for malware if possible

## Testing

1. Test file listing:
```bash
curl http://localhost:3000/api/drive/list?folderId=YOUR_FOLDER_ID
```

2. Test file upload through UI
3. Test file download
4. Test folder creation

## Troubleshooting

### "Access denied" error
- Check service account has access to the folder
- Verify credentials in .env
- Ensure API is enabled

### "Invalid credentials" error
- Check private key format (newlines)
- Verify service account email
- Regenerate key if needed

### "Quota exceeded" error
- Check Google Cloud Console for quota limits
- Implement caching
- Request quota increase if needed

## Next Steps

1. Implement the drive.ts functions
2. Create API routes for file operations
3. Update UI components to use the API
4. Add file upload forms
5. Implement error handling
6. Add progress indicators
7. Test thoroughly

## Resources

- [Google Drive API Documentation](https://developers.google.com/drive/api/v3/about-sdk)
- [googleapis npm package](https://www.npmjs.com/package/googleapis)
- [Google Cloud Console](https://console.cloud.google.com/)
- [Drive API Quotas](https://developers.google.com/drive/api/v3/limits)
