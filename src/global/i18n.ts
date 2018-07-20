const defaultTranslations: any = {
  "json-schema-desinger": {
    "test-translation": "translation successfull"
  }
};

export default (function() {
  const i18n = {
    translations: defaultTranslations,
    translate(untranslated: string) {
      let path: string[] = untranslated.split('.');
      let translationBranch = this.translations;
      for (let i = 0; i < path.length; i++) {
        translationBranch = translationBranch[path[i]];
        if (!translationBranch) return untranslated;
      }
      return translationBranch;
    }
  }

  return i18n;
})();
