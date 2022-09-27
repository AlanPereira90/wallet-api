import DescriptorEntity from '../DescriptorEntity';

export type DescriptorData = Omit<DescriptorEntity, 'id' | 'createdAt' | 'updatedAt'>;

export type DescriptorWithId = Omit<DescriptorEntity, 'createdAt' | 'updatedAt'>;
