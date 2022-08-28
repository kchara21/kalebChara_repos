import { AppDataSource } from "../data.source";
import { Request, Response } from "express";
import { validate } from "class-validator";
import { Organization } from "../entities/Organization";
import { Repository } from "typeorm";

export class OrganizationController {
  static getAll = async (req: Request, res: Response) => {
    let organizations: Organization[] = [];
    try {
      const userRepository = AppDataSource.getRepository(Organization);
      organizations = await userRepository.find({ where: { status: 1 } });
    } catch (e) {
      res.status(404).json({ message: "Something goes wrong!" });
    }

    organizations.length > 0
      ? res.json(organizations)
      : res.status(404).json({ message: "Not result information" });
  };

  static newOrganization = async (req: Request, res: Response) => {
    const { name, tribes } = req.body;
    const organization = new Organization();
    organization.name = name;
    organization.tribes = tribes;

    //Validate dont exist errors
    const validationOpts = { validationError: { target: false, value: false } };
    const errors = await validate(organization, validationOpts);
    if (errors.length > 0) return res.status(400).json(errors);

    try {
      //Create organization
      const organizationRepo: Repository<Organization> =
        AppDataSource.getRepository(Organization);
      const organizationExist: Organization[] = await organizationRepo.find({
        where: { name, status: 1 },
      });
      if (organizationExist.length > 0)
        return res.json({ message: `Organization ${name} already exist!` });

      await organizationRepo.save(organization);
    } catch (e) {
      return res.status(404).json({ message: e });
    }

    return res.status(201).json({ message: "Organization created" });
  };

  static editOrganization = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, tribes } = req.body;
    let organization: Organization;

    ////Validate exist organization
    const organizationRepo: Repository<Organization> =
      AppDataSource.getRepository(Organization);
    try {
      organization = await organizationRepo.findOneBy({
        id_organization: parseInt(id),
        status: 1,
      });
      organization.name = name;
      organization.tribes = tribes;
    } catch (e) {
      return res.status(404).json({ message: "Organization not found!" });
    }

    //Validate dont exist errors
    const validationOpts = { validationError: { target: false, value: false } };
    const errors = await validate(organization, validationOpts);
    if (errors.length > 0) return res.status(400).json({ message: errors });

    //Try to save the updated organization
    try {
      await organizationRepo.save(organization);
    } catch (e) {
      return res
        .status(409)
        .json({ message: `The organization ${name} already exist` });
    }

    return res.status(201).json({ message: "Organization updated" });
  };

  static deleteOrganization = async (req: Request, res: Response) => {
    const { id } = req.params;
    const organizationRepo = AppDataSource.getRepository(Organization);
    let organization: Organization;

    try {
      organization = await organizationRepo.findOneBy({
        id_organization: parseInt(id),
        status: 1,
      });
    } catch (e) {
      return res.status(400).json({ message: e });
    }

    if (!organization)
      return res.status(404).json({ message: "Organization not found" });

    try {
      await organizationRepo
        .createQueryBuilder()
        .update(Organization)
        .set({ status: 0 })
        .execute();
      return res
        .status(201)
        .json({ message: `Organization ${organization.name} deleted` });
    } catch (e) {
      res.status(400).json({ message: e });
    }
  };
}

export default OrganizationController;
