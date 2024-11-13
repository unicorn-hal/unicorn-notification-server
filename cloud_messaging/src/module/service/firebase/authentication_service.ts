import { FirebaseCore } from "../core/firebase_core";
import admin from 'firebase-admin';

export class AuthenticationService extends FirebaseCore {
    async verifyIdToken(idToken: string) {
        console.log('Verifying ID token...');
        try {
            const auth = admin.auth(this.app);
            const decodedToken = await auth.verifyIdToken(idToken);
            console.log('Successfully verified ID token:', decodedToken);
            return decodedToken;
        } catch (error) {
            console.error('Error verifying ID token:', error);
            throw error;
        }
    }
}