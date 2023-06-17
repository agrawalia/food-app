const { MongoClient, ObjectId } = require("mongodb");
const uri = require("./atlas_uri.js");

console.log(uri);

const client = new MongoClient(uri);

const pipeline = [
  { $match: { balance: { $lt: 1000 } } },
  {
    $group: {
      _id: "$account_type",
      total_balance: { $sum: "$balance" },
      avg_balance: { $avg: "$balance" },
    },
  },
];

 const dbname = "bank";
// const collection_name = "accounts";
// const accountsCollection = client.db(dbname).collection(collection_name);
//const transfers = client.db(dbname).collection("transfers");

const connectToDatabase = async () => {
  try {
    await client.connect();
    console.log(`Connected to ${dbname} database`);
  } catch (err) {
    console.error(`Error connecting to database ${err}`);
  }
};
const restaurants = 
{
  "address": {
     "building": "1007",
     "coord": [ -73.856077, 40.848447 ],
     "street": "Morris Park Ave",
     "zipcode": "10462"
  },
  "borough": "Bronx",
  "cuisine": "Bakery",
  "grades": [
     { "date": { "$date": 1393804800000 }, "grade": "A", "score": 2 },
     { "date": { "$date": 1378857600000 }, "grade": "A", "score": 6 },
     { "date": { "$date": 1358985600000 }, "grade": "A", "score": 10 },
     { "date": { "$date": 1322006400000 }, "grade": "A", "score": 9 },
     { "date": { "$date": 1299715200000 }, "grade": "B", "score": 14 }
  ],
  "name": "Morris Park Bake Shop",
  "restaurant_id": "30075445"
}
const sampleAccount = [
  {
    account_holder: "Jack Dan",
    account_id: "MDB10001",
    account_type: "checking",
    balance: 50353545,
  },
  {
    account_holder: "Mick Tenyson",
    account_id: "MDB10002",
    account_type: "savings",
    balance: 50353545,
  },
];

const documentToFind = { balance: { $gt: 4700 } };
const documentToUpdate = { account_type: "checking" };
//const documentToDelete = {_id: ObjectId("63a5585cb71c5104cadb47bb")}
const documentToDelete = { balance: { $lt: 500 } };
const update = { $inc: { balance: 100 } };

const main = async () => {
  try {
    await connectToDatabase();
    //let result = await accountsCollection.insertMany(sampleAccount);
    //let result = await client.db("bank").collection("restaurant").insertOne(restaurants);
    //let result = await client.db("bank").collection("restaurant").find({"borough" : "Bronx"})
    //let result = await client.db("bank").collection("restaurant").find({"borough" : "Bronx"}).limit(5);
    let result = await client.db("bank").collection("restaurant").find({grades : {$elemMatch : {"score" : {$gt : 10}}}})
    
    //console.log(query);
    //let result = await accountsCollection.find(documentToFind);
    //let result = await accountsCollection.findOne(documentToFind);
    //let result = await accountsCollection.updateOne(documentToUpdate, update);
    //let result = await accountsCollection.updateMany(documentToUpdate, update);
    //let result = await accountsCollection.deleteOne(documentToDelete);
    //let result = await accountsCollection.deleteMany(documentToDelete);

    // const accounts = client.db("bank").collection("accounts");
    // let result = await accounts.aggregate(pipeline);

    for await (const doc of result) {
      console.log(doc);
    }

    // result.deletedCount == 1
    //   ? console.log("Deleted one document")
    //   : console.log("No documents deleted");
    // console.log(result);
    //let docCount = await accountsCollection.countDocuments(documentToFind);
    //await result.forEach((doc) => console.log(doc));
    //console.log(`Found ${docCount} documents`);

    //console.log(result);
    //console.log(`Inserted ${result.insertedCount} documents`)
    //console.log(`Inserted document : ${result.insertedId}`);
  } catch (err) {
    console.error(`Error connecting to database ${err}`);
  } finally {
    await client.close();
  }
};

main();
