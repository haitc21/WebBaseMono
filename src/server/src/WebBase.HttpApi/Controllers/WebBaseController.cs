using WebBase.Localization;
using Volo.Abp.AspNetCore.Mvc;

namespace WebBase.Controllers;

/* Inherit your controllers from this class.
 */
public abstract class WebBaseController : AbpControllerBase
{
    protected WebBaseController()
    {
        LocalizationResource = typeof(WebBaseResource);
    }
}
