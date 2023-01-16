import type { EntityDto } from '@abp/ng.core';

export interface CreateUpdateRoleDto {
  name?: string;
  isDefault: boolean;
  isPublic: boolean;
  description?: string;
  concurrencyStamp?: string;
}

export interface RoleDto extends EntityDto<string> {
  name?: string;
  isDefault: boolean;
  isPublic: boolean;
  description?: string;
  concurrencyStamp?: string;
}
