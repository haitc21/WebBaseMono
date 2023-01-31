using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Localization;
using WebBase.Localization;

namespace WebBase.Permissions;

public class WebBasePermissionDefinitionProvider : PermissionDefinitionProvider
{
    public override void Define(IPermissionDefinitionContext context)
    {
        var myGroup = context.AddGroup(WebBasePermissions.GroupName);
        //Define your own permissions here. Example:
        //myGroup.AddPermission(WebBasePermissions.MyPermission1, L("Permission:MyPermission1"));
    }

    private static LocalizableString L(string name)
    {
        return LocalizableString.Create<WebBaseResource>(name);
    }
}