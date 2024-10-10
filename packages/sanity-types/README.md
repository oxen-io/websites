# @session/sanity-types

This package is a TypeScript type generation utility for [Sanity](https://sanity.io/) CMS schemas.

## Getting Started

You can follow the generic instructions in the root [README.md](../../README.md#getting-started) to get started.

## Usage

### Basic usage

```ts
// /schemas/types.ts
import type { GenericSchemaType, SchemaFields } from '@session/sanity-types';

type CustomFieldTypeMap = {
  potato: {
    colour: string;
    size: number;
  };
};

export type SchemaFieldsType<Fields extends SchemaFields<CustomFieldTypeMap>> = GenericSchemaType<
  CustomFieldTypeMap,
  Fields
>;

// /schemas/page.ts
import type { SchemaType } from './types';

const pageFields = [
  defineField({
    name: 'potato',
    type: 'potato',
  }),
];

export type PageSchemaType = SchemaFieldsType<typeof pageFields>; // { potato: { colour: string; size: number; } }

export const pageSchema = defineType({
  type: 'document',
  name: 'page',
  fields: pageFields,
});

```

### Add document fields

 ```ts
// /schemas/page.ts
import type { DocumentFields } from '@session/sanity-types';
import type { SchemaType } from './types';

const pageFields = [
  defineField({
    name: 'potato',
    type: 'potato',
  }),
];

export type PageSchemaType = SchemaFieldsType<typeof pageFields> & DocumentFields; // { potato: { colour: string; size: number; }, _id: string; _type: string; ... }

export const pageSchema = defineType({
  type: 'document',
  name: 'page',
  fields: pageFields,
});
```