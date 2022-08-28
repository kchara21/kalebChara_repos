import { AppDataSource } from "../data_source";
import { NextFunction, Request, Response } from "express";
import { validate } from "class-validator";
import { Organization } from "../entities/Organization";
import { Repository } from "typeorm";
import { Repository as Repo } from "../entities/Repository";
import { Metric } from "../entities/Metric";
import { Tribe } from "../entities/Tribe";

export class LoadData {
  static createOrganization = async (req: Request, res: Response) => {
    for (let i = 0; i < 2; i++) {
      const organization = new Organization();
      organization.name = `nttdata_0${i}`;

      //Create organization
      const organizationRepo: Repository<Organization> =
        AppDataSource.getRepository(Organization);

      try {
        await organizationRepo.save(organization);
      } catch (e) {
        return res.status(404).json({ message: e });
      }
    }

    return res.status(201).json({ message: "Organizations created" });
  };

  static createTribu = async (req: Request, res: Response) => {
    for (let i = 0; i < 2; i++) {
      let organization: Organization;
      const organizationRepo = AppDataSource.getRepository(Organization);
      try {
        organization = await organizationRepo.findOne({
          where:{name:`nttdata_0${i}`}
        });
      } catch (e) {
        return res.status(404).json({ message: "Not Result" });
      }

      //CREATING TRIBE
      const tribeRepo = AppDataSource.getRepository(Tribe);

      const tribe: Tribe = new Tribe();
      tribe.name = `tribe_front_0${i + 1}`;
      tribe.organization = organization;

      // VALIDATION
      const validationOpts = {
        validationError: { target: false, value: false },
      };
      const errors = await validate(organization, validationOpts);
      if (errors.length > 0) return res.status(400).json(errors);

      try {
        await tribeRepo.save(tribe);
      } catch (e) {
        return res.status(400).json(errors);
      }
    }

    return res.status(201).json({ message: "Tribes created" });
  };

  static createRepository = async (req: Request, res: Response) => {
    for (let i = 0; i < 2; i++) {
      let tribe: Tribe;
      const tribeRepo = AppDataSource.getRepository(Tribe);
      try {
        tribe = await tribeRepo.findOne({ where:{name:`tribe_front_0${i+1}`}});
      } catch (e) {
        return res.status(404).json({ message: "Not Result" });
      }

      // CREATING REPOSITORY
      const repositoryDataSource = AppDataSource.getRepository(Repo);
      let repository = new Repo();

      repository.name = `repo_nttdata${i + 1}`;
      repository.state = "E";
      repository.status = "A";
      repository.tribe = tribe;

      // VALIDATE
      const validationOpts = {
        validationError: { target: false, value: false },
      };
      const errors = await validate(repository, validationOpts);
      if (errors.length > 0) {
        return res.status(400).json(errors);
      }

      try {
        await repositoryDataSource.save(repository);
      } catch (e) {
        return res.status(404).json({ message: e });
      }
    }

    return res.status(201).json({ message: "Repositories created" });
  };

  static createMetric = async (req: Request, res: Response) => {
    for (let i = 0; i < 2; i++) {
      let repository: Repo;
      const organizationRepo = AppDataSource.getRepository(Repo);
      try {
        repository = await organizationRepo.findOne({ where:{name:`repo_nttdata${i+1}`}});
      } catch (e) {
        return res.status(404).json({ message: "Not Result" });
      }

      //CREATING METRICS
      const metricsRepo = AppDataSource.getRepository(Metric);
      const metric: Metric = new Metric();
      metric.coverage = 80.00+i;
      metric.bugs = 4+i;
      metric.vulnerabilities = 2+i;
      metric.hotspot = 1+i;
      metric.code_smells = 0+i;
      metric.repository = repository;

      // VALIDATION
      const validationOpts = {
        validationError: { target: false, value: false },
      };
      const errors = await validate(metric, validationOpts);
      if (errors.length > 0) return res.status(400).json(errors);

      try {
        await metricsRepo.save(metric);
      } catch (e) {
        return res.status(400).json(e);
      }
    }

    return res.status(201).json({ message: "Metrics created" });
  };


  static watchAll = async (req: Request, res: Response) => {
    // const userRepository = AppDataSource.getRepository(Organization);

    // let organizations: Organization[];
    // try {
    //   organizations = await userRepository.find({
    //     relations: ["tribes", "tribes.repositories"],
    //   });
    // } catch (e) {
    //   res.status(404).json({ message: "Something goes wrong!" });
    // }

    // console.log(organizations);
    // organizations.length > 0
    //   ? res.json(organizations)
    //   : res.status(404).json({ message: "Not result" });


      const metricRepositoriy = AppDataSource.getRepository(Metric);
      let metrics: Metric[];
      try {
        metrics = await metricRepositoriy.find({
          relations: ["repository", "repository.tribe","repository.tribe.organization"],
        });
      } catch (e) {
        res.status(404).json({ message: "Something goes wrong!" });
      }
      metrics.length > 0
      ? res.json(metrics)
      : res.status(404).json({ message: "Not result" });






  };
}

export default LoadData;
