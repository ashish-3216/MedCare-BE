export const authenticateUser = (req, res, next) => {
  const user_email = req.user?.email_id || req.session?.passport?.user;

  if (!user_email) {
    return res.status(401).json({ message: "Unauthorized. Please log in." });
  }

  req.user_email = user_email; // Attach email to request
  next(); 
};