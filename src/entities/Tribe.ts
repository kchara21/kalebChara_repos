import { Column, CreateDateColumn, Entity, Equal, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { Equals, IsEmail, IsNotEmpty, Length, Max, MaxLength, Min, MinLength } from "class-validator";
import { Organization } from './Organization';
import { Repository } from './Repository';


@Entity()
@Unique(["id_tribe"])
export class Tribe {
  @PrimaryGeneratedColumn()
  id_tribe: number;

  @ManyToOne(()=>Organization,organization=>organization.tribes,{onDelete:'CASCADE',onUpdate:'CASCADE',nullable:false})
  organization:Organization;

  @OneToMany(()=>Repository,repository=>repository.tribe,{onDelete:'CASCADE',onUpdate:'CASCADE',nullable:false})
  repositories:Repository[];

  @Column({nullable:false})
  @Length(50)
  name: string;

  @Column({nullable:false,default:1})
  status: number;

  
}
