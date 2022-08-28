import { AppDataSource } from "../data.source";
import { Request, Response } from "express";
import { Metric } from "../entities/Metric";
import moment from "moment";
import RepositoryMockService from "../services/mock.service";
import { Repository_Interface } from "../interface/repository.interface";
import * as path from 'path';
const csvWriter = require("csv-writer");

export class RepositoryController {
  static resolveVerificationCode = (code: string) => {
    const verificationState: any = {
      E: "Enabled",
      D: "Disabled",
      A: "Archived",
    };

    return verificationState[code];
  };

  static getRepositoriesByTribe = async (req: Request, res: Response) => {
    let metricsExist: Metric[];
    let repositoryArray: Repository_Interface[] = [];

    try {
      const currentDate = moment().year() + "-01-01  00:00:00.000";
      const metricRepository = AppDataSource.getRepository(Metric);
      const { id } = req.params;

      metricsExist = await metricRepository
        .createQueryBuilder("metric")
        .innerJoinAndSelect("metric.repository", "repository")
        .innerJoinAndSelect("repository.tribe", "tribe")
        .innerJoinAndSelect("tribe.organization", "organization")
        .where("tribe.id_tribe=:id", { id })
        .andWhere("repository.status=:status", { status: "A" })
        .andWhere("repository.create_time >= :create_time", {
          create_time: currentDate,
        })
        .getMany();
    } catch (e) {
      return res.status(404).json({ message: "Something goes wrong!" });
    }

    if (metricsExist.length < 1) {
      return res
        .status(404)
        .json({ message: "La Tribu no se encuentra registrada" });
    }

    const metricsCoverage = metricsExist.filter(
      (metric) => metric.coverage > 75
    );

    if (metricsCoverage.length < 1) {
      return res.status(404).json({
        message:
          "La Tribu no tiene repositorios que cumplan con la cobertura necesaria",
      });
    }

    for (const metric of metricsCoverage) {
      const repositoriesState = await RepositoryMockService.verificationState(
        req,
        res
      );

      const stateEntity = repositoriesState.find(
        (item) => item.id === metric.repository.id_repository
      );

      if (!stateEntity) return;

      const repository_verificationState =
        await RepositoryMockService.resolveVerificationCode(stateEntity.state);

      repositoryArray.push({
        id: metric.repository.id_repository,
        name: metric.repository.name,
        tribe: metric.repository.tribe.name,
        organization: metric.repository.tribe.organization.name,
        coverage: metric.coverage + "%",
        codeSmells: metric.code_smells,
        bugs: metric.bugs,
        vulnerabilities: metric.vulnerabilities,
        hotspots: metric.hotspot,
        verificationState: repository_verificationState,
        state: this.resolveVerificationCode(metric.repository.state),
      });
    }

    return res.status(200).json({
      repositories: repositoryArray,
    });
  };

  static exportRepositoriesByTribe = async (req: Request, res: Response) => {
    const writer = csvWriter.createObjectCsvWriter({
      path: path.resolve(__dirname, "repositories.csv"),
      header: [
        { id: "id", title: "Id" },
        { id: "name", title: "Name" },
        { id: "tribe", title: "Tribe" },
        { id: "organization", title: "Organization" },
        { id: "coverage", title: "Coverage" },
        { id: "codeSmells", title: "Code Smells" },
        { id: "bugs", title: "Bugs" },
        { id: "vulnerabilities", title: "Vulnerabilities" },
        { id: "hotspots", title: "Hotspots" },
        { id: "verificationState", title: "Verification State" },
        { id: "state", title: "State" },

      ],
    });
  };
}
export default RepositoryController;
