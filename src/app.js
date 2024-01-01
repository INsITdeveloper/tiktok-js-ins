/**
 * @github.com/motebaya - © 2023-10
 * file: app.js
 */
import { config } from "dotenv";
config();
import express from "express";
import url from "url";
import router from "../routes/index.js";
import path from "path";
import minifyHTML from "express-minify-html";
import bodyParser from "body-parser";
import logger from "../lib/logger/logging.js";
import morgan from "morgan";
import fs from "node:fs";

const app = express();
const base = url.fileURLToPath(new URL(".", import.meta.url));

/**
 * middleware
 * @morgan->logger
 */
app.use(
  morgan(
    ":remote-addr :method :url :status :res[content-length] - :response-time ms",
    {
      stream: {
        write: (message) => {
          logger({ level: "debug", longformat: true }).http(message);
        },
      },
    }
  )
);

/**
 * middleware
 * @bodyParser->body parsing
 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("json spaces", 2);

/**
 * middleware
 * @minifyHTML->express js minify html
 */
app.use(
  minifyHTML({
    override: true,
    exception_url: false,
    htmlMinifier: {
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      minifyJS: true,
    },
  })
);
console.log(process.cwd());
console.log(fs.readdirSync(process.cwd()));
console.log(fs.readdirSync(path.join(process.cwd(), "views")));
app.set("views", path.join(base, "../views"));
app.set("view engine", "ejs");

// static set
app.use(express.static(path.join(base, "../public"), { etag: true }));
// router
app.use(router);

export default app;
