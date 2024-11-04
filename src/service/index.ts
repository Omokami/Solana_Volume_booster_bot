import {
  Connection,
  PublicKey,
  Keypair,
  ParsedAccountData,
} from "@solana/web3.js";

import crypto from "crypto";
import config from "../config.json";

const ALGORITHM = "aes-256-gcm";
const ENCRYPTION_KEY = config.salt;
const IV_LENGTH = 12;
const connection = new Connection(config.rpcUrl);

/**
 * Encrypts a private key before storing it in the database.
 * @param privateKey The private key to encrypt.
 * @returns The encrypted private key.
 */
export const encryptPrivateKey = (privateKey: string): string => {
  if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 32) {
    throw new Error("Invalid encryption key length. Must be 32 characters.");
  }
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(
    ALGORITHM,
    Buffer.from(ENCRYPTION_KEY),
    iv
  );

  const encrypted = Buffer.concat([
    cipher.update(privateKey, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();

  return Buffer.concat([iv, tag, encrypted]).toString("base64");
};

/**
 * Decrypts an encrypted private key stored in the database.
 * @param encryptedPrivateKey The encrypted private key to decrypt.
 * @returns The decrypted private key.
 */
export const decryptPrivateKey = (encryptedPrivateKey: string): string => {
  if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 32) {
    throw new Error("Invalid encryption key length. Must be 32 characters.");
  }
  const encryptedBuffer = Buffer.from(encryptedPrivateKey, "base64");
  const iv = encryptedBuffer.slice(0, IV_LENGTH);
  const tag = encryptedBuffer.slice(IV_LENGTH, IV_LENGTH + 16);
  const encryptedText = encryptedBuffer.slice(IV_LENGTH + 16);

  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    Buffer.from(ENCRYPTION_KEY),
    iv
  );
  decipher.setAuthTag(tag);

  const decrypted = Buffer.concat([
    decipher.update(encryptedText),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
};
