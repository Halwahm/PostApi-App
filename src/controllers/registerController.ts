import { Request, Response } from "express";
import { registerUser, confirmRegistration } from "../services/registerService";
import { Answers } from "../answers";
import { generateConfirmationCode, sendEmail } from "../utils/emailSendingUtil";
import {
  addConfirmationCode,
  getConfirmationCode,
  deleteConfirmationCode
} from "../utils/confirmCodeUtil";

export const registerUserHandler = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const confirmationCode = generateConfirmationCode().toString();
  try {
    const newUser = await registerUser(name, email, password);
    if (newUser) {
      const emailContent = `
        <p>Hello ${name},</p>
        <p>Thank you for registering with us!</p>
        <p>Your confirmation code is: ${confirmationCode}</p>
      `;
      await sendEmail(email, Answers.REGISTRATION.REGISTRATION_CONFIRMATION, emailContent);
      addConfirmationCode(email, confirmationCode);
      res.status(201).json({ message: Answers.REGISTRATION.REGISTERED, newUser });
    } else res.status(400).json({ message: Answers.REGISTRATION.ALREADY_REGISTERED });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const confirmRegistrationHandler = async (req: Request, res: Response) => {
  const { email, code } = req.body;
  const storedCode = getConfirmationCode(email);
  if (!email || storedCode !== code)
    res.status(400).json({ message: Answers.PASSWORD.INVALID_CONFIRMATION_CODE });
  else {
    try {
      const success = await confirmRegistration(email);
      if (success) {
        deleteConfirmationCode(email);
        res.status(201).json({ message: Answers.REGISTRATION.REGISTRATION_CONFIRMED });
      } else res.status(400).json({ message: Answers.REGISTRATION.INVALID_CODE_OR_EMAIL });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};
