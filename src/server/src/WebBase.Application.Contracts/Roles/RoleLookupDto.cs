using System;
using Volo.Abp.Application.Dtos;

namespace WebBase.Roles;

public class RoleLookupDto : EntityDto<Guid>
{
    public string Name { get; set; }
}