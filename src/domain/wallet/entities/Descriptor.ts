import { Column, Entity } from 'typeorm';

import EntityBase from '../../common/Entities/EntityBase';

@Entity()
export default class Descriptor extends EntityBase {
  @Column()
  description!: string;

  @Column()
  enabled!: boolean;

  @Column({ name: 'wallet_id' })
  walletId!: string;
}
