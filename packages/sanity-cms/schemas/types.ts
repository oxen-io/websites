import type { GenericSchemaType, SchemaFields } from '@session/sanity-types';

type CustomFieldTypeMap = {};

export type SchemaFieldsType<Fields extends SchemaFields<CustomFieldTypeMap>> = GenericSchemaType<
  CustomFieldTypeMap,
  Fields
>;
