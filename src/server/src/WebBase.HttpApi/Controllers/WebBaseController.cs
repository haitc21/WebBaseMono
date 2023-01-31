using Volo.Abp.AspNetCore.Mvc;
using WebBase.Localization;

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