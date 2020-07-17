const mongoose = require("mongoose");
const path = 'mongodb://127.0.0.1:27017/gsb-order-dashboard';

mongoose.connect(process.env.DB_PATH || path, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", () => {
    console.log("> error occurred from the database");
});

db.once("open", () => {
    console.log("> successfully opened the database");
});

module.exports = mongoose;

module.exports = {
  database: mongoose,
  connectionString: path
}
