import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Material {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  materialId: string;

  @Column()
  materialName: string;

  @Column()
  materialType: string;

  @Column()
  stock: number;

  @Column()
  unit: string;

  @Column()
  minStock: number;

  @Column()
  maxStock: number;

  @Column()
  supplier: string;

  @Column({ nullable: true })
  lastPurchaseDate: string;

  @Column({ nullable: true })
  nextPurchaseDate: string;

  @Column()
  unitPrice: number;

  @Column()
  location: string;
}
