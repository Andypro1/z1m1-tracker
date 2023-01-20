import dotenv from 'dotenv';

dotenv.config();

export const envport     = process.env.PORT;
export const envcertpath = process.env.CERT_PATH;
export const envkeypath  = process.env.KEY_PATH;