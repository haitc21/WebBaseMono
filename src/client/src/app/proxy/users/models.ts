import type { GetIdentityUsersInput, IdentityUserDto } from '../volo/abp/identity/models';

export interface GetUserListDto extends GetIdentityUsersInput {
  email?: string;
  phoneNumber?: string;
  roleId?: string;
}

export interface SetPasswordDto {
  newPassword?: string;
  confirmNewPassword?: string;
}

export interface UserDto extends IdentityUserDto {
  roles: string[];
}
