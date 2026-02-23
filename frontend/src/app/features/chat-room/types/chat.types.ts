export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  avatar?: string;
}

export interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  message: string;
  created_at: Date;
  fromSelf: boolean;
  isRead?: boolean;
}