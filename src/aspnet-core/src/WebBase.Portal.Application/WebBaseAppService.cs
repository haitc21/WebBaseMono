using System;
using System.Collections.Generic;
using System.Text;
using WebBase.Localization;
using Volo.Abp.Application.Services;

namespace WebBase.Portal;

/* Inherit your application services from this class.
 */
public abstract class WebBaseAppService : ApplicationService
{
    protected WebBaseAppService()
    {
        LocalizationResource = typeof(WebBaseResource);
    }
}
