import { UserModel } from './user.model';

export interface PasswordResetToken {
    id: number;
    resetToken: string;
    userId: number;
    expireTime: Date;
    user?: UserModel;
}
