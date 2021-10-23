import { Router } from 'express';
const router = Router();

import { userController } from '../controllers/index.js';

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* User Router */
router.get('/', userController.getAll);
router.get('/:id', userController.getById);
router.post('/', userController.create);
router.put('/:id', userController.update);
router.delete(':id', userController.delete);

/* Advance Router */

export default router;
