// General Codes
const RequestResponse = {
  INVALID_PARAMS: 'REQ0',
  SERVER_ERROR: 'REQ1',
  REQUEST_PROCESSED: 'REQ2',
  UNAUTHORIZED: 'REQ3'
 }
 
 // Auth Codes
 const AuthResponse = {
     EMAIL_ALREADY_TAKEN: 'AUTH0',
     PASSWORD_TOO_SHORT: 'AUTH1',
     SESSION_EXPIRED: 'AUTH2',
     SESSION_DETECTED: 'AUTH3',
     SIGNUP_INITIATED: 'AUTH4',
     SIGNUP_CONFIRMED: 'AUTH5',
     LINK_INVALID: 'AUTH6',
     SIGNIN_INVALID: 'AUTH7',
     SIGNIN_SUCCESS: 'AUTH8',
     SIGNOUT_SUCCESS: 'AUTH9',
     EMAIL_NOT_FOUND: 'AUTH10',
     RESET_PASS_INITIATED: 'AUTH11',
     RESET_PASS_CONFIRMED: 'AUTH12',
 }

// User Codes
const UserResponse = {
  USER_GET_FAILED: 'USER0',
  USER_UPDATE_FAILED: 'USER1'
}

const StorageResponse = {
  STORAGE_REGISTRATION_FAILED: 'STORAGE0'
}

module.exports = {
  RequestResponse,
  AuthResponse,
  UserResponse,
  StorageResponse
}