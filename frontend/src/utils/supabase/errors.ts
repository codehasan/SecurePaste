import { AuthError, isAuthApiError } from '@supabase/supabase-js';

const errorMap: { [key: string]: string } = {
  bad_code_verifier:
    'Invalid request due to incorrect code verifier. Please refresh and try again.',
  bad_json:
    'The request format is incorrect. Please check your input and try again.',
  bad_jwt: 'Your session has expired. Please sign in again to continue.',
  bad_oauth_callback:
    'An error occurred during login. Please try logging in again.',
  bad_oauth_state:
    'Invalid request due to state mismatch. Please refresh and try again.',
  captcha_failed:
    'Captcha verification failed. Please complete the captcha again.',
  conflict: 'A conflict occurred with your request. Please try again later.',
  email_conflict_identity_not_deletable:
    'Your email is in conflict. Please contact support for assistance.',
  email_exists:
    'This email is already registered. Please sign in or use a different email.',
  email_not_confirmed:
    'Your email is not confirmed. Please check your email for the confirmation link.',
  email_provider_disabled:
    'Email signup is currently disabled. Please try a different method.',
  flow_state_expired:
    'Your session has expired. Please sign in again to continue.',
  flow_state_not_found: 'Session not found. Please sign in again.',
  identity_already_exists:
    'An account with this identity already exists. Try logging in instead.',
  identity_not_found:
    'Account not found. Please check your credentials and try again.',
  insufficient_aal:
    'Additional authentication required. Please complete the verification.',
  invite_not_found: 'The invite link is invalid. Please request a new one.',
  manual_linking_disabled:
    'Manual linking of accounts is disabled. Contact support for help.',
  mfa_challenge_expired:
    'Your multi-factor authentication challenge has expired. Please retry.',
  mfa_factor_name_conflict:
    'A verification method with this name already exists. Use a different name.',
  mfa_factor_not_found: 'Verification method not found. Please try again.',
  mfa_ip_address_mismatch:
    'IP address mismatch detected. Please retry the verification.',
  mfa_verification_failed:
    'Multi-factor authentication failed. Please try again.',
  mfa_verification_rejected:
    'Multi-factor authentication rejected. Please wait and try again later.',
  no_authorization: 'Authorization required. Please sign in to continue.',
  not_admin: 'Admin access is required to perform this action.',
  oauth_provider_not_supported:
    'This OAuth provider is not supported. Please use a different provider.',
  otp_disabled:
    'One-time passwords are currently disabled. Contact support for help.',
  otp_expired: 'Your OTP has expired. Please request a new one.',
  over_email_send_rate_limit:
    'Too many emails sent. Please wait a while before trying again.',
  over_request_rate_limit:
    'Too many requests made. Please wait a while before trying again.',
  over_sms_send_rate_limit:
    'Too many SMS sent. Please wait a while before trying again.',
  phone_exists:
    'This phone number is already registered. Sign in or use a different number.',
  phone_not_confirmed:
    'Your phone number is not confirmed. Check your messages for the confirmation link.',
  phone_provider_disabled:
    'Phone number signup is currently disabled. Please try a different method.',
  provider_disabled:
    'This provider is currently disabled. Contact support for help.',
  provider_email_needs_verification:
    'Email verification required for this provider. Check your email.',
  reauthentication_needed: 'Please sign in again to complete this action.',
  reauthentication_not_valid: 'Reauthentication failed. Please sign in again.',
  same_password: 'The new password cannot be the same as the old password.',
  saml_assertion_no_email:
    'Email is missing in the SAML response. Contact support.',
  saml_assertion_no_user_id:
    'User ID is missing in the SAML response. Contact support.',
  saml_entity_id_mismatch: 'Entity ID mismatch detected. Contact support.',
  saml_idp_already_exists:
    'This identity provider already exists. Contact support for assistance.',
  saml_idp_not_found: 'Identity provider not found. Please check your details.',
  saml_metadata_fetch_failed:
    'Failed to fetch SAML metadata. Please check the URL.',
  saml_provider_disabled:
    'This SAML provider is disabled. Contact support for help.',
  saml_relay_state_expired: 'Session expired. Please sign in again.',
  saml_relay_state_not_found: 'Session not found. Please sign in again.',
  session_not_found: 'Session not found. Please sign in again.',
  signup_disabled: 'Signups are currently disabled.',
  single_identity_not_deletable: 'You cannot delete your only identity.',
  sms_send_failed: 'Failed to send SMS. Please try again.',
  sso_domain_already_exists:
    'This domain already exists. Contact support for assistance.',
  sso_provider_not_found: 'SSO provider not found. Please check your details.',
  too_many_enrolled_mfa_factors:
    'Too many verification methods. Remove some before adding new ones.',
  unexpected_audience: 'Unexpected request. Please try again.',
  unexpected_failure: 'An unexpected error occurred. Please try again later.',
  user_already_exists:
    'An account with this email already exists. Use a different email or sign in.',
  user_banned: 'Your account is banned. Contact support for more information.',
  user_not_found: 'Account not found. Please check your details and try again.',
  user_sso_managed:
    'This account is managed by SSO. Updates cannot be made here.',
  validation_failed: 'Invalid input. Please check your details and try again.',
  weak_password: 'Your password is too weak. Please use a stronger password.',
};

const apiErrorMap: { [key: number]: string } = {
  401: 'Authentication failed due to invalid credentials.',
  403: 'Access denied. You are not permitted to use this feature.',
  404: 'The requested resource does not exist.',
  422: 'Unable to process your request at the moment. Please try again later.',
  429: 'Server is experiencing high traffic. Please try again later.',
  500: 'An internal error occurred. Please check your credentials and try again later.',
  501: 'This feature is currently unavailable. Please try again later.',
  502: 'Bad gateway. The server is down or being upgraded. Please try again later.',
  503: 'The server is unavailable. Please try again later.',
  504: 'The server took too long to respond. Please try again later.',
};

const getErrorMessage = (error: AuthError): string => {
  let errorMessage: string = '';

  if (isAuthApiError(error)) {
    errorMessage = apiErrorMap[error.status];
  }

  if (error.code) {
    errorMessage ||= errorMap[error.code];
  }

  return errorMessage || 'An unknown error occurred. Please try again later.';
};

export default getErrorMessage;
