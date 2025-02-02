const passport = require("passport");
const FacebookStrategy = require("passport-facebook");
const prisma = require("../prisma/prisma-client");
const { envKeys } = require(".");

// passport.serializeUser((user, cb) => {
//   cb(null, user.profile_id);
// });

// passport.deserializeUser(async (profile_id, cb) => {
//   try {
//     const user = await prisma.facebook_channel_details.findUnique({
//       where: { profile_id },
//     });
//     cb(null, user);
//   } catch (error) {
//     cb(error);
//   }
// });

passport.use(
  new FacebookStrategy(
    {
      clientID: envKeys.fbAppId,
      clientSecret: envKeys.fbAppSecret,
      callbackURL: `${envKeys.baseUrl}:${envKeys.port}/auth/facebook/redirect`,
    },
    async function (accessToken, refreshToken, profile, cb) {
      try {
        const current_user = 1; // Main User
        const facebook_channel = await prisma.channels.findUnique({
          where: {
            type: "facebook_messenger",
          },
        });
        let user_channel = await prisma.user_channels.findUnique({
          where: {
            user_id: current_user,
            channel_id: facebook_channel.id,
          },
        });

        if (!user_channel) {
          user_channel = await prisma.facebook_channel_details.create({
            data: {
              user_id: current_user,
              channel_id: facebook_channel.id,
            },
          });
        }
        const facebookDetails =
          await prisma.facebook_channel_details.findUnique({
            where: { profile_id: profile.id },
          });

        if (!facebookDetails) {
          const newFacebookDetails =
            await prisma.facebook_channel_details.create({
              data: {
                user_channel_id: user_channel.id,
                profile_id: profile.id,
                full_name: profile.displayName,
                access_token: accessToken,
              },
            });
          cb(null, newFacebookDetails);
        } else {
          cb(null, facebookDetails);
        }
      } catch (error) {
        cb(error);
      }
    }
  )
);
