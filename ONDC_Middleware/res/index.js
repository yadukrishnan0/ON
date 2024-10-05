const _sodium = require("libsodium-wrappers");
const _ = require("lodash");
const vlookup = require("../../AXIOS/vlookup.js");

const createSigningString = async (message, created, expires) => {
  console.log("enter createSigningString");

  if (!created) created = Math.floor(new Date().getTime() / 1000).toString();
  if (!expires) expires = (parseInt(created) + 1 * 60 * 60).toString();

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

const getProviderPublicKey = async (provider) => {
  console.log("enter Privider public key");
  try {
    return provider?.signing_public_key || false;
  } catch (e) {
    return false;
  }
};
const lookupBppById = async ({ subscriber_id, type, domain }) => {
  const request = { subscriber_id, type, domain };
  return vlookup(request);
};

const lookupRegistry = async (subscriber_id, domain) => {
  console.log("enter lookupRegistry");
  try {
    const response = await lookupBppById({
      type: "BPP",
      subscriber_id: subscriber_id,
      domain: domain,
    });

    if (!response) {
      return false;
    }

    const public_key = await getProviderPublicKey(response);

    if (!public_key) return false;

    return public_key;
  } catch (e) {
    return false;
  }
};

const remove_quotes = (a) => {
  return a.replace(/^["'](.+(?=["']$))["']$/, "$1");
};

const split_auth_header = (auth_header) => {
  const header = auth_header.replace("Signature ", "");
  let re = /\s*([^=]+)=([^,]+)[,]?/g;
  let m;
  let parts = {};
  while ((m = re.exec(header)) !== null) {
    if (m) {
      parts[m[1]] = remove_quotes(m[2]);
    }
  }
  return parts;
};

const verifyMessage = async (signedString, signingString, publicKey) => {
  console.log("enter verifyMessage");

  try {
    await _sodium.ready;
    const sodium = _sodium;
    return sodium.crypto_sign_verify_detached(
      sodium.from_base64(signedString, _sodium.base64_variants.ORIGINAL),
      signingString,
      sodium.from_base64(publicKey, _sodium.base64_variants.ORIGINAL)
    );
  } catch (error) {
    return false;
  }
};

const verifyHeader = async (headerParts, body, public_key) => {
  console.log("enter verifyHeader");
  const { signing_string } = await createSigningString(
    JSON.stringify(body),
    headerParts["created"],
    headerParts["expires"]
  );
  const verified = await verifyMessage(
    headerParts["signature"],
    signing_string,
    public_key
  );
  console.log("verified:", verified);
  return verified;
};
const isSignatureValid = async (header, body) => {
  console.log("enter it isSignatureValid ");

  try {
    const headerParts = split_auth_header(header);
    const keyIdSplit = headerParts["keyId"].split("|");
    const subscriber_id = keyIdSplit[0];
    const keyId = keyIdSplit[1];
    const public_key = await lookupRegistry(subscriber_id, body.context.domain);

    const isValid = await verifyHeader(headerParts, body, public_key);
    return isValid;
  } catch (e) {
    return false;
  }
};

module.exports = {
  createSigningString,
  isSignatureValid,
};
