import fs from "fs";

const RESET_CODES_FILE = "resetCodes.json";
let resetCodes: { [key: string]: string } = {};

export const loadResetCodes = () => {
  try {
    const data = fs.readFileSync(RESET_CODES_FILE, "utf-8");
    resetCodes = JSON.parse(data);
  } catch (error) {
    console.log("Error loading reset codes: ", error.message);
  }
};

export const saveResetCodes = () => {
  fs.writeFileSync(RESET_CODES_FILE, JSON.stringify(resetCodes));
};

export const addResetCode = (email: string, code: string) => {
  loadResetCodes();
  resetCodes[email] = code;
  saveResetCodes();
};

export const verifyResetCode = (email: string, code: string) => {
  loadResetCodes();
  return resetCodes[email] === code;
};

export const deleteResetCode = (email: string) => {
  loadResetCodes();
  delete resetCodes[email];
  saveResetCodes();
};
