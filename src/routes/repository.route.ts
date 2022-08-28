import {Router} from 'express';
import {RepositoryController} from '../controllers/repository.controller';

const router = Router();


router.get('/:id/repositories',RepositoryController.getRepositoriesByTribe);



router.get('/:id/repositories/export',RepositoryController.exportRepositoriesByTribe);



export default router;