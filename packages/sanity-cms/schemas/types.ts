import type { GenericSchemaType, SchemaFields } from '@session/sanity-types';
import type { SeoType } from './fields/basic/seo';

type CustomFieldTypeMap = {
  seoMetaFields: SeoType;
};

export type SchemaFieldsType<Fields extends SchemaFields<CustomFieldTypeMap>> = GenericSchemaType<
  CustomFieldTypeMap,
  Fields
>;
