import { Entity, Column, PrimaryColumn, BaseEntity } from 'typeorm';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryColumn('uuid') id: string;

  @Column('varchar', { length: 255 }) email: string;

  @Column('text') password: string;

  @Column('boolean', { default: false }) confirmed: boolean;
}
