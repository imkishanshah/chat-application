// src/entities/Message.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity("messages")
export class MessagesEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "int" })
    sender_id!: number;

    @Column({ type: "int" })
    receiver_id!: number;

    @Column({ type: "varchar" })
    message!: string;

    @Column({ type: "varchar" })
    room_id!: string;

    @Column({ type: "varchar" })
    read!: number;

    @Column({ type: "int" })
    message_type!: number;

    @CreateDateColumn()
    created_at!: string;
}
