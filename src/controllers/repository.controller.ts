import { AppDataSource } from "../data.source";
import { Request, Response } from "express";
import { Metric } from "../entities/Metric";
import moment from "moment";
import RepositoryMockService from "../services/mock.service";
import { Repository_Interface } from "../interface/repository.interface";
import * as path from "path";

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
    const { bool } = req.query;
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

    if (bool) {
      return repositoryArray;
    }

    return res.status(200).json({
      repositories: repositoryArray,
    });
  };

  static exportRepositoriesByTribe = async (req: Request, res: Response) => {
    const fastcsv = require("fast-csv");
    const fs = require("fs");
    const repositories = await this.getRepositoriesByTribe(req, res);
    const ws = fs.createWriteStream("repositories.csv");

    try{
      fastcsv
      .write(repositories, { headers: true })
      .pipe(ws)
      .createReadStream("../reports");
    }catch(e){
      return res.status(400).json({ message: e });
    }

    return res.status(202).json({ message: "File exported" });
  };
}
export default RepositoryController;
