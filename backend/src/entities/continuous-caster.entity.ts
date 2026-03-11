import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class ContinuousCaster {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  casterId: string;

  @Column()
  status: string;

  @Column({ nullable: true })
  steelGrade: string;

  @Column({ nullable: true, type: 'float' })
  castingProgress: number;
}
