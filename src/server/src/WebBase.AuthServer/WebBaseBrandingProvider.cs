using Volo.Abp.Ui.Branding;
using Volo.Abp.DependencyInjection;

namespace WebBase;

[Dependency(ReplaceServices = true)]
public class WebBaseBrandingProvider : DefaultBrandingProvider
{
    public override string AppName => "WebBase";
}
