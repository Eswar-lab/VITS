<%@ Page language="C#" Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<WebPartPages:AllowFraming ID="AllowFraming" runat="server" />

<html>
<head>
    <title>CEO webpart</title>

   
     <!-- jQuery -->
    <script src="//code.jquery.com/jquery-1.11.2.min.js"></script>
    <!-- AngularJS-->
    <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.3.8/angular.js"></script>
    <!--<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.3.8/angular.min.js"></script>-->
    <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.3.8/angular-resource.js"></script>
    <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.3.8/angular-route.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/ngStorage/0.3.6/ngStorage.js"></script>
    <!-- BootStrap 3 -->
    <!-- Latest compiled and minified CSS -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css">
    <!-- Optional theme -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap-theme.min.css">
    <!-- Latest compiled and minified JavaScript -->
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js"></script>

    <!--<script src="scripts/lib/angular/angular.js"></script>-->
    <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.6.1/angular.js"></script>
    <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.6.1/angular-animate.js"></script>
    <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.6.1/angular-sanitize.js"></script>
    <script src="//angular-ui.github.io/bootstrap/ui-bootstrap-tpls-2.5.0.js"></script>



<%--    <script src="https://vitspoaddins.blob.core.windows.net/scripts/app.js"></script>
    <script src="https://vitspoaddins.blob.core.windows.net/scripts/controllers/SharePointOnlineControllers.js"></script>
    <script src="https://vitspoaddins.blob.core.windows.net/scripts/services/SharePointOnlineServices.js"></script>
    <script src="https://vitspoaddins.blob.core.windows.net/scripts/services/SearchService.js"></script>
    <script src="https://vitspoaddins.blob.core.windows.net/scripts/services/EnvironmentService.js"></script>
    <script src="https://vitspoaddins.blob.core.windows.net/scripts/directives/SharePointOnlineDirectives.js"></script>
    <script src="https://vitspoaddins.blob.core.windows.net/scripts/directives/ElectronicRecords/ElectronicRecords.js"></script>--%>

    <script src="https://localhost:44326/scripts/app.js"></script>
    <script src="https://localhost:44326/scripts/controllers/SharePointOnlineControllers.js"></script>
    <script src="https://localhost:44326/scripts/services/SharePointOnlineServices.js"></script>
    <script src="https://localhost:44326/scripts/services/CEOsiteService.js"></script>
    <script src="https://localhost:44326/scripts/directives/SharePointOnlineDirectives.js"></script>
    <script src="https://localhost:44326/scripts/directives/CEOsite/CEOsite.js"></script>

</head>
<body>
     <div ng-app="SharePointOnlineApp">

         
        <span>CEO site</span>
        <spo-ceosite></spo-ceosite>

    </div>
</body>
</html>
