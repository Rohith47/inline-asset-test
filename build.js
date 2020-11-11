const fs = require('fs');
const path = require('path');
const posthtml = require('posthtml');
const posthtmlInlineAssets = require('posthtml-inline-assets');

const htmlBuffer = fs.readFileSync(path.join(__dirname, '/src/index.html'));

const html = htmlBuffer.toString();

posthtml([
  posthtmlInlineAssets({
    cwd: path.join(__dirname, '/src'),
    errors: 'throw',
    transforms: {
        script: {
            resolve(node) {
                return node.tag === 'script' && node.attrs && node.attrs.hasOwnProperty('inline') && node.attrs.src;
            }
        },
        image: {
            transform(node, data) {
                if (node.attrs.src.endsWith('.svg')) data.mime = 'image/svg+xml';
                node.attrs.src = `data:${data.mime};base64,${data.buffer.toString('base64')}`;
            }
        }
    }
  })
]).process(html /*, processOptions */)
.then((result) =>  console.log(result.html));