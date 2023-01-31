using System.Collections.Generic;
using Volo.Abp.Identity;

namespace WebBase.Users;

public class UserDto : IdentityUserDto
{
    public IList<string> Roles { get; set; }
}