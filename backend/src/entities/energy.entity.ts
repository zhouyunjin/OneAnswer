import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Energy {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  timestamp: string;

  @Column()
  energyType: string;

  @Column()
  consumption: number;

  @Column()
  unit: string;

  @Column()
  department: string;

  @Column()
  cost: number;

  @Column({ nullable: true })
  steelOutput: number;

  @Column({ nullable: true })
  consumptionPerTon: number;
}
