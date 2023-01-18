using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Volo.Abp;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Data;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Identity;
using Volo.Abp.ObjectExtending;
using static Volo.Abp.Identity.Settings.IdentitySettingNames;

namespace WebBase.Users;

public class UsersAppService : IdentityAppServiceBase, IIdentityUserAppService
{
    protected IdentityUserManager UserManager { get; }
    protected IIdentityUserRepository UserRepository { get; }
    protected IIdentityRoleRepository RoleRepository { get; }
    protected IOptions<IdentityOptions> IdentityOptions { get; }

    public UsersAppService(
        IdentityUserManager userManager,
        IIdentityUserRepository userRepository,
        IIdentityRoleRepository roleRepository,
        IOptions<IdentityOptions> identityOptions)
    {
        UserManager = userManager;
        UserRepository = userRepository;
        RoleRepository = roleRepository;
        IdentityOptions = identityOptions;
    }

    [Authorize(IdentityPermissions.Users.Default)]
    public virtual async Task<IdentityUserDto> GetAsync(Guid id)
    {
        return ObjectMapper.Map<IdentityUser, IdentityUserDto>(
            await UserManager.GetByIdAsync(id)
        );
    }

    [Authorize(IdentityPermissions.Users.Default)]
    public async Task<UserDto> GetIncludeRoleAsync(Guid id)
    {
        var identityUser = await UserManager.GetByIdAsync(id);
        var result = ObjectMapper.Map<IdentityUser, UserDto>(
            identityUser
        );
        var roles = await UserManager.GetRolesAsync(identityUser);
        result.Roles= roles;
        return result;
    }

    [Authorize(IdentityPermissions.Users.Default)]
    public virtual async Task<PagedResultDto<IdentityUserDto>> GetListAsync(GetIdentityUsersInput input)
    {
        var count = await UserRepository.GetCountAsync(input.Filter);
        var list = await UserRepository.GetListAsync(input.Sorting, input.MaxResultCount, input.SkipCount, input.Filter);

        return new PagedResultDto<IdentityUserDto>(
            count,
            ObjectMapper.Map<List<IdentityUser>, List<IdentityUserDto>>(list)
        );
    }

    [Authorize(IdentityPermissions.Users.Default)]
    public virtual async Task<ListResultDto<IdentityRoleDto>> GetRolesAsync(Guid id)
    {
        //TODO: Should also include roles of the related OUs.

        var roles = await UserRepository.GetRolesAsync(id);

        return new ListResultDto<IdentityRoleDto>(
            ObjectMapper.Map<List<IdentityRole>, List<IdentityRoleDto>>(roles)
        );
    }

    [Authorize(IdentityPermissions.Users.Default)]
    public virtual async Task<ListResultDto<IdentityRoleDto>> GetAssignableRolesAsync()
    {
        var list = await RoleRepository.GetListAsync();
        return new ListResultDto<IdentityRoleDto>(
            ObjectMapper.Map<List<IdentityRole>, List<IdentityRoleDto>>(list));
    }

    [Authorize(IdentityPermissions.Users.Create)]
    public virtual async Task<IdentityUserDto> CreateAsync(IdentityUserCreateDto input)
    {
        await IdentityOptions.SetAsync();

        var user = new IdentityUser(
            GuidGenerator.Create(),
            input.UserName,
            input.Email
        );

        input.MapExtraPropertiesTo(user);

        (await UserManager.CreateAsync(user, input.Password)).CheckErrors();
        await UpdateUserByInput(user, input);
        (await UserManager.UpdateAsync(user)).CheckErrors();

        await CurrentUnitOfWork.SaveChangesAsync();

        return ObjectMapper.Map<IdentityUser, IdentityUserDto>(user);
    }

    [Authorize(IdentityPermissions.Users.Update)]
    public virtual async Task<IdentityUserDto> UpdateAsync(Guid id, IdentityUserUpdateDto input)
    {
        await IdentityOptions.SetAsync();

        var user = await UserManager.GetByIdAsync(id);

        user.SetConcurrencyStampIfNotNull(input.ConcurrencyStamp);

        (await UserManager.SetUserNameAsync(user, input.UserName)).CheckErrors();

        await UpdateUserByInput(user, input);
        input.MapExtraPropertiesTo(user);

        (await UserManager.UpdateAsync(user)).CheckErrors();

        if (!input.Password.IsNullOrEmpty())
        {
            (await UserManager.RemovePasswordAsync(user)).CheckErrors();
            (await UserManager.AddPasswordAsync(user, input.Password)).CheckErrors();
        }

        await CurrentUnitOfWork.SaveChangesAsync();

        return ObjectMapper.Map<IdentityUser, IdentityUserDto>(user);
    }

    [Authorize(IdentityPermissions.Users.Delete)]
    public virtual async Task DeleteAsync(Guid id)
    {
        if (CurrentUser.Id == id)
        {
            throw new BusinessException(code: IdentityErrorCodes.UserSelfDeletion);
        }

        var user = await UserManager.FindByIdAsync(id.ToString());
        if (user == null)
        {
            return;
        }

        (await UserManager.DeleteAsync(user)).CheckErrors();
    }

    [Authorize(IdentityPermissions.Users.Delete)]
    public async Task DeleteMultipleAsync(IEnumerable<Guid> ids)
    {
        await UserRepository.DeleteManyAsync(ids);
        await UnitOfWorkManager.Current.SaveChangesAsync();
    }

    [Authorize(IdentityPermissions.Users.Update)]
    public virtual async Task UpdateRolesAsync(Guid id, IdentityUserUpdateRolesDto input)
    {
        var user = await UserManager.GetByIdAsync(id);
        (await UserManager.SetRolesAsync(user, input.RoleNames)).CheckErrors();
        await UserRepository.UpdateAsync(user);
    }

    [Authorize(IdentityPermissions.Users.Update)]
    public async Task SetPasswordAsync(Guid userId, SetPasswordDto input)
    {
        var user = await UserManager.FindByIdAsync(userId.ToString());
        if (user == null)
        {
            throw new EntityNotFoundException(typeof(IdentityUser), userId);
        }
        var token = await UserManager.GeneratePasswordResetTokenAsync(user);
        var result = await UserManager.ResetPasswordAsync(user, token, input.NewPassword);
        if (!result.Succeeded)
        {
            List<Microsoft.AspNetCore.Identity.IdentityError> errorList = result.Errors.ToList();
            string errors = "";

            foreach (var error in errorList)
            {
                errors = errors + error.Description.ToString();
            }
            throw new UserFriendlyException(errors);
        }
    }

    [Authorize(IdentityPermissions.Users.Default)]
    public virtual async Task<IdentityUserDto> FindByUsernameAsync(string userName)
    {
        return ObjectMapper.Map<IdentityUser, IdentityUserDto>(
            await UserManager.FindByNameAsync(userName)
        );
    }

    [Authorize(IdentityPermissions.Users.Default)]
    public virtual async Task<IdentityUserDto> FindByEmailAsync(string email)
    {
        return ObjectMapper.Map<IdentityUser, IdentityUserDto>(
            await UserManager.FindByEmailAsync(email)
        );
    }

    protected virtual async Task UpdateUserByInput(IdentityUser user, IdentityUserCreateOrUpdateDtoBase input)
    {
        if (!string.Equals(user.Email, input.Email, StringComparison.InvariantCultureIgnoreCase))
        {
            (await UserManager.SetEmailAsync(user, input.Email)).CheckErrors();
        }

        if (!string.Equals(user.PhoneNumber, input.PhoneNumber, StringComparison.InvariantCultureIgnoreCase))
        {
            (await UserManager.SetPhoneNumberAsync(user, input.PhoneNumber)).CheckErrors();
        }

        (await UserManager.SetLockoutEnabledAsync(user, input.LockoutEnabled)).CheckErrors();

        user.Name = input.Name;
        user.Surname = input.Surname;
        (await UserManager.UpdateAsync(user)).CheckErrors();
        user.SetIsActive(input.IsActive);
        if (input.RoleNames != null)
        {
            (await UserManager.SetRolesAsync(user, input.RoleNames)).CheckErrors();
        }
    }
}