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
    quoteshelf: collection({
      label: 'Quoteshelf',
      path: 'src/data/ks-quoteshelf/*',
      columns: ['title', 'author'],
      slugField: 'title',
      format: 'yaml',
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        author: fields.text({ label: 'Author', validation: { isRequired: true } }),
        sortName: fields.text({ label: 'Sort Name' }),
        quotes: fields.array(
          fields.text({ 
            label: 'Quote', 
            validation: { isRequired: true },
            multiline: true,
          }),
          { 
            label: 'Quotes',
            itemLabel: props => props.value
          }
        ),
        cover: fields.image({
          label: 'Cover',
          directory: 'src/assets/images/ks-quoteshelf',
          publicPath: '@assets/images/ks-quoteshelf',
        })
      }
    }),
  },
});