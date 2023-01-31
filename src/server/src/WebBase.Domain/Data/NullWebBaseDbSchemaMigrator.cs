using System.Threading.Tasks;
using Volo.Abp.DependencyInjection;

namespace WebBase.Data;

/* This is used if database provider does't define
 * IWebBaseDbSchemaMigrator implementation.
 */

public class NullWebBaseDbSchemaMigrator : IWebBaseDbSchemaMigrator, ITransientDependency
{
    public Task MigrateAsync()
    {
        return Task.CompletedTask;
    }
}