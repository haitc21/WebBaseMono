using Volo.Abp.Domain.Entities;

namespace WebBase.Roles;

public class CreateUpdateRoleDto : IHasConcurrencyStamp
{
    public string Name { get; set; }
    public bool IsDefault { get; set; }
    public bool IsPublic { get; set; }
    public string Description { get; set; }
    public string ConcurrencyStamp { get; set; }
}