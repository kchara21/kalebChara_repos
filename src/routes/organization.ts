import {Router} from 'express';
import {OrganizationController} from '../controllers/organizationController';

const router = Router();

//Create organization
router.get('/',OrganizationController.getAll);

//Census organization
router.post('/',OrganizationController.newOrganization);

//Edit organization
router.put('/:id',OrganizationController.editOrganization);

//Delete organization
router.delete('/:id',OrganizationController.deleteOrganization);


export default router;