import admin from 'firebase-admin';

// Initialize Firebase Admin SDK
// For development, you can use a service account key file
// For production, use environment variables or default credentials
if (!admin.apps.length) {
    // Option 1: Use service account key file (for development)
    // Uncomment and provide path to your service account JSON
    // const serviceAccount = require('path/to/serviceAccountKey.json');
    // admin.initializeApp({
    //   credential: admin.credential.cert(serviceAccount),
    // });

    // Option 2: Use environment variables (recommended for production)
    // Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (projectId && clientEmail && privateKey && privateKey !== "your-private-key") {
        try {
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId,
                    clientEmail,
                    privateKey,
                }),
            });
            console.log('Firebase Admin initialized with credentials');
        } catch (error) {
            console.warn('Failed to initialize Firebase Admin with credentials, falling back to default:', error);
            try { admin.initializeApp(); } catch (e) { console.error('Firebase default init failed:', e); }
        }
    } else {
        // Option 3: Use default credentials (for Cloud environments) or Mock for local
        try {
            if (admin.apps.length === 0) {
                admin.initializeApp();
                console.log('Firebase Admin initialized with default credentials');
            }
        } catch (error) {
            console.warn('Firebase Admin default initialization failed. This is expected if no credentials are provided locally.', error);
        }
    }
}

export const db = admin.firestore();
export const auth = admin.auth();
export { admin };
