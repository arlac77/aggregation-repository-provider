import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import pkg from './package.json';

export default {
  input: pkg.module,
  output: {
    file: pkg.main,
    format: 'cjs',
    interop: false
  },
  plugins: [resolve(), commonjs()],
  external: ['repository-provider']
};
