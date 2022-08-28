import { AppDataSource } from "../data_source";
import { Request, Response } from "express";
import { Metric } from "../entities/Metric";
import moment from "moment";
import MockService from "../services/mock.service";

export class RepositoryController {
  static getByIdTribe = async (req: Request, res: Response) => {
    let repositoryArray: Object[] = [];
    const { id } = req.params;
    const start = moment().year();
    const metricRepository = AppDataSource.getRepository(Metric);
    let metricsExist: Metric[];

    try {
      metricsExist = await metricRepository
        .createQueryBuilder("metric")
        .innerJoinAndSelect("metric.repository", "repository")
        .innerJoinAndSelect("repository.tribe", "tribe")
        .innerJoinAndSelect("tribe.organization", "organization")
        .where("tribe.id_tribe=:id", { id })
        .andWhere("repository.state=:state", { state: "E" })
        .andWhere("repository.create_time >= :create_time", {
          create_time: `${start}-01-01  00:00:00.000`,
        })
        .getMany();
    } catch (e) {
      return res.status(404).json({ message: "Something goes wrong!" });
    }

    if (metricsExist.length > 0) {
      const metricsCoverageExist = metricsExist.filter(
        (metric) => metric.coverage > 75
      );

      if (metricsCoverageExist.length > 0) {
        for (const metric of metricsCoverageExist) {
          const repositoryState = await MockService.verificationState(req, res);

          const stateEntity = repositoryState.find(
            (item) => item.id === metric.repository.id_repository
          );
          if (!stateEntity) return;

          const repository_verificationState =
            MockService.resolveVerificationCode(stateEntity.state);

          repositoryArray.push({
            id: metric.repository.id_repository,
            name: metric.repository.name,
            tribe: metric.repository.tribe.name,
            organization: metric.repository.tribe.organization.name,
            coverage: metric.coverage + "%",
            codeSmells: metric.code_smells,
            bugs: metric.bugs,
            vulnerabilities: metric.vulnerabilities,
            hotsposts: metric.hotspot,
            verificationState: repository_verificationState,
            state: metric.repository.state,
          });
        }

        res.status(200).json({
          repositories: repositoryArray,
        });
      } else {
        res.status(404).json({
          message:
            "La Tribu no tiene repositorios que cumplan con la cobertura necesaria",
        });
      }
    } else {
      return res
        .status(404)
        .json({ message: "La Tribu no se encuentra registrada" });
    }
  };
}
export default RepositoryController;
