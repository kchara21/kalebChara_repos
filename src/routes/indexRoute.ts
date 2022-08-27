import {Router} from 'express';
import organization from './organization';
import data from './data';
import LoadData from '../services/loadData.service';


const routes = Router();

//Organization Routes
routes.use('/organization',organization);


// UploadData
routes.use('/upload',data);





export default routes;