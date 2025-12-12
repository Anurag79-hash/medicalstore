module.exports = {
  adminAuth: function(req, res, next) {
    if(!req.session.user) return res.redirect("/login");
    if (!req.session.user || req.session.user.role !== "admin") {
  return res.redirect("/login?error=Access Denied");
}

    next();
  },

  isLoggedIn: function(req, res, next) {
    if (req.session && req.session.user) {
      req.user = req.session.user; // IMPORTANT!
      return next();
    }
    return res.redirect("/login");
  },

  noCache: function(req, res, next) {
    res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
    next();
  }
};
