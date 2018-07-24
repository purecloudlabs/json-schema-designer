/*! Built with http://stenciljs.com */
(function(namespace,resourcesUrl){"use strict";
(function(resourcesUrl){
    /** jsonschemadesigner global **/

    const defaultTranslations = {
        "json-schema-designer": {
            "test-translation": "translation successfull",
            "schema": "Schema",
            "definitions": "Definitions",
            "add-definition": "Add Definition",
            "export": "Export",
            "object": "Object",
            "string": "String",
            "number": "Number",
            "integer": "Integer",
            "array": "Array",
            "boolean": "Boolean",
            "null": "Null",
            "$ref": "$ref",
            "general": "General",
            "title": "Title",
            "description": "Description",
            "default": "Default",
            "required": "Required",
            "not-required": "Not Required",
            "nullable": "Nullable",
            "enumerated-values": "Enumerated Values",
            "add-value": "Add Value",
            "minimum-length": "Minimum Length",
            "maximum-length": "Maximum Length",
            "format": "Format",
            "pattern": "Pattern",
            "numeric": "Numeric",
            "minimum": "Minimum",
            "exclusive": "Exclusive",
            "maximum": "Maximum",
            "multiple-of": "Multiple of",
            "minimum-properties": "Minimum Properties",
            "maximum-properties": "Maximum Properties",
            "allow-additional-properties": "Allow Additional Properties",
            "additional-properties": "Additional Properties",
            "additional-items": "Additional Items",
            "minimum-items": "Minimum Items",
            "maximum-items": "Maximum Items",
            "unique-items": "Unique Items",
            "reference": "Reference",
            "view-mode-not-supported": "View Mode Not Supported"
        }
    };
    var i18n = (function () {
        const i18n = {
            translations: defaultTranslations,
            translate(untranslated) {
                let path = untranslated.split('.');
                let translationBranch = this.translations;
                for (let i = 0; i < path.length; i++) {
                    translationBranch = translationBranch[path[i]];
                    if (!translationBranch) {
                        console.error('translation not found for', untranslated);
                        return untranslated;
                    }
                }
                return translationBranch;
            }
        };
        return i18n;
    })();

    Context.globalVar = '';
    Context.i18n = i18n;
})(resourcesUrl);
})("jsonschemadesigner");