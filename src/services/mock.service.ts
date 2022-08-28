import { AppDataSource } from "../data.source";
import { Repository } from "../entities/Repository";
import { request, Request, response, Response } from "express";

interface RespositoryMock {
  id: number;
  state: number;
}

export default class RepositoryMockService {
  static verificationState = async (req: Request, res: Response) => {
    let stateCode: number = 603;
    const repoDataSource = AppDataSource.getRepository(Repository);
    let repos: Repository[] = [];
    let repositories: RespositoryMock[] = [];

    try {
      repos = await repoDataSource.find({ where: { status: "A" } });
    } catch (e) {
      res.status(404).json({ message: "Something goes wrong!" });
    }

    for (const repo of repos) {
      stateCode++;
      repositories.push({ id: repo.id_repository, state: stateCode });
      if (stateCode > 605) {
        stateCode = 603;
      }
    }

    return repositories;
  };

  static resolveVerificationCode = (code: number) => {
    const verificationCodeResolver: any = {
      604: "Verificado",
      605: "En espera",
      606: "Aprobado",
    };

    return verificationCodeResolver[code];
  };
}
