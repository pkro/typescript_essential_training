# TypeScript Essential Training

Follow-along of the course of the same name by Jess Chadwick on linkedin learning

## Introduction

- developed by microsoft
- Superset of javascript
- compiles down to javascript
- provides compile-time code checking 
- documentation: typescriptlang.org

[Typescript playground](https://www.typescriptlang.org/play)

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

## Basic usage

### Primitives and built-in types

Typescript can infer types from assignments:

`let x = 0;` - ts infers `number`
`let x = "yay";` - ts infers `string`

To define a type without assignment:

`let x: number;`
`let arrOfStrings: string[]`
`let arrOfStrings: Array<String>`

`let b: any;` Variable can be of any type

Variables can be cast to the `any` type:

    let a: number;
    a = "32" as any;

Using `any` is not recommended as it goes against the point of typescript of adding typechecking.

### Creating custom types with interfaces

Own types can be defined with `interface`:

    interface Contact {
      id: number;
      name: string;
      birthdate: Date;
    }

    let primaryContact: Contact = {
      id: 1,
      name: "yay",
      birthdate: new Date("01-01-1980")
    };

To make fields fields as optional (but still enforce typing IF it exists), add a `?` behind the variable name:

    birthdate?: Date;

Multiple interfaces can be combined to create new ones:

    interface Address {
      street: string;
      postal code: string;
      city: string;
    }
    
    interface Contact extends Address {
      id: number;
      //...
    }

To combine 2 existing interfaces:

    interface IFooBar extends IFoo, IBar {}

Creating a *type* from 2 interfaces:

    type IFooBar = IFoo & IBar;

### Defining types using type aliases

Type alias: different name for existing type, e.g. to add meaning to types or change the type later.

    type ContactName = string;

### Defining enumerable types

To avoid typos or remembering valid values and add better autocompletion, an enum of predefined values can be used; Enums actually get compiled into the code as numbers, starting with 0 if no explicit value is given.

    enum ContactStatus {
      Active, // 0 gets automatically assigned by ts
      Inactive, // 1
      New // 2
    }
    
    // with explicit values (all must be the same type)
    enum ContactStatus2 {
      Active = "active",
      Inactive = "inactive",
      New = "new"
    }

    // usage
    const status = ContactStatus.Active;

Another way to enforce a value to be one of a give set of values:

    interface Contact {
      // ...
      status: 'active' | 'inactive' | 'canceled'
    }

### Typing functions

    function clone(source: Contact): Contact {
      return Object.assign({}, source)
    }

The return type can also be inferred if possible. In the case above, `Object.apply` returns `any` type, so that's what ts would infer if we didn't specify `Contact` as the return type. 

Typing functions as parameters:

    function doSomething(func: (source: Contact) => Contact) {
      //...
    }

Defining function types in interfaces:

    interface Contact {
      // ...
      clone(name: string): Contact,
      anotherClone: (name: string) => Contact // same as clone above
    }

### Defining metatypes using generics

A metatype represents any other type you want to substitute in. Here we want to create a `clone` function that can take in any type of object and ensure it returns the same type. 

    function clone<T>(source: T): T {
      return Object.assign({}, source);
    }
    
    const dateRange = { start: Date.now(), endDate: Date.now() }
    const dateRangeCopy = clone(dateRange);

Using `T` is just a convention and anything (that isn't already a type name) can be used. For multiple generic types, the convention is to use `T`, `U` and `V` or `T1`, `T2` etc.

    function clone<T1, T2>(source: T): T2 {
      return Object.assign({}, source);
    }

When using multiple types, they must be specified on call as now the return type can't be inferred from the source type:

    const cp = clone<Contact, Date>(dateRange)

Note that this example doesn't really make sense as `Object.assign` will not return a date here if the source is another type.

Valid types can be restricted using `extends`:

    // the return type must at least match the properties as the first parameter
    // but can have any other properties and must not (but can) be derived from 
    // the first parameters type
    function clone<T, U extends V>(source: T): U {
      return Object.assign({}, source);
    }

Usage:

    interface UserContact {
      id: number,
      name: string,
    }
    
    interface UserContact {
      id: number,
      name: string,
      username: string
    }

    const c: Contact = { id: 123, name: 'Homer' }
    const u = clone<Contact, UserContact>(c);

Generics are not limited to functions but can be applied to interfaces and classes:

    interface UserContact<TExternalId> {
      id: number,
      name: string,
      username: string,
      externalId: TExternalId,
      loadExternalId(): Task<TExternalId>
    }

Challenge solution:

    enum Status {
        Done = "done",
        InProgress = "in-progress",
        Todo = "todo",
    }
    
    interface ITodoItem {
        id: number,
        title: string,
        status: Status,
        completedOn?: Date
    }
    
    const todoItems: ITodoItem[] = [
        { id: 1, title: "Learn HTML", status: Status.Done, completedOn: new Date("2021-09-11") },
        { id: 2, title: "Learn TypeScript", status: Status.InProgress },
        { id: 3, title: "Write the best app in the world", status: Status.Todo },
    ]
    
    
    
    function addTodoItem(todo: string): ITodoItem {
        const id = getNextId<ITodoItem, number>(todoItems)
    
        const newTodo = {
            id,
            title: todo,
            status: Status.Todo,
        }
    
        todoItems.push(newTodo)
    
        return newTodo
    }
    
    function getNextId<T extends { id: number }, U>(items: T[]): number {
        return items.reduce((max, x) => x.id > max ? max : x.id, 0) + 1
    }
    
    const newTodo = addTodoItem("Buy lots of stuff with all the money we make from the app")
    
    console.log(JSON.stringify(newTodo))
