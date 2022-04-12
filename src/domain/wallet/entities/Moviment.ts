import { Column, Entity } from 'typeorm';

import EntityBase from '../../common/Entities/EntityBase';

@Entity()
export default class Moviment extends EntityBase {
  @Column()
  date!: Date;

  @Column()
  value!: number;

  @Column()
  obs?: string;

  @Column({ name: 'wallet_id' })
  walletId!: string;

  @Column({ name: 'descriptor_id' })
  descriptorId!: string;
}
