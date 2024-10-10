import type { GenericSchemaType, SchemaFields } from '@session/sanity-types';
import type { SeoType } from './fields/basic/seo';
import type {
  ImageFieldsSchemaType,
  ImageFieldsSchemaTypeWithoutAltText,
} from './fields/basic/image';
import type { PortableTextBlock } from 'sanity';

type CustomFieldTypeMap = {
  seoMetaFields: SeoType;
  image: ImageFieldsSchemaType | ImageFieldsSchemaTypeWithoutAltText;
  block: PortableTextBlock;
};

export type SchemaFieldsType<Fields extends SchemaFields<CustomFieldTypeMap>> = GenericSchemaType<
  CustomFieldTypeMap,
  Fields
>;
