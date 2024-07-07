import { AuthError } from '@supabase/supabase-js';

const errorMap: { [key: string]: string } = {
  'auth/invalid-email': 'The email address is badly formatted.',
  'auth/email-already-in-use':
    'The email address is already in use by another account.',
  'auth/operation-not-allowed':
    'The operation is not allowed. Please contact support.',
  'auth/weak-password':
    'The password is too weak. Please choose a stronger password.',
  'auth/user-disabled':
    'The user account has been disabled. Please contact support.',
  'auth/user-not-found': 'There is no user corresponding to the given email.',
  'auth/wrong-password':
    'The password is invalid or the user does not have a password.',
  'auth/invalid-verification-code': 'The verification code is invalid.',
  'auth/invalid-verification-id': 'The verification ID is invalid.',
  'auth/missing-email':
    'The email field is missing. Please provide your email address.',
  'auth/missing-password':
    'The password field is missing. Please provide your password.',
  'auth/too-many-requests':
    'We have blocked all requests from this device due to unusual activity. Try again later.',
  'auth/requires-recent-login':
    'This operation is sensitive and requires recent authentication. Log in again before retrying this request.',
  'auth/network-request-failed':
    'A network error has occurred. Please check your internet connection and try again.',
  'auth/timeout': 'The request timed out. Please try again later.',
  'auth/internal-error':
    'An internal error has occurred. Please try again later.',
  'auth/invalid-api-key':
    'Your API key is invalid. Please check your configuration.',
  'auth/invalid-credential':
    'The supplied credentials are invalid. Please try again.',
  'auth/invalid-user-token': 'The user token is invalid. Please log in again.',
  'auth/invalid-tenant-id': 'The tenant ID is invalid.',
  'auth/account-exists-with-different-credential':
    'An account already exists with the same email address but different sign-in credentials. Sign in using a provider associated with this email address.',
  'auth/auth-domain-config-required':
    'Authentication domain configuration is required.',
  'auth/credential-already-in-use':
    'This credential is already associated with a different user account.',
  'auth/invalid-continue-uri': 'The continue URL provided is invalid.',
  'auth/missing-continue-uri': 'A continue URL is required.',
  'auth/unauthorized-continue-uri':
    'The domain of the continue URL is not whitelisted. Please contact support.',
  'auth/missing-phone-number':
    'The phone number is missing. Please provide a valid phone number.',
  'auth/quota-exceeded':
    'The quota for this operation has been exceeded. Please try again later.',
  'auth/unverified-email':
    'The email address has not been verified. Please check your inbox for a verification link.',
  'auth/app-deleted': 'The Firebase app has been deleted.',
  'auth/app-not-authorized':
    'This app is not authorized to use Firebase Authentication with the provided API key.',
  'auth/argument-error':
    'An invalid argument was provided. Please check your input and try again.',
  'auth/invalid-custom-token': 'The custom token is invalid. Please try again.',
  'auth/invalid-message-payload': 'The message payload provided is invalid.',
  'auth/missing-android-pkg-name': 'An Android package name is required.',
  'auth/missing-ios-bundle-id': 'An iOS bundle ID is required.',
  'auth/missing-verification-code': 'The verification code is missing.',
  'auth/missing-verification-id': 'The verification ID is missing.',
  'auth/invalid-user-import': 'The user import failed due to invalid data.',
  'auth/invalid-provider-id': 'The provider ID is invalid.',
  'auth/invalid-uid': 'The provided UID is invalid.',
  'auth/maximum-user-count-exceeded':
    'The maximum allowed number of users has been exceeded.',
  'auth/phone-number-already-exists':
    'The phone number is already in use by another account.',
  'auth/project-not-found': 'The project was not found.',
  'auth/uid-already-exists':
    'The provided UID is already in use by another account.',
  'auth/email-change-needs-verification':
    'The email change needs to be verified.',
  'auth/external-service-exception': 'An external service exception occurred.',
  'auth/invalid-assertion': 'The assertion was invalid.',
  'auth/missing-or-invalid-nonce': 'The nonce is missing or invalid.',
  'auth/transaction-aborted':
    'The transaction was aborted due to concurrent requests.',
  'auth/unexpected': 'An unexpected error occurred. Please try again later.',
};

const getErrorMessage = (error: AuthError): string => {
  if (error.code) {
    return errorMap[error.code];
  }
  return 'An unknown error occurred. Please try again later.';
};

export default getErrorMessage;
