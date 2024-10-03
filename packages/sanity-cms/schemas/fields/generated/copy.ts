import { defineArrayMember } from 'sanity';

export const copyFieldOf = [
  defineArrayMember({ name: 'block', type: 'block' }),
  defineArrayMember({ name: 'image', type: 'image' }),
];
