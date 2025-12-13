import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GOOGLE_CLIENT_ID = Deno.env.get('GOOGLE_CLIENT_ID') || '';
const GOOGLE_CLIENT_SECRET = Deno.env.get('GOOGLE_CLIENT_SECRET') || '';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
}

async function refreshAccessToken(refreshToken: string): Promise<TokenResponse> {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to refresh token');
  }
  
  return response.json();
}

async function getOrRefreshToken(supabase: any, userId: string) {
  const { data: tokenData, error } = await supabase
    .from('google_drive_tokens')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error || !tokenData) {
    return null;
  }
  
  // Check if token is expired (with 5 min buffer)
  const expiresAt = new Date(tokenData.expires_at);
  const now = new Date();
  now.setMinutes(now.getMinutes() + 5);
  
  if (expiresAt <= now) {
    console.log('Token expired, refreshing...');
    const newTokens = await refreshAccessToken(tokenData.refresh_token);
    
    const newExpiresAt = new Date();
    newExpiresAt.setSeconds(newExpiresAt.getSeconds() + newTokens.expires_in);
    
    await supabase
      .from('google_drive_tokens')
      .update({
        access_token: newTokens.access_token,
        expires_at: newExpiresAt.toISOString(),
      })
      .eq('user_id', userId);
    
    return newTokens.access_token;
  }
  
  return tokenData.access_token;
}

async function createFolder(accessToken: string, name: string, parentId?: string) {
  const metadata: any = {
    name,
    mimeType: 'application/vnd.google-apps.folder',
  };
  
  if (parentId) {
    metadata.parents = [parentId];
  }
  
  const response = await fetch('https://www.googleapis.com/drive/v3/files', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(metadata),
  });
  
  if (!response.ok) {
    const error = await response.text();
    console.error('Create folder error:', error);
    throw new Error('Failed to create folder');
  }
  
  return response.json();
}

async function findOrCreateFolder(accessToken: string, name: string, parentId?: string) {
  // Search for existing folder
  let query = `name='${name}' and mimeType='application/vnd.google-apps.folder' and trashed=false`;
  if (parentId) {
    query += ` and '${parentId}' in parents`;
  }
  
  const searchResponse = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}`,
    {
      headers: { 'Authorization': `Bearer ${accessToken}` },
    }
  );
  
  const searchResult = await searchResponse.json();
  
  if (searchResult.files && searchResult.files.length > 0) {
    return searchResult.files[0];
  }
  
  return createFolder(accessToken, name, parentId);
}

async function uploadFile(accessToken: string, file: Blob, fileName: string, folderId: string) {
  const metadata = {
    name: fileName,
    parents: [folderId],
  };
  
  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  form.append('file', file);
  
  const response = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
    {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${accessToken}` },
      body: form,
    }
  );
  
  if (!response.ok) {
    const error = await response.text();
    console.error('Upload error:', error);
    throw new Error('Failed to upload file');
  }
  
  return response.json();
}

async function listFiles(accessToken: string, folderId?: string) {
  let query = "mimeType contains 'image/' and trashed=false";
  if (folderId) {
    query += ` and '${folderId}' in parents`;
  }
  
  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id,name,mimeType,thumbnailLink,webContentLink)&pageSize=100`,
    {
      headers: { 'Authorization': `Bearer ${accessToken}` },
    }
  );
  
  if (!response.ok) {
    throw new Error('Failed to list files');
  }
  
  return response.json();
}

async function listFolders(accessToken: string, parentId?: string) {
  let query = "mimeType='application/vnd.google-apps.folder' and trashed=false";
  if (parentId) {
    query += ` and '${parentId}' in parents`;
  }
  
  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id,name)&pageSize=100`,
    {
      headers: { 'Authorization': `Bearer ${accessToken}` },
    }
  );
  
  if (!response.ok) {
    throw new Error('Failed to list folders');
  }
  
  return response.json();
}

async function getFileContent(accessToken: string, fileId: string) {
  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
    {
      headers: { 'Authorization': `Bearer ${accessToken}` },
    }
  );
  
  if (!response.ok) {
    throw new Error('Failed to get file content');
  }
  
  return response;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const url = new URL(req.url);
    const action = url.searchParams.get('action');

    // Handle OAuth callback
    if (action === 'callback') {
      const code = url.searchParams.get('code');
      const redirectUri = url.searchParams.get('redirect_uri');
      
      if (!code) {
        return new Response(JSON.stringify({ error: 'No code provided' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      // Exchange code for tokens
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: GOOGLE_CLIENT_ID,
          client_secret: GOOGLE_CLIENT_SECRET,
          redirect_uri: redirectUri || '',
          grant_type: 'authorization_code',
        }),
      });
      
      if (!tokenResponse.ok) {
        const error = await tokenResponse.text();
        console.error('Token exchange error:', error);
        return new Response(JSON.stringify({ error: 'Failed to exchange code' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      const tokens: TokenResponse = await tokenResponse.json();
      
      const expiresAt = new Date();
      expiresAt.setSeconds(expiresAt.getSeconds() + tokens.expires_in);
      
      // Upsert tokens
      const { error: upsertError } = await supabase
        .from('google_drive_tokens')
        .upsert({
          user_id: user.id,
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          expires_at: expiresAt.toISOString(),
        }, { onConflict: 'user_id' });
      
      if (upsertError) {
        console.error('Upsert error:', upsertError);
        return new Response(JSON.stringify({ error: 'Failed to save tokens' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check connection status
    if (action === 'status') {
      const accessToken = await getOrRefreshToken(supabase, user.id);
      return new Response(JSON.stringify({ connected: !!accessToken }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get auth URL
    if (action === 'auth-url') {
      const redirectUri = url.searchParams.get('redirect_uri');
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${GOOGLE_CLIENT_ID}&` +
        `redirect_uri=${encodeURIComponent(redirectUri || '')}&` +
        `response_type=code&` +
        `scope=${encodeURIComponent('https://www.googleapis.com/auth/drive.file')}&` +
        `access_type=offline&` +
        `prompt=consent`;
      
      return new Response(JSON.stringify({ url: authUrl }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // All other actions require valid token
    const accessToken = await getOrRefreshToken(supabase, user.id);
    if (!accessToken) {
      return new Response(JSON.stringify({ error: 'Not connected to Google Drive', needsAuth: true }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // List folders
    if (action === 'list-folders') {
      const parentId = url.searchParams.get('parent_id') || undefined;
      const result = await listFolders(accessToken, parentId);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // List files
    if (action === 'list-files') {
      const folderId = url.searchParams.get('folder_id') || undefined;
      const result = await listFiles(accessToken, folderId);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create organized folder structure and upload
    if (action === 'upload') {
      const formData = await req.formData();
      const file = formData.get('file') as File;
      const clientName = formData.get('client_name') as string;
      const packageType = formData.get('package_type') as string;
      const category = formData.get('category') as string; // homepage, client-gallery, etc.
      
      if (!file) {
        return new Response(JSON.stringify({ error: 'No file provided' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      // Create folder structure: Photography / Category / Client / Package
      const rootFolder = await findOrCreateFolder(accessToken, 'Photography');
      const categoryFolder = await findOrCreateFolder(accessToken, category || 'Uncategorized', rootFolder.id);
      
      let targetFolder = categoryFolder;
      
      if (clientName) {
        const clientFolder = await findOrCreateFolder(accessToken, clientName, categoryFolder.id);
        targetFolder = clientFolder;
        
        if (packageType) {
          const packageFolder = await findOrCreateFolder(accessToken, packageType, clientFolder.id);
          targetFolder = packageFolder;
        }
      }
      
      const uploadedFile = await uploadFile(accessToken, file, file.name, targetFolder.id);
      
      return new Response(JSON.stringify({ success: true, file: uploadedFile }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get file for sending to client
    if (action === 'get-file') {
      const fileId = url.searchParams.get('file_id');
      if (!fileId) {
        return new Response(JSON.stringify({ error: 'No file ID provided' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      const fileResponse = await getFileContent(accessToken, fileId);
      const contentType = fileResponse.headers.get('Content-Type') || 'application/octet-stream';
      
      return new Response(fileResponse.body, {
        headers: { ...corsHeaders, 'Content-Type': contentType },
      });
    }

    // Disconnect
    if (action === 'disconnect') {
      await supabase
        .from('google_drive_tokens')
        .delete()
        .eq('user_id', user.id);
      
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Unknown action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    console.error('Error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});