import { Column, CreateDateColumn, Double, Entity, Equal, JoinColumn, OneToOne, PrimaryGeneratedColumn, Timestamp, Unique, UpdateDateColumn } from "typeorm";
import { Equals, IsEmail, IsNotEmpty, Length, Max, MaxLength, Min, MinLength } from "class-validator";
import { Repository } from './Repository';


@Entity()
@Unique(["id_metric"])
export class Metric {
  @PrimaryGeneratedColumn()
  id_metric: number;

  @OneToOne(()=>Repository)
  @JoinColumn()
  repository:Repository

  @Column({type:"decimal",precision:10,scale:2,nullable:false})
  @Max(100)
  coverage: number;

  @Column({nullable:false})
  bugs: number;

  @Column({nullable:false})
  vulnerabilities: number;

  @Column({nullable:false})
  hotspot: number;

  @Column({nullable:false})
  code_smells: number;

}
