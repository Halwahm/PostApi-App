export enum Errors {
  INTERNAL_SERVER_ERROR = "Internal server error",
  FAILED_TO_DESTROY_SESSION = "Failed to destroy session",
  JWT_NOT_PROVIDED = "JWT must be provided in the .env file",
  ERROR_WHILE_FETCHING_DATA = "Error while fetching data from database",
  ERROR_WHILE_ADDING_DATA = "Error while adding data",
  ERROR_WHILE_UPDATING_DATA = "Error while updating data",
  ERROR_WHILE_DELETING_DATA = "Error while deleting data",
  FAILED_TO_REGISTER = "Failed to register user",
  FAILED_TO_RETRIEVE = "Failed to retrieve statistics",
  FAILED_TO_SEND_EMAIL = "Failed to send email",
  ERROR_WHILE_CONFIRMING_REGISTRATION = "Error while confirming registration",
  INVALID_RESET_CODE = "Invalid reset code"
}

export class AppError extends Error {
  constructor(
    public message: Errors,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
  }
}
