import {Router} from 'express';
import {RepositoryController} from '../controllers/repository.controller';

const router = Router();

//Create organization
router.get('/:id/repositories',RepositoryController.getRepositoriesByTribe);


export default router;