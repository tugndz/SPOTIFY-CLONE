import { clerkClient } from '@clerk/express';

export const protectRoute = (req, res, next) => {
  const auth = req.auth();
  if (!auth?.userId) return res.status(401).json({ message: "Bạn phải đăng nhập" });
  next();
};

export const requireAdmin = async (req, res, next) => {
  try {
    const auth = req.auth();
    const currentUser = await clerkClient.users.getUser(auth.userId);
    const isAdmin = process.env.ADMIN_EMAIL === currentUser.primaryEmailAddress?.emailAddress;
    if (!isAdmin) return res.status(403).json({ message: "Bạn không phải admin" });
    next();
  } catch (err) {
    next(err);
  }
};
