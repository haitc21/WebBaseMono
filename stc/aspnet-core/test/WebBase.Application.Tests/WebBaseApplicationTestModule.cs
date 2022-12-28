using Volo.Abp.Modularity;

namespace WebBase;

[DependsOn(
    typeof(WebBaseApplicationModule),
    typeof(WebBaseDomainTestModule)
    )]
public class WebBaseApplicationTestModule : AbpModule
{

}
