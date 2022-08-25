import { Column, CreateDateColumn, Entity, Equal, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Timestamp, Unique, UpdateDateColumn } from "typeorm";
import { Equals, IsEmail, IsNotEmpty, Length, Max, MaxLength, Min, MinLength } from "class-validator";
import { Tribe } from './Tribe';


@Entity()
@Unique(["id_repository"])
export class Repository {
  @PrimaryGeneratedColumn()
  id_repository: number;

  @ManyToOne(()=>Tribe,tribe=>tribe.repositories,{onDelete:'CASCADE'})
  tribe:Tribe;
  

  @Column()
  @Length(50)
  name: string;

  @Column()
  @Length(1)
  state: string;

  @Column()
  @CreateDateColumn()
  create_time: Timestamp;

  @Column()
  @Length(1)
  status: string;

}
