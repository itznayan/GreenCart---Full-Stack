import jwt from "jsonwebtoken";

const authSeller = async (req, res, next) => {
  try {
    const { sellerToken } = req.cookies;

    if (!sellerToken) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized",
      });
    }

    const tokenDecode = jwt.verify(sellerToken, process.env.JWT_SECRET);

    if (tokenDecode.email !== process.env.SELLER_EMAIL) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized",
      });
    }

    req.seller = tokenDecode;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

export default authSeller;
