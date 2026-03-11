import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class HotMetal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  timestamp: string;

  @Column()
  temperature: number;

  @Column('json')
  composition: {
    Si: number;
    Mn: number;
    P: number;
    S: number;
  };

  @Column()
  weight: number;

  @Column()
  sourceBlastFurnace: string;
}
