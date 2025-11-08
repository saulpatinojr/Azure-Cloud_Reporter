import '@testing-library/jest-dom';
import 'jest-axe/extend-expect';
// Polyfills for jsdom environment
import { TextEncoder, TextDecoder } from 'util';
// @ts-ignore
global.TextEncoder = TextEncoder;
// @ts-ignore
global.TextDecoder = TextDecoder as any;
