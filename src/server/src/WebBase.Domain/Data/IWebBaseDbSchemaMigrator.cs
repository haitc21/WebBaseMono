using System.Threading.Tasks;

namespace WebBase.Data;

public interface IWebBaseDbSchemaMigrator
{
    Task MigrateAsync();
}