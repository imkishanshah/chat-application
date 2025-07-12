import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("user")
export class UserEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar" })
    first_name!: string;

    @Column({ type: "varchar" })
    last_name!: string;

    @Column({ type: "varchar" })
    email!: string;

    @Column({ type: "bigint" })
    mobile_no!: number;

    @Column({ type: "varchar" })
    password!: string;

    @Column({ type: "varchar" })
    password_otp!: string;

    @Column({ type: "varchar" })
    role!: string;

    @Column({ type: "int" })
    is_active!: number;
}