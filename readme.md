![Built With Stencil](https://img.shields.io/badge/-Built%20With%20Stencil-16161d.svg?logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjIuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI%2BCjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI%2BCgkuc3Qwe2ZpbGw6I0ZGRkZGRjt9Cjwvc3R5bGU%2BCjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MjQuNywzNzMuOWMwLDM3LjYtNTUuMSw2OC42LTkyLjcsNjguNkgxODAuNGMtMzcuOSwwLTkyLjctMzAuNy05Mi43LTY4LjZ2LTMuNmgzMzYuOVYzNzMuOXoiLz4KPHBhdGggY2xhc3M9InN0MCIgZD0iTTQyNC43LDI5Mi4xSDE4MC40Yy0zNy42LDAtOTIuNy0zMS05Mi43LTY4LjZ2LTMuNkgzMzJjMzcuNiwwLDkyLjcsMzEsOTIuNyw2OC42VjI5Mi4xeiIvPgo8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNDI0LjcsMTQxLjdIODcuN3YtMy42YzAtMzcuNiw1NC44LTY4LjYsOTIuNy02OC42SDMzMmMzNy45LDAsOTIuNywzMC43LDkyLjcsNjguNlYxNDEuN3oiLz4KPC9zdmc%2BCg%3D%3D&colorA=16161d&style=flat-square)

# JSON Schema Designer

The JSON Schema Designer is a web component that allows easy JSON Schema creation and configuration with a GUI point and click interface.

## Installation
- Run `npm install json-schema-designer --save`
- Put a script tag similar to this `<script src='node_modules/json-schema-designer/dist/jsonschemadesigner.js'></script>` in the head of your index.html
- Then you can use the element anywhere in your template, JSX, html etc

## Basic Usage

### Properties
* inputschema (optional) - an object containing the JSON Schema to load into the designer.
* inputtranslation (optional) - an object containing translations for the strings within the designer.
* viewmode (optional) - the view mode of the designer. options are "tabs", "columns" and "designerOnly" (default)
* datatypes (optional) - list of datatypes that can be selected for each item except for root. default: ['string', 'number', 'integer', 'object', 'array', 'boolean', 'null', '$ref']
* usedefinitions (optional) - boolean value that allows or disallows the adding of definitions to the json schema. (default: true)

Note: all properties passed to the component will be stringified.

```html
<json-schema-designer
  id="json-designer"
  viewmode="designerOnly"
  inputschema={{schema}}
  inputtranslations={{translations}}
  datatypes={{datatypes}}
  usedefinitions="true">
</json-schema-designer>
```

### Methods

* exportSchema - returns the stringified JSON object of the configured JSON Schema.

Example Usage:
```javascript
let schemaDesigner = document.querySelector('#json-designer')
let jsonSchema = JSON.parse(schemaDesigner.exportSchema())
```


## Advanced Usage

To add your own translations to the designer, pass in a translations object with the following format:

```javascript
{
  "json-schema-designer": {
    "schema": "Schema",
    "definitions": "Definitions",
    "add-definition": "Add Definition"
    ...
  }
}
```
Only translation found inside of the "json-schema-designer" key will be used.

A list of all translatable strings can be found in  `src/global/i18n.ts`

## References

https://json-schema.org/

https://stenciljs.com/docs/introduction/
