import { Column, CreateDateColumn, Entity, Equal, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Timestamp, Unique, UpdateDateColumn } from "typeorm";
import { Equals, IsEmail, IsNotEmpty, Length, Max, MaxLength, Min, MinLength } from "class-validator";
import { Tribe } from './Tribe';
// import {state,status } from '../interfaces/repository.interface';

export type state = "E" | "E" | "A";
export type status = "A" | "I";




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

  @Column({nullable:false})
  state: state;

  @Column({nullable:false})
  @CreateDateColumn()
  create_time: Timestamp;

  @Column({nullable:false})
  status: status;

}
