var express = require('express');
var router = express.Router();

const studentController = require('../controllers').student;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* Student Router */
router.get('/', studentController.list);
router.get('/:id', studentController.getById);
router.post('/', studentController.add);
router.put('/:id', studentController.update);
router.delete(':id', studentController.delete);

/* Advance Router */
router.post('/add_per', studentController.addCourse);

module.exports = router;
