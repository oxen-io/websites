/**
 * Example of breaking the types:
 * name and type are not constant so cant be typed.
 *
 * export const createCopyField = ({ name, title, description }: CreateCopyOptions) => {
 *   return defineField({
 *     name,
 *     title,
 *     type: 'array',
 *     of: [defineArrayMember({ type: 'block' }), defineArrayMember({ type: 'image' })],
 *     description,
 *   });
 * };
 */

type UnknownFieldType = unknown;

type SanityFieldTypeMap = {
  string: string;
  slug: {
    current: string;
  };
  text: string;
  number: number;
  boolean: boolean;
  date: Date;
  reference: any;
  object: Record<string, UnknownFieldType>;
  // TODO: add support for typing arrays
  array: Array<UnknownFieldType>;
  url: string;
};

type FieldTypeMap<CustomFieldTypeMap extends {}> = SanityFieldTypeMap &
  CustomFieldTypeMap &
  Record<string, UnknownFieldType>;

type FieldType<CustomFieldTypeMap extends {}> = keyof FieldTypeMap<CustomFieldTypeMap>;

type SchemaField<CustomFieldTypeMap extends {}> = {
  name: string;
  type: FieldType<CustomFieldTypeMap>;
};

export type SchemaFields<CustomFieldTypeMap extends {}> = Array<SchemaField<CustomFieldTypeMap>>;

/**
 * Use this type to generate a type for a Sanity schema.
 *
 * @example Basic usage
 * ```ts
 * // /schemas/types.ts
 * import type { GenericSchemaType, SchemaFields } from '@session/sanity-types';
 *
 * type CustomFieldTypeMap = {
 *   potato: {
 *     colour: string;
 *     size: number;
 *   };
 * };
 *
 * export type SchemaFieldsType<Fields extends SchemaFields<CustomFieldTypeMap>> = GenericSchemaType<
 *   CustomFieldTypeMap,
 *   Fields
 * >;
 *
 * // /schemas/page.ts
 * import type { SchemaType } from './types';
 *
 * const pageFields = [
 *   defineField({
 *     name: 'potato',
 *     type: 'potato',
 *   }),
 * ];
 *
 * export type PageSchemaType = SchemaFieldsType<typeof pageFields>; // { potato: { colour: string; size: number; } }
 *
 * export const pageSchema = defineType({
 *   type: 'document',
 *   name: 'page',
 *   fields: pageFields,
 *  });
 *
 * ```
 *
 * @example Add document fields
 *  ```ts
 * // /schemas/page.ts
 * import type { DocumentFields } from '@session/sanity-types';
 * import type { SchemaType } from './types';
 *
 * const pageFields = [
 *   defineField({
 *     name: 'potato',
 *     type: 'potato',
 *   }),
 * ];
 *
 * export type PageSchemaType = SchemaFieldsType<typeof pageFields> & DocumentFields; // { potato: { colour: string; size: number; }, _id: string; _type: string; ... }
 *
 * export const pageSchema = defineType({
 *   type: 'document',
 *   name: 'page',
 *   fields: pageFields,
 *  });
 * ```
 */
export type GenericSchemaType<
  CustomFieldTypeMap extends {},
  Fields extends SchemaFields<CustomFieldTypeMap>,
> = {
  [Field in Fields[number] as Field['name']]: FieldTypeMap<CustomFieldTypeMap>[Field['type']];
};

export type DocumentFields = {
  _id: string;
  _type: string;
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
};
