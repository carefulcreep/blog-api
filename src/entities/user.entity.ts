import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import Role from './role.enum';

@Entity()
export default class User {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Index()
  @Column({ unique: true })
  public email: string;

  @Column()
  public firstName: string;

  @Column()
  public lastName: string;

  @Column()
  @Exclude()
  public password: string;

  @Column({ default: false })
  public blocked: boolean;

  @Column({
    type: 'enum',
    enum: Role,
    array: true,
    default: [Role.Blogger],
  })
  public roles: Role[];

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public createdAt?: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updatedAt?: Date;
}
