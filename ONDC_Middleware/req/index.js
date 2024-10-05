const _sodium = require("libsodium-wrappers");
const _ = require("lodash");

// Function to create the signing string
const createSigningString = async (message, created, expires) => {
  if (!created) created = Math.floor(new Date().getTime() / 1000).toString();
  if (!expires) expires = (parseInt(created) + 1 * 60 * 60).toString() + 5000;

  await _sodium.ready;

  const sodium = _sodium;
  const digest = sodium.crypto_generichash(64, sodium.from_string(message));
  const digest_base64 = sodium.to_base64(
    digest,
    _sodium.base64_variants.ORIGINAL
  );

  const signing_string = `(created): ${created}
(expires): ${expires}
digest: BLAKE-512=${digest_base64}`;

  return { signing_string, created, expires };
};

// Function to sign the message
const signMessage = async (signing_string, privateKey) => {
  await _sodium.ready;
  const sodium = _sodium;

  try {
    const signedMessage = sodium.crypto_sign_detached(
      signing_string,
      sodium.from_base64(privateKey, _sodium.base64_variants.ORIGINAL)
    );
    return sodium.to_base64(signedMessage, _sodium.base64_variants.ORIGINAL);
  } catch (error) {
    console.error("Error signing message:", error);
    throw new Error("Error signing message");
  }
};

// Function to create the Authorization header
const createAuthorizationHeader = async (message) => {
  if (
    !process.env.BAP_PRIVATE_KEY ||
    !process.env.BAP_ID ||
    !process.env.BAP_UNIQUE_KEY_ID
  ) {
    throw new Error("Missing required environment variables");
  }

  const { signing_string, expires, created } = await createSigningString(
    JSON.stringify(message)
  );

  const signature = await signMessage(
    signing_string,
    process.env.BAP_PRIVATE_KEY
  );

  const subscriber_id = process.env.BAP_ID;
  const unique_key_id = process.env.BAP_UNIQUE_KEY_ID;
  const header = `Signature keyId="${subscriber_id}|${unique_key_id}|ed25519",algorithm="ed25519",created="${created}",expires="${expires}",headers="(created) (expires) digest",signature="${signature}"`;

  return header;
};

// Export all the functions as an object
module.exports = {
  createSigningString,
  signMessage,
  createAuthorizationHeader
};
