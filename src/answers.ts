export const Answers = {
  AUTH: {
    AUTHORIZED: "Authorized",
    ALREADY_AUTHORIZED: "Already authorized",
    LOGGED_OUT_SUCCESSFULLY: "Logged out successfully",
    UNAUTHORIZED_OR_NO_PERM: "Unauthorized or have no permissions",
    INVALID_CREDENTIALS: "Invalid credentials",
    INVALID_TOKEN: "Invalid Token",
    INVALID_AUTH_DATA: "Invalid auth data",
    UNAUTHORIZED: "Unauthorized",
    NO_ACCESS: "No Access"
  },
  USER: {
    USER_NOT_FOUND: "User not found",
    ACCOUNT_ALREADY_ACTIVATED: "Account is already activated"
  },
  PASSWORD: {
    PASSWORD_HAS_NOT_ALL_NECESSARY_DATA:
      "Password must be at least 6 characters long and contain at least one lowercase letter, one uppercase letter, one digit, and one special character",
    RESET_CODE_SENT: "Reset code sent",
    PASSWORD_RESET_SUCCESSFULLY: "Password reset successfully",
    INVALID_CONFIRMATION_CODE: "Invalid confirmation code"
  },
  REGISTRATION: {
    REGISTERED: "Registered successfully",
    ALREADY_REGISTERED: "User with this email is already registered",
    REGISTRATION_CONFIRMED: "Registration confirmed successfully",
    INVALID_CODE_OR_EMAIL: "Invalid code or email",
    REGISTRATION_CONFIRMATION: "Registration Confirmation",
    CODE_IS: "Your confirmation code is:"
  },
  POST: {
    ALREADY_LIKED_POST: "You've already liked this post",
    NOT_LIKED_POST: "You haven't liked this post"
  },
  ERROR: {
    NOT_FOUND: "Not found",
    NOT_ENOUGH_DATA: "There is not enough data entered",
    INVALID_INPUT: "Invalid input",
    EXPRIRES_TIME: "Expires token time must be provided in the .env file",
    COOKIE_MAX_AGE_NOT_PROVIDED: "cookieMaxAge must be provided in the .env file",
    HSTS_MAX_AGE: "hstsMaxAge must be provided in the .env file",
    ERROR_CACHING: "Error caching token in Redis: ",
    ERROR_RETRIEVING: "Error retrieving token from Redis: ",
    SESSION_SECRET_NOT_PROVIDED: "SESSION_SECRET must be provided in the .env file",
    INVALID_REDIS_URL: "Redis_URL must be provided in the .env file"
  }
};
