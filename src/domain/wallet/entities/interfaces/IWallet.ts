import WalletEntity from '../WalletEntity';

export type WalletData = Omit<WalletEntity, 'id' | 'createdAt' | 'updatedAt'>;

export type WalletPublicInfo = Omit<WalletData, 'credentialId'>;

export type WalletWithId = Omit<WalletEntity, 'createdAt' | 'updatedAt'>;
