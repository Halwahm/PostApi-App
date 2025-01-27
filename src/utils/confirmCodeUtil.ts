import fs from "fs";

const CONFIRMATION_CODES_FILE = "confirmationCodes.json";

interface ConfirmationCodes {
  [email: string]: string;
}

const loadConfirmationCodes = (): ConfirmationCodes => {
  try {
    const data = fs.readFileSync(CONFIRMATION_CODES_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error loading confirmation codes: ", error);
    return {};
  }
};

const saveConfirmationCodes = (codes: ConfirmationCodes) => {
  try {
    fs.writeFileSync(CONFIRMATION_CODES_FILE, JSON.stringify(codes, null, 2));
  } catch (error) {
    console.error("Error saving confirmation codes: ", error);
  }
};

export const addConfirmationCode = (email: string, code: string) => {
  const confirmationCodes = loadConfirmationCodes();
  confirmationCodes[email] = code;
  saveConfirmationCodes(confirmationCodes);
};

export const getConfirmationCode = (email: string): string | undefined => {
  const confirmationCodes = loadConfirmationCodes();
  return confirmationCodes[email];
};

export const deleteConfirmationCode = (email: string) => {
  const confirmationCodes = loadConfirmationCodes();
  delete confirmationCodes[email];
  saveConfirmationCodes(confirmationCodes);
};
