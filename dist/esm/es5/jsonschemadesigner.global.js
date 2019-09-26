/*! Built with http://stenciljs.com */
export default function appGlobal(namespace, Context, window, document, resourcesUrl, hydratedCssClass) {(function(resourcesUrl){var defaultTranslations={"json-schema-designer":{schema:"Schema",definitions:"Definitions","add-definition":"Add Definition","select-definition":"Select Definition...",export:"Export",object:"Object",string:"String",number:"Number",integer:"Integer",array:"Array",boolean:"Boolean",null:"Null",$ref:"$ref",general:"General",title:"Title","delete?":"Delete?",description:"Description",default:"Default",required:"Required","not-required":"Not Required",nullable:"Nullable","enumerated-values":"Enumerated Values","add-value":"Add Value","minimum-length":"Minimum Length","maximum-length":"Maximum Length",format:"Format",pattern:"Pattern",numeric:"Numeric",minimum:"Minimum",exclusive:"Exclusive",maximum:"Maximum","multiple-of":"Multiple of","minimum-properties":"Minimum Properties","maximum-properties":"Maximum Properties","allow-additional-properties":"Allow Additional Properties","additional-properties":"Additional Properties","additional-items":"Additional Items","minimum-items":"Minimum Items","maximum-items":"Maximum Items","unique-items":"Unique Items",reference:"Reference","view-mode-not-supported":"View Mode Not Supported"}},i18n={translations:defaultTranslations,translate:function(e){if(this.translations[e])return this.translations[e];for(var i=e.split("."),t=this.translations,n=0;n<i.length;n++)if(!(t=t[i[n]]))return console.error("translation not found for",e),e;return t}};Context.globalVar="",Context.i18n=i18n;
})(resourcesUrl);
}