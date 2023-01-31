using Volo.Abp.Modularity;
using WebBase.EntityFrameworkCore;

namespace WebBase;

[DependsOn(
    typeof(WebBaseEntityFrameworkCoreTestModule)
    )]
public class WebBaseDomainTestModule : AbpModule
{
}