import js from '@eslint/js';
import prettier from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  {
    rules: {
      // Suas regras customizadas aqui (opcional)
    }
  },
  prettier,
];
