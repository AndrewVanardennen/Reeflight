import babel from 'rollup-plugin-babel';

export default {
  entry: 'src/index.js',
  dest: 'dist/index.js',
  format: 'cjs', // common javascript
  plugins: [babel()], // run babel
	sourceMaps: true
};
