using System;
using System.Collections.Generic;
using System.Text;
using Volo.Abp.Identity;

namespace WebBase.Users;

public class GetUserListDto : GetIdentityUsersInput
{
    public string Email { get; set; }
    public string PhoneNumber { get; set; }
    public Guid? roleId { get; set; }
}
