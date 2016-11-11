<!DOCTYPE html>
<html>
<head>
    <#include "/common/macro.ftl">
    <title>页面title</title>
    <meta charset="utf-8"/>
    <@css/>
</head>
<body>
<@supplierBodyFrame />
<script src="${nejRoot}"></script>
<script>
    NEJ.define([
        'pro/{{pageName}}/entry'
    ],function(m){
        m._$$Module._$allocate();
    });
</script>
</body>
</html>