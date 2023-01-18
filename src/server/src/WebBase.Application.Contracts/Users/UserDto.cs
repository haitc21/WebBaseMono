using System;
using System.Collections.Generic;
using System.Text;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Identity;

namespace WebBase.Users;

public class UserDto : IdentityUserDto
{
    public IList<string> Roles { get; set; }

}
