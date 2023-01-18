import type { IdentityUserDto } from '../volo/abp/identity/models';

export interface SetPasswordDto {
  newPassword?: string;
  confirmNewPassword?: string;
}

export interface UserDto extends IdentityUserDto {
  roles: string[];
}
