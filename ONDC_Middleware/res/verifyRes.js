const { isSignatureValid } =require('./index.js'); 

const verifyRes = async (req, res, next) => {
    console.log("enter it verfy res")
  const body = req.body; 
  const header = req.headers['authorization']; 

  if (!header || !body) {
    return res.status(400).json({ error: "Missing header or body in the request" });
  }

  try {
    const isValid = await isSignatureValid(header, body);
    
    if (isValid) {
      console.log("Signature verified successfully."); 
      next(); 
    } else {
      return res.status(401).json({ error: "Invalid signature" });
    }
  } catch (error) {
    console.error("Error during signature verification:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = verifyRes;
