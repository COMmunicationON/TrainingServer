var express = require('express');
const dbController = require('../controllers/dbController');
var router = express.Router();

/* GET users listing. */
router.post('/', async function (req, res, next) {
  const { type, level } = req.body;

  try {
    const db = await dbController.connectDatabase();

    const collectionName = type + `${level}`;
    const collection = db.collection(collectionName);
    const result = await collection.aggregate([
      { $sample: { size: 10 } },
      //{ $addFields: {newField: "your_value" } },
      { $project: { _id: 0 } }
    ]).toArray();
    console.log('Random 10 items:', result);
    dbController.closeDatabase();
    res.status(200).json(result);
  } catch (err) {
    console.error('Error connecting DB:', err);
    dbController.closeDatabase();
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;