
const express = require("express");
const mongoose = require("mongoose");

const cookieSession = require("cookie-session");
const passport = require("passport");

const keys = require("./config/keys");

require("./models/User");
require("./services/passport");

//const keys = require("./config/keys");
mongoose.connect(keys.mongoURI);


const app = express();
app.use(
    cookieSession({
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        keys: [keys.cookieKey]
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static('client/build'));

require("./routes/authRoutes")(app);

app.get('', (req, res) => {
    res.send({hi: 'there'});
});

const PORT = process.env.PORT || 8080;
app.listen(PORT);

