import admin from 'firebase-admin';

/**
 * Parse the Firebase private key from environment variable.
 * Handles multiple formats:
 * - Keys with literal \n characters (from .env files)
 * - Keys with escaped \\n characters
 * - Keys wrapped in quotes
 * - Base64 encoded keys
 */
function parsePrivateKey(key: string | undefined): string | undefined {
    if (!key || key === 'your-private-key') {
        return undefined;
    }

    let parsedKey = key;

    // Remove surrounding quotes if present
    if ((parsedKey.startsWith('"') && parsedKey.endsWith('"')) ||
        (parsedKey.startsWith("'") && parsedKey.endsWith("'"))) {
        parsedKey = parsedKey.slice(1, -1);
    }

    // Check if it's base64 encoded (no spaces, no dashes at start)
    if (!parsedKey.includes('-----') && !parsedKey.includes(' ')) {
        try {
            const decoded = Buffer.from(parsedKey, 'base64').toString('utf-8');
            if (decoded.includes('-----BEGIN')) {
                parsedKey = decoded;
            }
        } catch {
            // Not base64, continue with original
        }
    }

    // Replace escaped newlines with actual newlines
    // Handle both \\n (double escaped) and \n (single escaped as literal)
    parsedKey = parsedKey
        .replace(/\\\\n/g, '\n')  // \\n -> \n
        .replace(/\\n/g, '\n');    // \n -> newline

    // Ensure proper PEM format
    if (!parsedKey.includes('-----BEGIN')) {
        console.error('Private key is missing BEGIN header');
        return undefined;
    }

    if (!parsedKey.includes('-----END')) {
        console.error('Private key is missing END footer');
        return undefined;
    }

    return parsedKey;
}

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = parsePrivateKey(process.env.FIREBASE_PRIVATE_KEY);

    if (projectId && clientEmail && privateKey) {
        try {
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId,
                    clientEmail,
                    privateKey,
                }),
            });
            console.log('✓ Firebase Admin initialized with credentials');
        } catch (error) {
            console.error('✗ Failed to initialize Firebase Admin:', error);
            // Try default initialization
            try {
                admin.initializeApp();
                console.log('✓ Firebase Admin initialized with default credentials');
            } catch (e) {
                console.error('✗ Firebase default init also failed:', e);
            }
        }
    } else {
        // Use default credentials (for Cloud environments)
        try {
            admin.initializeApp();
            console.log('✓ Firebase Admin initialized with default credentials');
        } catch (error) {
            console.warn('⚠ Firebase Admin initialization skipped - no credentials provided');
        }
    }
}

export const db = admin.firestore();
export const auth = admin.auth();
export { admin };

