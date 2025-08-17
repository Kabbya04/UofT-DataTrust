import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // TypeScript rules - convert to warnings
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      
      // React rules - convert to warnings  
      "react/no-unescaped-entities": "warn",
      "jsx-a11y/alt-text": "warn",
      
      // Next.js rules
      "@next/next/no-img-element": "warn"
    }
  }
];

export default eslintConfig;