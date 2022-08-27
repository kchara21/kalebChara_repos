import {Router} from 'express';
import LoadData from '../services/loadData.service';


const router = Router();

//Create organization
router.post('/organization',LoadData.createOrganization);

//Create organization
router.get('/watchAll',LoadData.watchAll);

//Create tribu
router.post('/tribe',LoadData.createTribu);

//Create tribu
router.post('/repository',LoadData.createRepository);


//Create tribu
router.post('/metric',LoadData.createMetric);

//Create 



export default router;