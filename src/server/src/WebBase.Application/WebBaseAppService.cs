using Volo.Abp.Application.Services;
using WebBase.Localization;

namespace WebBase;

/* Inherit your application services from this class.
 */

public abstract class WebBaseAppService : ApplicationService
{
    protected WebBaseAppService()
    {
        LocalizationResource = typeof(WebBaseResource);
    }
}