import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Converter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  furnaceId: string;

  @Column()
  status: string;

  @Column({ nullable: true })
  currentHeat: string;

  @Column({ nullable: true })
  steelGrade: string;

  @Column({ nullable: true })
  startTime: string;

  @Column({ nullable: true })
  estimatedCompletion: string;
}
