export const ensureAuthenticated = (req, res, next) => {
    console.log("🔍 Checking authentication...");
    console.log("🔍 Checking authentication...");
    console.log("🔍 Session data:", req.session);

    if (req.session?.user) {
        console.log("✅ Session authenticated:", req.session.user);
        req.user = req.session.user;
        return next();
      }
    res.status(401).json({ error: "Unauthorized" });
  };