import type { GenericSchemaType, SchemaFields } from '@session/sanity-types';

type CustomFieldTypeMap = {
  //TODO: type this
  seoMetaFields: 'string';
};

export type SchemaFieldsType<Fields extends SchemaFields<CustomFieldTypeMap>> = GenericSchemaType<
  CustomFieldTypeMap,
  Fields
>;
