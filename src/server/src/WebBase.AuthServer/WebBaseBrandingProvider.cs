using Volo.Abp.DependencyInjection;
using Volo.Abp.Ui.Branding;

namespace WebBase;

[Dependency(ReplaceServices = true)]
public class WebBaseBrandingProvider : DefaultBrandingProvider
{
    public override string AppName => "WebBase";
}