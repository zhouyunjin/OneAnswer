import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class LFFurnace {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  furnaceId: string;

  @Column()
  status: string;

  @Column({ nullable: true })
  steelGrade: string;

  @Column({ nullable: true })
  estimatedCompletion: string;
}
