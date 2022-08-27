import { Column, CreateDateColumn, Entity, Equal, JoinColumn, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { Equals, IsEmail, IsNotEmpty, Length, Max, MaxLength, Min, MinLength } from "class-validator";
import { Tribe } from './Tribe';


@Entity()
@Unique(["id_organization"])
export class Organization {
  @PrimaryGeneratedColumn()
  id_organization: number;

  @OneToMany(()=>Tribe,tribe=>tribe.organization,{nullable:false})
  tribes:Tribe[];
  

  @Column({nullable:false})
  @MaxLength(50)
  name: string;

  @Column({nullable:false,default:1})
  status: number;

}
