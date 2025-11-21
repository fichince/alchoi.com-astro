import { config, fields, collection } from '@keystatic/core';

export default config({
  storage: {
    kind: 'local',
  },
  collections: {
    blog: collection({
      label: 'Blog',
      slugField: 'title',
      path: 'src/data/ks-blog/*',
      columns: ['title', 'date', 'start', 'draft'],
      entryLayout: 'content',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        description: fields.text({ label: 'Description' }),
        content: fields.markdoc({ 
          label: 'Content',
          extension: 'md',
          options: {
            image: {
              directory: 'src/assets/images/ks-blog',
              publicPath: '@assets/images/ks-blog',
            }
          }
        }),
        date: fields.date({ label: 'Date', validation: { isRequired: true } }),
        start: fields.date({ label: 'Start Date' }),
        image: fields.image({ 
          label: 'Image',
          directory: 'src/assets/images/ks-blog',
          publicPath: '@assets/images/ks-blog',
        }),
        tags: fields.array(
          fields.text({ label: 'Tag' }),
          { 
            label: 'Tags',
            itemLabel: props => props.value
          }
        ),
        author: fields.text({ label: 'Author' }),
        rating: fields.number({ 
          label: 'Rating', 
          validation: { min: 1, max: 5 },
          step: 0.5,
        }),
        draft: fields.checkbox({ label: 'Draft' }),
      },
    }),
  },
});