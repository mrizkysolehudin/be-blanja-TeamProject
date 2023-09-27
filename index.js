const express = require("express");
const cors = require("cors");
const xss = require("xss-clean");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

const allRouters = require("./src/routers/index");

const PORT = 5000;
const app = express();

app.use((req, res, next) => {
	res.header("Access-Control-Allow-Credentials", "true");
	next();
});
app.use(express.static("public"));
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(xss());
app.use(cookieParser());

// routers
app.use("/api", allRouters);

app.listen(PORT, () => {
	console.log(`Server berjalan di PORT: ${PORT}`);
});
