<@compress>
<!DOCTYPE html>
<html>
<head>
    <#include "../../common/import.ftl">
    <title>页面title</title>
    <meta charset="utf-8"/>
    <@css/>
</head>
<body>
<@topHeader />
<div class="g-body">
    <@leftMenu />
    <div class="g-main">
        <div id="app"></div>
    </div>
</div>
<@htmFoot />
<script src="${nejRoot}"></script>
<script>
    NEJ.define([
        'pro/page/{{pageName}}/entry'
    ],function(m){
        m._$$Module._$allocate();
    });
</script>
</body>
</html>
</@compress>