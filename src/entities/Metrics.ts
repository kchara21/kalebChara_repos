import { Column, CreateDateColumn, Double, Entity, Equal, JoinColumn, OneToOne, PrimaryGeneratedColumn, Timestamp, Unique, UpdateDateColumn } from "typeorm";
import { Equals, IsEmail, IsNotEmpty, Length, Max, MaxLength, Min, MinLength } from "class-validator";
import { Repository } from './Repository';


@Entity()
@Unique(["id_repository"])
export class Metrics {
  @PrimaryGeneratedColumn()
  @OneToOne(()=>Repository)
  @JoinColumn()
  id_repository: Repository;

  @Column({type:"decimal",precision:2,scale:2})
  @Max(100)
  coverage: number;

  @Column()
  bugs: number;

  @Column()
  vulnerabilities: number;

  @Column()
  hotspot: number;

  @Column()
  code_smells: number;

}
