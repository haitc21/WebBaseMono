using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Data;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Identity;
using Volo.Abp.PermissionManagement;
using Volo.Abp.SimpleStateChecking;
using WebBase.Localization;

namespace WebBase.Roles;

[Authorize(IdentityPermissions.Roles.Default)]
public class RolesAppService : CrudAppService<
    IdentityRole,
    RoleDto,
    Guid,
    PagedResultRequestDto,
    CreateUpdateRoleDto,
    CreateUpdateRoleDto>, IRolesAppService
{
    protected IdentityRoleManager RoleManager { get; }
    protected PermissionManagementOptions Options { get; }
    protected IPermissionManager PermissionManager { get; }
    protected IPermissionDefinitionManager PermissionDefinitionManager { get; }
    protected ISimpleStateCheckerManager<PermissionDefinition> SimpleStateCheckerManager { get; }

    protected IdentityUserManager UserManager { get; }

    public RolesAppService(IRepository<IdentityRole, Guid> repository,
        IdentityRoleManager roleManager,
        IPermissionManager permissionManager,
        IPermissionDefinitionManager permissionDefinitionManager,
        IOptions<PermissionManagementOptions> options,
        ISimpleStateCheckerManager<PermissionDefinition> simpleStateCheckerManager,
        IdentityUserManager userManager)
        : base(repository)
    {
        RoleManager = roleManager;
        Options = options.Value;
        PermissionManager = permissionManager;
        PermissionDefinitionManager = permissionDefinitionManager;
        SimpleStateCheckerManager = simpleStateCheckerManager;
        UserManager = userManager;
        LocalizationResource = typeof(WebBaseResource);

        GetPolicyName = IdentityPermissions.Roles.Default;
        GetListPolicyName = IdentityPermissions.Roles.Default;
        CreatePolicyName = IdentityPermissions.Roles.Create;
        UpdatePolicyName = IdentityPermissions.Roles.Update;
        DeletePolicyName = IdentityPermissions.Roles.Delete;
    }

    [Authorize(IdentityPermissions.Roles.Delete)]
    public async Task DeleteMultipleAsync(IEnumerable<Guid> ids)
    {
        await Repository.DeleteManyAsync(ids);
        await UnitOfWorkManager.Current.SaveChangesAsync();
    }

    [Authorize(IdentityPermissions.Roles.Default)]
    public async Task<List<RoleDto>> GetListAllAsync()
    {
        var query = await Repository.GetQueryableAsync();
        var data = await AsyncExecuter.ToListAsync(query);

        return ObjectMapper.Map<List<IdentityRole>, List<RoleDto>>(data);
    }

    [Authorize(IdentityPermissions.Roles.Default)]
    public async Task<PagedResultDto<RoleDto>> GetListFilterAsync(BaseListFilterDto input)
    {
        var query = await Repository.GetQueryableAsync();
        query = query.WhereIf(!string.IsNullOrWhiteSpace(input.Keyword), x => x.Name.Contains(input.Keyword));

        var totalCount = await AsyncExecuter.LongCountAsync(query);
        var data = await AsyncExecuter.ToListAsync(query.Skip(input.SkipCount).Take(input.MaxResultCount));

        return new PagedResultDto<RoleDto>(totalCount, ObjectMapper.Map<List<IdentityRole>, List<RoleDto>>(data));
    }

    [Authorize(IdentityPermissions.Roles.Create)]
    public override async Task<RoleDto> CreateAsync(CreateUpdateRoleDto input)
    {
        var role = new IdentityRole(GuidGenerator.Create(), input.Name)
        {
            IsDefault = input.IsDefault,
            IsPublic = input.IsPublic
        };
        role.SetProperty(RoleConsts.DescriptionFieldName, input.Description);
        (await RoleManager.CreateAsync(role)).CheckErrors();
        await CurrentUnitOfWork.SaveChangesAsync();
        return ObjectMapper.Map<IdentityRole, RoleDto>(role);
    }

    [Authorize(IdentityPermissions.Roles.Update)]
    public override async Task<RoleDto> UpdateAsync(Guid id, CreateUpdateRoleDto input)
    {
        var role = await RoleManager.GetByIdAsync(id);

        role.SetConcurrencyStampIfNotNull(input.ConcurrencyStamp);

        (await RoleManager.SetRoleNameAsync(role, input.Name)).CheckErrors();

        role.IsDefault = input.IsDefault;
        role.IsPublic = input.IsPublic;
        role.SetProperty(RoleConsts.DescriptionFieldName, input.Description);

        (await RoleManager.UpdateAsync(role)).CheckErrors();
        await CurrentUnitOfWork.SaveChangesAsync();
        return ObjectMapper.Map<IdentityRole, RoleDto>(role);
    }

    public async Task<GetPermissionListResultDto> GetPermissionsAsync(string providerName, string providerKey)
    {
        await CheckProviderPolicy(providerName);

        var result = new GetPermissionListResultDto
        {
            EntityDisplayName = providerKey,
            Groups = new List<PermissionGroupDto>()
        };
        if (providerName == "U")
        {
            var identityUser = await UserManager.GetByIdAsync(new Guid(providerKey));
            result.EntityDisplayName = identityUser.UserName;
        }

        foreach (var group in PermissionDefinitionManager.GetGroups().Where(x => x.Name.StartsWith("AbpIdentity") || x.Name.StartsWith("WebBase")))
        {
            var groupDto = CreatePermissionGroupDto(group);

            var neededCheckPermissions = new List<PermissionDefinition>();

            foreach (var permission in group.GetPermissionsWithChildren()
                                            .Where(x => x.IsEnabled)
                                            .Where(x => !x.Providers.Any() || x.Providers.Contains(providerName)))
            {
                if (await SimpleStateCheckerManager.IsEnabledAsync(permission))
                {
                    neededCheckPermissions.Add(permission);
                }
            }

            if (!neededCheckPermissions.Any())
            {
                continue;
            }

            var grantInfoDtos = neededCheckPermissions
                .Select(CreatePermissionGrantInfoDto)
                .ToList();

            var multipleGrantInfo = await PermissionManager.GetAsync(neededCheckPermissions.Select(x => x.Name).ToArray(), providerName, providerKey);

            foreach (var grantInfo in multipleGrantInfo.Result)
            {
                var grantInfoDto = grantInfoDtos.First(x => x.Name == grantInfo.Name);

                grantInfoDto.IsGranted = grantInfo.IsGranted;

                foreach (var provider in grantInfo.Providers)
                {
                    grantInfoDto.GrantedProviders.Add(new ProviderInfoDto
                    {
                        ProviderName = provider.Name,
                        ProviderKey = provider.Key,
                    });
                }

                groupDto.Permissions.Add(grantInfoDto);
            }

            if (groupDto.Permissions.Any())
            {
                result.Groups.Add(groupDto);
            }
        }

        return result;
    }

    private PermissionGrantInfoDto CreatePermissionGrantInfoDto(PermissionDefinition permission)
    {
        return new PermissionGrantInfoDto
        {
            Name = permission.Name,
            DisplayName = permission.DisplayName?.Localize(StringLocalizerFactory),
            ParentName = permission.Parent?.Name,
            AllowedProviders = permission.Providers,
            GrantedProviders = new List<ProviderInfoDto>()
        };
    }

    private PermissionGroupDto CreatePermissionGroupDto(PermissionGroupDefinition group)
    {
        return new PermissionGroupDto
        {
            Name = group.Name,
            DisplayName = group.DisplayName?.Localize(StringLocalizerFactory),
            Permissions = new List<PermissionGrantInfoDto>(),
        };
    }

    public virtual async Task UpdatePermissionsAsync(string providerName, string providerKey, UpdatePermissionsDto input)
    {
        await CheckProviderPolicy(providerName);

        foreach (var permissionDto in input.Permissions)
        {
            await PermissionManager.SetAsync(permissionDto.Name, providerName, providerKey, permissionDto.IsGranted);
        }
    }

    protected virtual async Task CheckProviderPolicy(string providerName)
    {
        var policyName = Options.ProviderPolicies.GetOrDefault(providerName);
        if (policyName.IsNullOrEmpty())
        {
            throw new AbpException($"Bạn không có quyền '{providerName}'");
        }

        await AuthorizationService.CheckAsync(policyName);
    }
}