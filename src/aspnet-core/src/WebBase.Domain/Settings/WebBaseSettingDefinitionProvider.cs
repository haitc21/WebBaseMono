using Volo.Abp.Settings;

namespace WebBase.Settings;

public class WebBaseSettingDefinitionProvider : SettingDefinitionProvider
{
    public override void Define(ISettingDefinitionContext context)
    {
        //Define your own settings here. Example:
        //context.Add(new SettingDefinition(WebBaseSettings.MySetting1));
    }
}
