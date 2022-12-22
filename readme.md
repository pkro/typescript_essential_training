<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [TypeScript Essential Training](#typescript-essential-training)
  - [Introduction](#introduction)
  - [Introducing typescript to your application](#introducing-typescript-to-your-application)
    - [Installation](#installation)
    - [Adding typescript to an existing solution](#adding-typescript-to-an-existing-solution)
    - [Adding type checking to javascript files](#adding-type-checking-to-javascript-files)
    - [Importing 3rd party types](#importing-3rd-party-types)
  - [Basic usage](#basic-usage)
    - [Primitives and built-in types](#primitives-and-built-in-types)
    - [Creating custom types with interfaces](#creating-custom-types-with-interfaces)
    - [Type definition files](#type-definition-files)
    - [Defining types using type aliases](#defining-types-using-type-aliases)
    - [Defining enumerable types](#defining-enumerable-types)
    - [Typing functions](#typing-functions)
    - [Defining metatypes using generics](#defining-metatypes-using-generics)
  - [Defining more complex types](#defining-more-complex-types)
    - [Combining multiple types with union types](#combining-multiple-types-with-union-types)
    - [Keyof operator](#keyof-operator)
    - [Typeof operator](#typeof-operator)
    - [Indexed access types](#indexed-access-types)
    - [Defining dynamic but limited types with records](#defining-dynamic-but-limited-types-with-records)
  - [Extending and extracting metadata from existing types](#extending-and-extracting-metadata-from-existing-types)
    - [Extending and modifying existing types](#extending-and-modifying-existing-types)
    - [Extracting metadata from existing types / Map types](#extracting-metadata-from-existing-types--map-types)
  - [Decorators](#decorators)
    - [Method decorators](#method-decorators)
    - [Class decorators](#class-decorators)
    - [Creating a property decorator](#creating-a-property-decorator)
  - [Working with modules](#working-with-modules)
    - [Defining global types with ambient modules](#defining-global-types-with-ambient-modules)
    - [Declaration merging](#declaration-merging)
    - [Executing modular code](#executing-modular-code)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

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

### Type definition files

> TypeScript has two main kinds of files. .ts files are implementation files that contain types and executable code. These are the files that produce .js outputs, and are where you'd normally write your code.

> .d.ts files are declaration files that contain only type information. These files don't produce .js outputs; they are only used for typechecking. We'll learn more about how to write our own declaration files later.

https://microsoft.github.io/TypeScript-New-Handbook/chapters/type-declarations/#.d.ts-files

`*.d.ts` files present in the projects folder are found and used automatically by typescript.

The consensus seems to be NOT to write them yourself unless converting a JS library for typesafe use in typescript or converting a JS application to typescript without having to change all the code (?))

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

## Defining more complex types

### Combining multiple types with union types

    interface Contact {
      id: number;
      name: string;
      birthdate?: Date | number | string; // can accept any of these 
    }

To use union types, the actual type must be checked / asserted in the code.

    function getBirthDate(contact: Contact) {
        if (typeof contact.birthDate === "number") {
            return new Date(contact.birthDate);
        }
        else if (typeof contact.birthDate === "string") {
            return Date.parse(contact.birthDate)
        }
        else {
            return contact.birthDate
        }
    }

Type aliases can be used:

    type ContactBirthDate = Date | number | string;

    interface Contact {
      id: number;
      name: string;
      birthdate?: ContactBirthDate 
    }

Interfaces can be combined to a new interface:

    interface AddressableContact extends Contact, Address {};

or a new type using `&`:

    type AddressableCcontent = Contact & Address;

Union type aliases can be also used as a (arguably better) alternative to enum types and still provide full code completion and type checks:

    type Status = 'done' | 'in-progredd' | 'todo'


### Keyof operator

> The keyof operator takes an object type and produces a string or numeric literal union of its keys. The following type P is the same type as “x” | “y”:

    type Point = { x: number; y: number };
    type P = keyof Point;

From https://www.typescriptlang.org/docs/handbook/2/keyof-types.html

    type ContactFields = keyof Contact;
    // ContactFields = "id" | "name" | "contact"

Real world example:

    // ensure the given property exists in Contact
    function getValue(source: Contact, propertyName: keyof Contact) {
      return source[propertyName];
    }

Even better with generics to make the function useful for any type of object:

    function getValue<T>(source: T, propertyName: keyof T) {
      return source[propertyName];
    }

Using generics, we can either give the type explicitly on function call:

    const name = getValue<Contact>(myContact, 'name');

or let typescript *infer* the type:

    const value = getValue({min: 0, max: 10}, 'max'); // 'min'/'max' is autocompleted / typechecked

We can also introduce a second generic type for the `propertyName` so it can be referenced inside the function:

    function getValue<T, U extends keyof T>(source: T, propertyName: U) {
      return source[propertyName];
    }

### Typeof operator

`typeof` is a native javascript operator:

    typeof "hey"; // 'string'
    typeof myContact; // 'object'

This can be used to assert types so typescript can narrow down / infer the type of a union type:

    function toContact(nameOrContact: string | Contact): Contact {
        if (typeof nameOrContact === "object") {
            // ts now knows that it must be a Contact
            return {
                id: nameOrContact.id,
                name: nameOrContact.name,
                status: nameOrContact.status
            }
        }
        else {
            // ts now knows that it must be a string
            return {
                id: 0,
                name: nameOrContact,
                status: "active"
            }
        }
    }

`typeof` can be used to create explicit types from a given object:

    const myType = { min: 1, max: 200 }
    
    function save(source: typeof myType) {...}

or explicitely named:

    type MinMax = typeof myType;
    // same as type MinMax = {min: number, max: number}

### Indexed access types

Indexed types can be use to make a property type match the type of a property in another type / interface; it uses the same syntax as accessing an object property using `[]`.

    interface Contact {
      id: number;
      // ...
    }
    
    interface ContactEvent {
      contactId: Contact["id"]; // same as contactId: number
    }


That way, when changing the `id` type to number, it needs to be changed in only one place (the same could be done if we defined a type alias for the id and used that everywhere).

Multiple levels are ok too (e.g. Contact["Address"]["Street"])

Usage with generics (see `handleEvent` function at the bottom):

    interface ContactEvent {
        contactId: Contact["id"];
    }
    
    interface ContactDeletedEvent extends ContactEvent {
    }
    
    interface ContactStatusChangedEvent extends ContactEvent {
        oldStatus: Contact["status"];
        newStatus: Contact["status"];
    }
    
    interface ContactEvents {
        deleted: ContactDeletedEvent;
        statusChanged: ContactStatusChangedEvent;
        // ... and so on
    }
    
    function getValue<T, U extends keyof T>(source: T, propertyName: U) {
        return source[propertyName];
    }
    
    function handleEvent<T extends keyof ContactEvents>(
        eventName: T,
        handler: (evt: ContactEvents[T]) => void
    ) {
        if (eventName === "statusChanged") {
            handler({ contactId: 1, oldStatus: "active", newStatus: "inactive" })
        }
    }

    handleEvent("statusChanged", evt => evt) // evt is automatically infered as ContactStatusChangedEvent

### Defining dynamic but limited types with records

As using `any` essentially means opting out of typechecking (bad), records can be a more type-safe alternative for describing flexible object types.

Before, using any:
  
    let x: any = { name: "blah" }
    x.mynum = 1234; // no error
    x = () => console.log("hi"); // no error

Using `Record`:

    let x: Record<string, string | number> = { name: "blah" } // fine, key and value are string
    x.mynum = 1234;
    x.flag = true; // error, neither string nor number.
    x = 1234; // error, not a record / object

Usage to implement a search:

    type ContactStatus = "active" | "inactive" | "new";
    
    interface Address {
        street: string;
        province: string;
        postalCode: string;
    }
    
    interface Contact {
        id: number;
        name: string;
        status: ContactStatus;
        address: Address;
    }
    
    interface Query {
        sort?: 'asc' | 'desc';
        matches(val): boolean;
    }
    
    function searchContacts(contacts: Contact[], query: Record<keyof Contact, Query>) {
        return contacts.filter(contact => {
            for (const property of Object.keys(contact) as (keyof Contact)[]) {
                // get the query object for this property
                const propertyQuery = query[property];
                // check to see if it matches
                if (propertyQuery && propertyQuery.matches(contact[property])) {
                    return true;
                }
            }
    
            return false;
        })
    }

    const filteredContacts = searchContacts(
        [/* contacts */],
        // typescript will complain here because it expects ALL properties
        // of Contact to be defined in the object
        {
            id: { matches: (id) => id === 123 },
            name: { matches: (name) => name === "Carol Weaver" },
        }
    );

## Extending and extracting metadata from existing types

### Extending and modifying existing types

`Partial` is a generic type that makes all properties of a given type optional. With it, we can solve the problem above:

    function searchContacts(contacts: Contact[], query: Partial<Record<keyof Contact, Query>>)

If we want to *restrict* which properties we can use, e.g. we don't want the `address` and `status` field to be definable as a search object property, we can use `Omit` which takes a type and a list of the properties to omit (remove) from the type:

    type ContactQuery = Omit<Partial<Record<keyof Contact, Query>>, 'address' | 'status'>;

    function searchContacts(contacts: Contact[], 
                            query: ContactQuery)

the `query` parameter would now be

    type ContactQuery = {
      id?: Query;
      name?: Query;
    }

If we added another field to the `Contact` type, the resulting `ContactQuery` would include that type. If we only want specific properties to be included, we can explicitly name them using `Pick` (the "opposite" of `Omit`:

    type ContactQuery = Pick<Partial<Record<keyof Contact, Query>>, 'id' | 'name'>

or (same as) 

    type ContactQuery = Partial<Pick<Record<keyof Contact, Query>, 'id' | 'name'>>

To make all properties required, we can use `Required`:

    type RequiredContactQuery = Required<ContactQuery>
    
    // =  
    type ContactQuery = {
      id: Query;
      name: Query;
    }

### Extracting metadata from existing types / Map types

A Map type from an existing type:

    type ContactQuery = {
      [TProp in keyof Contact]? Query
    }

resulting in 

    type ContactQuery = {
      id?: Query;
      name?: Query;
      status?: Query;
      address?: Query;
    }

which is the same as `Partial<Record<keyof Contact, Query>>`.

Map types makes the definition complex types more readable. 

Here we want to change

    interface Query {
        sort?: 'asc' | 'desc';
        matches(val): boolean; // val is untyped, same as (val: any) => boolean
    }

so that `val` is properly typed by making it generic.

    interface Query<TProp> {
      sort?: 'asc' | 'desc';
      matches(val: TProp): boolean;
    }

and use it like this in `ContactQuery`:

    type ContactQuery = {
      [TProp in keyof Contact]? Query<Contact[TProp]>
    }

resulting in 

    type ContactQuery = {
      id?: Query<number>;
      name?: Query<string>;
      status?: Query<ContactStatus>;
      address?: Query<Address>;
    }

so that all properties are correctly typed.

To make `searchContacts` not complain about unpredictable types, we must change

    const propertyQuery = query[property];

to 

    const propertyQuery = query[property] as Query<Contact[keyof Contact]>;

Full function: 

    function searchContacts(contacts: Contact[], query: ContactQuery) {
        return contacts.filter(contact => {
            for (const property of Object.keys(contact) as (keyof Contact)[]) {
                const propertyQuery = query[property] as Query<Contact[keyof Contact]>;
                if (propertyQuery && propertyQuery.matches(contact[property])) {
                    return true;
                }
            }
    
            return false;
        })
    }

While complicated at first, it's one of the most useful ways to avoid using `any`.

Challenge:

    function query<T>(
        items: T[],
        query: any  // <--- replace this!
    ) {
        return items.filter(item => {
            // iterate through each of the item's properties
            for (const property of Object.keys(item)) {
    
                // get the query for this property name
                const propertyQuery = query[property]
    
                // see if this property value matches the query
                if (propertyQuery && propertyQuery(item[property])) {
                    return true
                }
            }
    
            // nothing matched so return false
            return false
        })
    }
    
    const matches = query(
        [
            { name: "Ted", age: 12 },
            { name: "Angie", age: 31 }
        ],
        {
            name: name => name === "Angie",
            age: age => age > 30
        })

Own solution:

    query: Record<keyof T, (arg: T[keyof T]) => boolean>

Solution 1: same as own; problem: arg can be `number | string` for any of the object properties, which is not true.

Solution 2 (`?` makes any property optional and TProp makes it so it matches only the real type of the given property *I don't really get how this works*):

    query: {
      [TProp in keyof T]?: (val: T[TProp]) => boolean
    }

## Decorators

Metadata that can be added to classes, functions etc adding behavior to code.

The following class has logging and authorization checks inside the code of its methods, which shouldn't be the methods primary concern and is also duplicating code for it.

    interface Contact {
        id: number;
    }
    
    const currentUser = {
        id: 1234,
        roles: ["ContactEditor"],
        isInRole(role: string): boolean {
            return this.roles.contains(role);
        }
    }
    
    class ContactRepository {
        private contacts: Contact[] = [];
    
        getContactById(id: number): Contact | null {
            // logging
            console.trace(`ContactRepository.getContactById: BEGIN`);
            // auth check
            if (!currentUser.isInRole("ContactViewer")) {
                throw Error("User not authorized to execute this action");
            }
            // actual logic
            const contact = this.contacts.find(x => x.id === id);
            // logging
            console.debug(`ContactRepository.getContactById: END`);
    
            return contact;
        }
    
        save(contact: Contact): void {
            console.trace(`ContactRepository.save: BEGIN`);
    
            if (!currentUser.isInRole("ContactEditor")) {
                throw Error("User not authorized to execute this action");
            }
    
            const existing = this.getContactById(contact.id);
    
            if (existing) {
                Object.assign(existing, contact);
            } else {
                this.contacts.push(contact);
            }
    
            console.debug(`ContactRepository.save: END`);
        }
    }

With decorators, this could be reduced to something like

    // ...
    @log // class decorator
    class ContactRepository {
        private contacts: Contact[] = [];
        
        @authorize("ContactViewer") // method decorator
        getContactById(id: number): Contact | null {
            const contact = this.contacts.find(x => x.id === id);
            return contact;
        }
    
        @authorize("ContactEditor")
        save(contact: Contact): void {
            const existing = this.getContactById(contact.id);
    
            if (existing) {
                Object.assign(existing, contact);
            } else {
                this.contacts.push(contact);
            }
        }
    }

Decorators must be explicitely enabled in typescript and are also proposed for vanilla javascript, so once it's implemented in plain JS, it might conflict with the typescript decorator syntax and thus add some technical debt.

Enabling decorators (and *optionally* `emitDecoratorMetadata`) in `tsconfig.json`:

    {
        "compilerOptions": {
            // ...
            "experimentalDecorators": true,
            "emitDecoratorMetadata": true,
        },
    
        // ...
    }

Installing `reflect-metadata`:

    npm i reflect-metadata --save

`reflect-metadata` adds polyfills for proposed ECMAScript features.

### Method decorators

    function authorize(target: any, // the object the decorator is being applied to (the instance of the object that the method belongs to)
                       property: string, // name of the property
                       descriptor: PropertyDescriptor // object containing the current metadata about the property
    ) {
    
    }

Arguments:

- `target`: the object the decorator is being applied to (the instance of the object that the method belongs to)
- property: string, // name of the property (method name (?))
- descriptor: PropertyDescriptor // descriptor object containing the current metadata about the property, which has always the following form (ctrl-click on `PropertyDescriptor` for the following definition):


    interface PropertyDescriptor {
      configurable?: boolean;
      enumerable?: boolean;
      value?: any;
      writable?: boolean;
      get?(): any;
      set?(v: any): void;
    }

The `value?` property is the most interesting one if the property is a method as its value is the function that is executed when the function is called.

2 Options to change / enhance the behavior of the method in the decorator function:

Edit in place: 

    descriptor.value = function () {
      //...
    }

Return a new descriptor object which typescript uses to replace the current `PropertyDescriptor`:

    return {
      // ...
    } as PropertyDescriptor

No method is inherently better.

Decorator (not yet with the role parameter we use in the example):

    function authorize(target: any, property: string, descriptor: PropertyDescriptor) {
      // copy current method
      const wrapped = descriptor.value;
  
      descriptor.value = function () {
          // additional behavior
          if(!currentUser.isAuthenticated()) {
              throw Error("Not authorized");
          }
          // execute the method as it was
          return wrapped.apply(this, arguments);
      }
    }

Parameters can be passed to decorators by creating decorator factories that receive the parameters and returns a decorator that has access to these additional parameters via closures (meaning they simply have access to the variable scope they were created in):

    function authorize(role: string) {
        return function authorizeDecorator(target: any, property: string, descriptor: PropertyDescriptor) {
            const wrapped = descriptor.value
    
            descriptor.value = function () {
                if (!currentUser.isAuthenticated()) {
                    throw Error("User is not authenticated");
                }
                if (!currentUser.isInRole(role)) {
                    throw Error("User not authorized to execute this action");
                }
                
                return wrapped.apply(this, arguments);
            }
        }
    }
    
    class ContactRepository {
        private contacts: Contact[] = [];
    
        @authorize("ContactViewer")
        getContactById(id: number): Contact | null {
            return  this.contacts.find(x => x.id === id);
        }
    
        @authorize("ContactEditor")
        save(contact: Contact): void {
            const existing = this.getContactById(contact.id);
    
            if (existing) {
                Object.assign(existing, contact);
            } else {
                this.contacts.push(contact);
            }
        }
    }

### Class decorators

Syntax is the same as function decorators:

    @freeze
    class ContactRepository {/*...*/}

The target of the decorator is not the instantiated object but the classes constructor function, so one can think about it as actually being this:

    class ContactRepository {
      @freeze
      constructor() {/*...*/}
      //...
    }

Example:

    function freeze(constructor: Function) {
        Object.freeze(constructor);
        Object.freeze(constructor.prototype);
    }
    
    @freeze
    class ContactRepository {
      // ...


Modifying the constructor function is a rare usecase, most often class decorators are used to add functionality to classes:

    // can't use  a function type so we convert it to a class type
    // as far as I understand
    // basically: just use this type for class decorators
    function singleton<T extends { new(...args: any[]): {}}>(constructor: T) {
      return class Singleton extends constructor {
          static _instance = null;
          constructor(...args) {
              super(...args);
              if (!Singleton._instance) {
                  Singleton._instance = new Singleton();
              }
              return Singleton._instance;
          }
      }
    }

Decorators can be stacked:

    @freeze
    @singleton
    class ContactRepository {

### Creating a property decorator

    function auditable(target: object, key: string | symbol) {
        // save initial value
        let val = target[key];
    
        // overwrite property with custom getter / setter
        Object.defineProperty(target, key, {
            get: () => val,
            set: (newVal) => {
                console.log(`${key.toString()} changed to ${newVal}`);
                val = newVal;
            },
            enumerable: true,
            configurable: true,
        })
    }

    class ContactRepository {
      @auditable
      private contacts: Contact[] = [];
      // ...



## Working with modules

Modules provide their own namespaces. `import` and `export` is now supported natively in all major browsers and doesn't need webpack anymore.

### Defining global types with ambient modules

Useful for adding types to existing JS codebases converting the js files.

global.d.ts (name doesn't matter except for the `.d.ts` suffix):

    declare global {
      /** formats a date **/
      function formatDate(date: Date): string
    }
    
    export {} // sic!

### Declaration merging

Classes are regarded as interfaces by typescript.  To add properties to an existing class, we can write an interface with the same name as the class that are *merged* to the existing class. 

Example 1: class

    interface Customer {
      /** saves the customer **/
      save(): void
    }
    
    class Customer {}
    
    const customer = new Customer();
    customer.save = function() {}

Example 2: adding members to the global `Window` object:

global.d.ts

    declare global {
      interface Window {
        MY_VAR: string
      }
    }

    export {}

Usage (in any js / ts file):

    const myVar = window.MY_VAR

### Executing modular code

NodeJS doesn't support the import / export syntax. Add support by adding an entry to tsconfig.json:

    {
        "compilerOptions": {
            // ...
            "module": "CommonJS"
        },
        // ...
    }

For browsers, even though most browsers support it now, it is recommended to use a bundling tool such as `webpack` or `parcel`.
