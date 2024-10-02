import { defineArrayMember } from 'sanity';
import { SplitVerticalIcon } from '@sanity/icons';
import { pickLinkField } from '../basic/links';

export const copyFieldOf = [
  defineArrayMember({ name: 'block', type: 'block' }),
  defineArrayMember({ name: 'image', type: 'image' }),
  defineArrayMember({
    name: 'button',
    type: 'object',
    fields: [pickLinkField],
    icon: SplitVerticalIcon,
    // TODO: figure out how to make this work
    // marks: {
    //   decorators: [
    //     {
    //       title: 'Button',
    //       value: 'button',
    //       component: SanityButton,
    //     },
    //   ],
    // },
  }),
];
