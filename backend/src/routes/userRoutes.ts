import { Router } from 'express';
import { UserController } from '../controllers/UserController';

const router = Router();
const userController = new UserController();

router.get('/', userController.getAll);

router.get('/:id', userController.getById);

// Rota para obter sessões do usuário
router.get('/:userId/sessions', userController.getUserSessions);

router.post('/', userController.create);

router.put('/:id', userController.update);

router.delete('/:id', userController.delete);

export default router;
