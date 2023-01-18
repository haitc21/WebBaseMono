using FluentValidation;
using System;
using System.Collections.Generic;
using System.Text;
using Volo.Abp.Identity;

namespace WebBase.Roles;

public class CreateUpdateRoleDtoValidator : AbstractValidator<CreateUpdateRoleDto>
{
    public CreateUpdateRoleDtoValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(IdentityRoleConsts.MaxNameLength);
        RuleFor(x => x.Description).NotEmpty().MaximumLength(RoleConsts.DescriptionMaxLength);
    }
}
