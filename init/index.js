const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../Models/listing.js");
const MONGO_URL = "mongodb+srv://rlohitha88_db_user:47TSxtwNld6PJTjM@cluster0.rjees5v.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
connectDb()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });
async function connectDb() {
  await mongoose.connect(MONGO_URL);
}
const initDb = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: '68dbe1a4aca9fc83a978f1ae',
  }));
  await Listing.insertMany(initData.data);
  console.log("Data is initialized");
};
initDb();
