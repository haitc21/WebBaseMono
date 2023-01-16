import type { SetPasswordDto } from './models';
import { RestService } from '@abp/ng.core';
import type { ListResultDto, PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { GetIdentityUsersInput, IdentityRoleDto, IdentityUserCreateDto, IdentityUserDto, IdentityUserUpdateDto, IdentityUserUpdateRolesDto } from '../volo/abp/identity/models';

@Injectable({
  providedIn: 'root',
})
export class sersService {
  apiName = 'Default';
  

  create = (input: IdentityUserCreateDto) =>
    this.restService.request<any, IdentityUserDto>({
      method: 'POST',
      url: '/api/app/sers',
      body: input,
    },
    { apiName: this.apiName });
  

  delete = (id: string) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/sers/${id}`,
    },
    { apiName: this.apiName });
  

  deleteMultiple = (ids: string[]) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: '/api/app/sers/multiple',
      params: { ids },
    },
    { apiName: this.apiName });
  

  findByEmail = (email: string) =>
    this.restService.request<any, IdentityUserDto>({
      method: 'POST',
      url: '/api/app/sers/find-by-email',
      params: { email },
    },
    { apiName: this.apiName });
  

  findByUsername = (userName: string) =>
    this.restService.request<any, IdentityUserDto>({
      method: 'POST',
      url: '/api/app/sers/find-by-username',
      params: { userName },
    },
    { apiName: this.apiName });
  

  get = (id: string) =>
    this.restService.request<any, IdentityUserDto>({
      method: 'GET',
      url: `/api/app/sers/${id}`,
    },
    { apiName: this.apiName });
  

  getAssignableRoles = () =>
    this.restService.request<any, ListResultDto<IdentityRoleDto>>({
      method: 'GET',
      url: '/api/app/sers/assignable-roles',
    },
    { apiName: this.apiName });
  

  getList = (input: GetIdentityUsersInput) =>
    this.restService.request<any, PagedResultDto<IdentityUserDto>>({
      method: 'GET',
      url: '/api/app/sers',
      params: { filter: input.filter, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName });
  

  getRoles = (id: string) =>
    this.restService.request<any, ListResultDto<IdentityRoleDto>>({
      method: 'GET',
      url: `/api/app/sers/${id}/roles`,
    },
    { apiName: this.apiName });
  

  setPassword = (userId: string, input: SetPasswordDto) =>
    this.restService.request<any, void>({
      method: 'POST',
      url: `/api/app/sers/set-password/${userId}`,
      body: input,
    },
    { apiName: this.apiName });
  

  update = (id: string, input: IdentityUserUpdateDto) =>
    this.restService.request<any, IdentityUserDto>({
      method: 'PUT',
      url: `/api/app/sers/${id}`,
      body: input,
    },
    { apiName: this.apiName });
  

  updateRoles = (id: string, input: IdentityUserUpdateRolesDto) =>
    this.restService.request<any, void>({
      method: 'PUT',
      url: `/api/app/sers/${id}/roles`,
      body: input,
    },
    { apiName: this.apiName });

  constructor(private restService: RestService) {}
}
