// React Native Testing Library v12.4+ includes matchers by default
// No need to import extend-expect separately

// Mock Expo to prevent winter runtime issues in tests
jest.mock('expo', () => ({
  ...jest.requireActual('expo'),
}));

// Fix Expo winter runtime globals issue
if (typeof global.TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

// Mock missing Web Streams API for tests
global.TextEncoderStream = class TextEncoderStream {};
global.TextDecoderStream = class TextDecoderStream {};
global.ReadableStream = global.ReadableStream || class ReadableStream {};
global.WritableStream = global.WritableStream || class WritableStream {};
global.TransformStream = global.TransformStream || class TransformStream {};
global.structuredClone = global.structuredClone || (val => JSON.parse(JSON.stringify(val)));

// Mock Firebase for tests
jest.mock('./src/config/firebase', () => ({
  auth: {
    currentUser: null,
  },
  db: {},
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock Expo modules
jest.mock('expo-auth-session', () => ({
  makeRedirectUri: jest.fn(),
  useIdTokenAuthRequest: jest.fn(() => [null, null, jest.fn()]),
}));

jest.mock('expo-web-browser', () => ({
  maybeCompleteAuthSession: jest.fn(),
}));

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => ({
  ...jest.requireActual('react-native-reanimated/mock'),
  useSharedValue: jest.fn(() => ({ value: 0 })),
  useAnimatedStyle: jest.fn(() => ({})),
  withTiming: jest.fn(value => value),
  withSpring: jest.fn(value => value),
}));

// Suppress console warnings in tests (optional)
global.console = {
  ...console,
  // Uncomment to suppress warnings
  // warn: jest.fn(),
  // error: jest.fn(),
};
