const router = require("express").Router();
const passport = require("passport");

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/logout", (req, res) => {
  res.send("Logout");
});

router.get(
  "/facebook",
  passport.authenticate("facebook", {
    scope: [
      "email",
      "pages_messaging",
      "pages_show_list",
      "pages_read_engagement",
      "pages_manage_engagement",
      "pages_read_user_content",
      "pages_manage_metadata",
      "pages_manage_posts",
      "instagram_basic",
      "instagram_manage_messages",
      "instagram_manage_comments",
      "pages_manage_ads",
      "leads_retrieval",
    ],
  })
);

router.get(
  "/facebook/redirect",
  passport.authenticate("facebook", { failureRedirect: "/auth/login" }),
  (req, res) => {
    if (req.isAuthenticated()) {
      res.redirect("/dashboard");
    } else {
      res.redirect("/");
    }
  }
);

module.exports = router;
