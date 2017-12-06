<%@ Page language="C#" Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<WebPartPages:AllowFraming ID="AllowFraming" runat="server" />

<html>
<head>
    <title>VIT Leave Application Form</title>
    <script type="text/javascript" src="../Scripts/jquery-1.9.1.min.js"></script>
    <script type="text/javascript" src="/_layouts/15/MicrosoftAjax.js"></script>
    <script type="text/javascript" src="/_layouts/15/init.js"></script>
    <script type="text/javascript" src="/_layouts/15/sp.init.js"></script>
    <script type="text/javascript" src="/_layouts/sp.core.js"></script>
    <script type="text/javascript" src="/_layouts/15/sp.runtime.js"></script>
    <script type="text/javascript" src="/_layouts/15/sp.js"></script>
    <script type="text/javascript" src="/_layouts/15/SP.RequestExecutor.js"></script>    

   <!-- AngularJS-->
     <script src="//cdnjs.cloudflare.com/ajax/libs/api-check/7.5.5/api-check.min.js"></script>
    <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.3.8/angular.js"></script>   
    <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.3.8/angular-resource.js"></script>
    <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.3.8/angular-route.js"></script>
       <script src="//cdnjs.cloudflare.com/ajax/libs/angular-formly/8.4.1/formly.min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/angular-formly-templates-bootstrap/6.5.1/angular-formly-templates-bootstrap.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/ngStorage/0.3.9/ngStorage.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/angular-smart-table/2.1.9/smart-table.min.js"></script>
    <!-- angularjs material-->
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.5.5/angular-animate.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.5.5/angular-aria.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.5.5/angular-messages.min.js"></script>

    <!-- Angular Material Library -->
    <script src="https://ajax.googleapis.com/ajax/libs/angular_material/1.1.0/angular-material.min.js"> </script>

    
    <!-- BootStrap 3 -->    

    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css"> 
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootswatch/3.3.4/united/bootstrap.min.css">    
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js"></script>
    
    <script src="//cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/0.12.0/ui-bootstrap-tpls.min.js"></script>
     <link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/angular_material/1.1.0/angular-material.min.css">

<%--    <script src="https://vitspoaddins.blob.core.windows.net/scripts/app.js"></script>
    <script src="https://vitspoaddins.blob.core.windows.net/scripts/controllers/SharePointOnlineControllers.js"></script>
    <script src="https://vitspoaddins.blob.core.windows.net/scripts/services/SharePointOnlineServices.js"></script>
    <script src="https://vitspoaddins.blob.core.windows.net/scripts/services/SearchService.js"></script>
    <script src="https://vitspoaddins.blob.core.windows.net/scripts/services/EnvironmentService.js"></script>
    <script src="https://vitspoaddins.blob.core.windows.net/scripts/directives/SharePointOnlineDirectives.js"></script>
    <script src="https://vitspoaddins.blob.core.windows.net/scripts/directives/Timesheet/Timesheet.js"></script>--%>

    <link rel="stylesheet" href="https://localhost:44326/Content/app.css"> 
    <script src="https://localhost:44326/scripts/app.js"></script>
    <script src="https://localhost:44326/scripts/external/bootstrap3-typeahead.min.js"></script>
    <script src="https://localhost:44326/scripts/controllers/SharePointOnlineControllers.js"></script>
    <script src="https://localhost:44326/scripts/services/SharePointOnlineServices.js"></script>
    <script src="https://localhost:44326/scripts/services/EnvironmentService.js"></script>
    <script src="https://localhost:44326/scripts/directives/SharePointOnlineDirectives.js"></script>
    <script src="https://localhost:44326/scripts/directives/FilesInput/FilesInput.js"></script>
    <script src="https://localhost:44326/scripts/directives/LeaveApplication/LeaveApplication.js"></script>
    <script src="https://localhost:44326/scripts/services/ListService.js"></script>

</head>
<body>
     <form runat="server">
        <SharePoint:FormDigest ID="FormDigest1" runat="server"></SharePoint:FormDigest>
    </form>
     <div ng-app="SharePointOnlineApp">
        <spo-leaveapplication></spo-leaveapplication>
    </div>
</body>
</html>
