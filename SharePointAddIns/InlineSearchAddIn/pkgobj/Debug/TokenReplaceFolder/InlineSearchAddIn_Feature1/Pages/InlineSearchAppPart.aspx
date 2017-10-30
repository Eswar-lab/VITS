<%@ Page Language="C#" Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<%@ Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<WebPartPages:AllowFraming ID="AllowFraming" runat="server" />

<html>
<head>
    <title>Inline Search App Part </title>

    
     <!-- Add your CSS styles to the following file -->
    <link rel="Stylesheet" type="text/css" href="../Content/App.css" />

    <!-- Add your JavaScript to the following file -->
    <script src="//code.jquery.com/jquery-1.11.2.min.js"></script>

    <script type="text/javascript" src="/_layouts/15/MicrosoftAjax.js"></script>
    <script type="text/javascript" src="/_layouts/15/init.js"></script>
    <script type="text/javascript" src="/_layouts/15/sp.init.js"></script>
    <script type="text/javascript" src="/_layouts/sp.core.js"></script>
    <script type="text/javascript" src="/_layouts/15/sp.runtime.js"></script>
    <script type="text/javascript" src="/_layouts/15/sp.js"></script>
    <script type="text/javascript" src="/_layouts/15/SP.Search.js"></script>
    
    <!-- AngularJS-->
    <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.3.8/angular.js"></script>   
    <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.3.8/angular-resource.js"></script>
    <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.3.8/angular-route.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/ngStorage/0.3.9/ngStorage.min.js"></script>
    
    <!-- BootStrap 3 -->    
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css"> 
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap-theme.min.css">    
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js"></script>
    
    <script src="//cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/0.12.0/ui-bootstrap-tpls.min.js"></script>

<%--    <script src="https://mjcdn.azurewebsites.net/scripts/app.js"></script>
    <script src="https://mjcdn.azurewebsites.net/scripts/controllers/SharePointOnlineControllers.js"></script>
    <script src="https://mjcdn.azurewebsites.net/scripts/services/SharePointOnlineServices.js"></script>
    <script src="https://mjcdn.azurewebsites.net/scripts/services/SearchService.js"></script>
    <script src="https://mjcdn.azurewebsites.net/scripts/services/EnvironmentService.js"></script>
    <script src="https://mjcdn.azurewebsites.net/scripts/directives/SharePointOnlineDirectives.js"></script>
    <script src="https://mjcdn.azurewebsites.net/scripts/directives/InlineSearch/InlineSearch.js"></script>--%>

    <script src="https://localhost:44326/scripts/app.js"></script>
    <script src="https://localhost:44326/scripts/controllers/SharePointOnlineControllers.js"></script>
    <script src="https://localhost:44326/scripts/services/SharePointOnlineServices.js"></script>
    <script src="https://localhost:44326/scripts/services/SearchService.js"></script>
    <script src="https://localhost:44326/scripts/services/EnvironmentService.js"></script>
    <script src="https://localhost:44326/scripts/directives/SharePointOnlineDirectives.js"></script>
    <script src="https://localhost:44326/scripts/directives/InlineSearch/InlineSearch.js"></script>

    
</head>
<body>
      <div ng-app="SharePointOnlineApp">
        <span>Inline Search</span>
        <spo-inlinesearch></spo-inlinesearch>
    </div>
</body>
</html>
