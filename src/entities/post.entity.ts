import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import Status from './status.enum';

@Entity()
export default class Post {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public header: string;

  @Column()
  public body: string;

  @Column()
  public createdBy: string;

  @Column({
    type: 'enum',
    enum: Status,
    array: false,
    default: [Status.Visible],
  })
  public postStatus: Status[];

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
