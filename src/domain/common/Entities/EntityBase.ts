import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class EntityBase {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column({ name: 'created_at' })
  createdAt!: Date;

  @Column({ name: 'updated_at' })
  updatedAt!: Date;
}
