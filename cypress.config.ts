import { defineConfig } from "cypress";
import fs from 'fs';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4321',
    setupNodeEvents(on, config) {
      on('task', {
        getHKJapanPages() {
          return new Promise((resolve, reject) => {
            fs.readdir('src/content/hkjapan', (err, files) => {
              if (err) {
                return reject(err);
              }

              const result = 
                files
                  .filter(f => f.endsWith('.md'))
                  .map(f => f.substring(0, f.length - 3));

              console.log('reading files', result);

              resolve(result);
            });
          })
        }
      });
    },
  },
});
