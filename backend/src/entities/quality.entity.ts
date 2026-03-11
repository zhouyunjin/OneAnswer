import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Quality {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  timestamp: string;

  @Column()
  heatNumber: string;

  @Column()
  steelGrade: string;

  @Column('json')
  composition: {
    C: number;
    Si: number;
    Mn: number;
    P: number;
    S: number;
    Cr: number;
    Ni: number;
    Cu: number;
  };

  @Column()
  temperature: number;

  @Column()
  qualified: boolean;

  @Column()
  inspector: string;

  @Column({ nullable: true })
  remark: string;
}
