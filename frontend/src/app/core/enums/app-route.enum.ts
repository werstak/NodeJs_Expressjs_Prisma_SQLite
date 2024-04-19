export enum AppRouteEnum {
  // Authentication routes
  Login = 'login',                 // Route for logging in
  Auth = 'auth',                   // Route for authentication
  Registration = 'registration',   // Route for user registration
  ForgotPassword = 'forgot-password', // Route for password recovery

  // Password reset routes
  ResetPassword = 'reset-password',   // Route for resetting password
  NewPassword = 'new-password',       // Route for setting new password

  // Content routes
  Users = 'users',        // Route for managing users
  Posts = 'posts',        // Route for managing posts

  // Error route
  NotFound = 'not-found', // Route for 404 Not Found page
}
