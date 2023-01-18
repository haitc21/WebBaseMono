using WebBase.EntityFrameworkCore;
using Volo.Abp.Autofac;
using Volo.Abp.BackgroundJobs;
using Volo.Abp.Modularity;

namespace WebBase.DbMigrator;

[DependsOn(
    typeof(AbpAutofacModule),
    typeof(WebBaseEntityFrameworkCoreModule),
    typeof(WebBaseApplicationContractsModule)
    )]
public class WebBaseDbMigratorModule : AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        Configure<AbpBackgroundJobOptions>(options => options.IsJobExecutionEnabled = false);
    }
}
