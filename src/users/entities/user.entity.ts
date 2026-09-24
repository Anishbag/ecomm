import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum UserRole {
    USER = "USER",
    ADMIN = "ADMIN",

}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    name: string;

    @Column({ unique: true, length: 100 })
    email: string;

    @Column()
    password: string;

    @Column({ nullable: true, length: 20 })
    phone: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.USER
    })
    role: UserRole;

    @Column({ default: true })
    isActive: boolean;

    @Column({ type: 'text', nullable: true })
    refreshToken: string | null;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}