import { Column, CreateDateColumn, Entity, Equal, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Timestamp, Unique, UpdateDateColumn } from "typeorm";
import { Equals, IsEmail, IsNotEmpty, Length, Max, MaxLength, Min, MinLength } from "class-validator";
import { Tribe } from './Tribe';
import { Status, State } from '../interfaces/repository.interface';


@Entity()
@Unique(["id_repository"])
export class Repository {
  @PrimaryGeneratedColumn()
  id_repository: number;

  @ManyToOne(()=>Tribe,tribe=>tribe.repositories,{onDelete:'CASCADE',nullable:false})
  tribe:Tribe;
  

  @Column({nullable:false})
  @MaxLength(50)
  name: string;

  @Column("json",{nullable:false})
  state: State;

  @Column({nullable:false})
  @CreateDateColumn()
  create_time: Timestamp;

  @Column("json",{nullable:false})
  status: Status;

}
