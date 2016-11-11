{{#if title}}
<h2 class="u-title">{{title}}</h2>
{{/if}}

{{#if isForm}}
<form.base>
{{/if}}
{{#each rows}}
	{{#ifCond components.length '>' 1}}
	<div class="g-row {{clazz}}">
	{{/ifCond}}
	{{#each components}}
	{{#if id}}
	{{!-- 组件开始 --}}
	<{{name}}
		{{#if layout.cols}}cols={{layout.cols}}{{/if}}
		{{!-- 遍历组件属性，3种情况：1. 需要绑定的 2. 需要验证的 3. 普通字符串属性 --}}
		{{#each attributes}}
			{{@key}}="{{this}}"
		{{/each}}
		{{#each data}}
			{{@key}}={{model this}}
		{{/each}}
		{{#if text}}
			{{!-- 组件结束：闭合标签 --}}
			>{{text}}</{{name}}>
		{{else}}
			{{!-- 组件结束：自闭合标签 --}}
			/>
		{{/if}}
	{{else}}
		{{!-- 自定义模块备注 --}}
		<!-- {{desc}} -->
		<{{name}} />
	{{/if}}
	{{/each}}
	{{#ifCond components.length '>' 1}}
		</div>
	{{/ifCond}}
{{/each}}
{{#if isForm}}
</form.base>
{{/if}}
