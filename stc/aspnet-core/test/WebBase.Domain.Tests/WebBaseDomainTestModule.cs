using WebBase.EntityFrameworkCore;
using Volo.Abp.Modularity;

namespace WebBase;

[DependsOn(
    typeof(WebBaseEntityFrameworkCoreTestModule)
    )]
public class WebBaseDomainTestModule : AbpModule
{

}
