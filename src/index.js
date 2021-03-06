const express = require("express");
const morgan = require("morgan");
const exphbs = require("express-handlebars");
const path = require("path");
const session = require("express-session");
const MySQLStore = require("express-mysql-session");
const passport = require("passport");

const { database } = require("./keys");

// Initializations
const app = express();
require("./passport");

// Settings
app.set("port", process.env.PORT || 4000);
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.engine(
  ".hbs",
  exphbs({
    defaultLayout: "main",
    layoutsDir: path.join(app.get("views"), "layouts"),
    partialsDir: path.join(app.get("views"), "partials"),
    extname: ".hbs",
  })
);
app.set("view engine", ".hbs");

// Middlewares
app.use(
  session({
    secret: "petspot",
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database),
  })
);
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

// Globar Variables
app.use((req, res, next) => {
  app.locals.user = req.user;
  next();
});

// Routes
app.use(require("./routes/authentication"));

//Starting the server
app.listen(app.get("port"), () => {
  console.log("Sever on port", app.get("port"));
});
