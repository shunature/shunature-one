import { defineType, defineField } from 'sanity';

export const postSchema = defineType({
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Published Date',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail Image File Name (Legacy)',
      description: 'e.g. "scene39.webp". Placed inside public/blog/thumbnails/',
      type: 'string',
    }),
    defineField({
      name: 'thumbnailImage',
      title: 'Thumbnail Image (New Upload)',
      description: 'Upload a new thumbnail to Sanity CDN',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'thumbnail_credit',
      title: 'Thumbnail Credit',
      type: 'string',
    }),
    defineField({
      name: 'thumbnail_credit_url',
      title: 'Thumbnail Credit URL',
      type: 'url',
    }),
    defineField({
      name: 'weather',
      title: 'Weather',
      type: 'string',
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'body',
      title: 'Body Content (Legacy Markdown)',
      description: 'Used for imported posts. For new posts, use the Content field below.',
      type: 'markdown',
    }),
    defineField({
      name: 'content',
      title: 'Content (Rich Text)',
      description: 'Recommended for new posts. Supports rich formatting and embeds.',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H1', value: 'h1' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'Quote', value: 'blockquote' },
          ],
          lists: [{ title: 'Bullet', value: 'bullet' }, { title: 'Numbered', value: 'number' }],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
              { title: 'Code', value: 'code' },
            ],
            annotations: [
              {
                title: 'URL',
                name: 'link',
                type: 'object',
                fields: [
                  {
                    title: 'URL',
                    name: 'href',
                    type: 'url',
                  },
                ],
              },
            ],
          },
        },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative text',
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
            },
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      date: 'date',
      media: 'thumbnailImage',
    },
    prepare(selection) {
      const { title, date, media } = selection;
      const formattedDate = date ? new Date(date).toLocaleDateString('ja-JP') : '';
      return {
        title,
        subtitle: formattedDate,
        media,
      };
    },
  },
});
