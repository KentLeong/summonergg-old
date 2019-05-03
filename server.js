const express = require("express");
const path = require("path");
const http = require("http");
const bodyParser = require("body-parser");
const config = require("config");
const mongoose = require("mongoose");

const app = express();
const db = require("./config").mongoURI;