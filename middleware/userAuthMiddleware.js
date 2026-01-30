import { jwtVerify } from 'jose';

const userAuthMiddleware = async (req, res, next) => {
  try {
    // ✅ Cookie OR Authorization header (both supported)
    const token =
      req.cookies?.['user-auth-token'] ||
      (req.headers.authorization?.startsWith('Bearer ')
        ? req.headers.authorization.split(' ')[1]
        : null);

    if (!token) {
      return res.status(401).json({
        message: 'Authentication token missing',
      });
    }

    // 🔥 SAME secret as login
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    const { payload } = await jwtVerify(token, secret, {
      issuer: 'iifb',
      audience: 'iifb-audience',
    });

    req.user = {
      userId: payload.userId,
      email: payload.email,
    };

    next();
  } catch (err) {
    console.error('User auth failed:', err.message);

    // optional cleanup
    res.clearCookie('user-auth-token');

    return res.status(403).json({
      message: 'Invalid or expired token',
    });
  }
};

export default userAuthMiddleware;
