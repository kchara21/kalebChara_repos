import {Router} from 'express';
import organization from './organization.route';
import repository from './repository.route';
import data from './data.route';


const routes = Router();

//Organization Routes
routes.use('/organization',organization);


//Organization Routes
routes.use('/tribe',repository);


// UploadData
routes.use('/data',data);





export default routes;