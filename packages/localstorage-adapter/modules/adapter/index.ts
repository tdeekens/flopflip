const version = process.env.npm_package_version;

export { version };
export { default, updateFlags, STORAGE_SLICE } from './adapter';
