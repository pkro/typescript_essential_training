# TypeScript Essential Training

Follow-along of the course of the same name by Jess Chadwick on linkedin learning

## Introduction

- developed by microsoft
- Superset of javascript
- compiles down to javascript
- provides compile-time code checking 
- documentation: typescriptlang.org

## Introducing typescript to your application

### Installation

- install globally or project specific with npm

### Adding typescript to an existing solution

Add `tsconfig.json` to root of the application

    {
        "compilerOptions": {
            "allowJs": true,
            "checkJs": true,
            "outDir": "build",
            "target": "esnext",
            "noEmit": true
        },
        "include": ["src/**/*"]
    }

- allowJs: Allow JavaScript files to be imported inside your project, instead of just .ts and .tsx files
- checkJs: When checkJs is enabled then errors are reported in JavaScript file
- target: 
  - "ES3": compiles down to the most compatible JS version, e.g. converts classes to functions
  - "ES6": compatible with all major current browsers 
  - "esnext": uses the latest version of javascript; good if another tool like babel transpiles to another language level target and typescript is just used for type checking
- noEmit:
  - don't write anything to disk (to "build", just do type checking (if babel / webpack is used)


[All tsconfig options](https://www.typescriptlang.org/tsconfig)

### Adding type checking to javascript files

When using allowJs / checkJs = true in tsconfig, typescript also analyzes JSDoc type hints:

    /**
     * gets a contact
     * @param {number} contactId
     * @returns {Promise<{name, id: number, birthDate: Date}>}
     */
    async function getContact(contactId) {
      const resp = await $.ajax({
        url: `/contacts/${contactId}`,
        dataType: "json",
      });
    
      return {
        id: +resp.id,
        name: resp.name,
        birthDate: new Date(resp.birthDate),
      };
    }

### Importing 3rd party types

When using external libraries such as e.g. jquery, typescript is not aware of the types used and reports errors. To import 3rd party types (if not built into the library itself, which is rare), install them from the [definitelytyped repo](https://github.com/DefinitelyTyped/DefinitelyTyped) using npm.
To check which types exist, search for e.g. `@types jquery` on [npmjs.com](https://www.npmjs.com/). Install using the installation command provided when clicking on the package, e.g. `npm install --save @types/jquery` in the root folder of the project.

Typescript now finds the type definitions and also lets the IDE provide great autocomplete.
