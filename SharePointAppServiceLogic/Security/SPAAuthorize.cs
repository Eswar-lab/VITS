using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;

namespace SharePointAppServiceLogic.Security
{
    public class SPAAuthorize : AuthorizeAttribute
    {
        public override void OnAuthorization(System.Web.Http.Controllers.HttpActionContext actionContext)
        {
            if (Authorize(actionContext))
            {
                return;
            }
            HandleUnauthorizedRequest(actionContext);
        }

        protected override void HandleUnauthorizedRequest(System.Web.Http.Controllers.HttpActionContext actionContext)
        {
            var challengeMessage = new System.Net.Http.HttpResponseMessage(System.Net.HttpStatusCode.Unauthorized);
            challengeMessage.Headers.Add("WWW-Authenticate", "Basic");

            var response = challengeMessage;
            throw new HttpResponseException(response);
        }

        private bool Authorize(System.Web.Http.Controllers.HttpActionContext actionContext)
        {
            try
            {
                var token = (from h in actionContext.Request.Headers
                             where h.Key == "Token"
                             select h.Value.First()).FirstOrDefault();
                if (token == null)
                {
                    throw new ApplicationException("Missing token in header");
                }
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }
        }
}
