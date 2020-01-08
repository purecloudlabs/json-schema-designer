const defaultTranslations: any = {
  "json-schema-designer": {
    "schema": "Schema",
    "definitions": "Definitions",
    "add-definition": "Add Definition",
    "select-definition": "Select Definition...",
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
    "delete?": "Delete?",
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
    "view-mode-not-supported": "View Mode Not Supported",
    "definition-name": "Definition Name",
    "item": "Item {{num}}"
  }
};

export default (function() {
  const i18n = {
    translations: defaultTranslations,
    translate(untranslated: string, options : object = {}) {
      // translation can be in json or table format
      // do translation table lookup
      if (this.translations[untranslated]) {
        return this.translations[untranslated];
      } else {
      // parse the json
        let path: string[] = untranslated.split('.');
        let translationBranch = this.translations;
        for (let i = 0; i < path.length; i++) {
          translationBranch = translationBranch[path[i]];
          if (!translationBranch) {
            console.error('translation not found for', untranslated);
            return untranslated;
          }
        }
        if (options) {
          for ( const key of Object.keys(options)){
            translationBranch = translationBranch.replace('{{'+key+'}}', options[key]);
          }
        }
        return translationBranch;
      }
    }
  }

  return i18n;
})();
