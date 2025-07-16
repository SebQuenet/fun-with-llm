# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a TypeScript project called "fun-with-llm" set up for experimenting with Large Language Models. It uses Vitest for testing and Zod for schema validation.

## Commands

### Development
- `npm run build` - Compile TypeScript to JavaScript
- `npm run dev` - Watch mode compilation
- `npm run lint` - Type checking without emitting files

### Testing
- `npm test` - Run tests in watch mode
- `npm run test:run` - Run tests once
- `npm run test:watch` - Run tests in watch mode (explicit)

## Project Structure

- `src/` - Source TypeScript files
- `dist/` - Compiled JavaScript output (created after build)
- `src/index.ts` - Main entry point with example Zod schema
- `src/index.test.ts` - Test file using Vitest
- `tsconfig.json` - TypeScript configuration
- `vitest.config.ts` - Vitest test configuration

## Key Dependencies

- **TypeScript** - Type-safe JavaScript
- **Zod** - Schema validation library
- **Vitest** - Fast unit testing framework
- **@types/node** - Node.js type definitions

## Development Notes

- Project uses ES modules (`"type": "module"` in package.json)
- TypeScript is configured for modern ES2022 target
- Vitest is configured with globals enabled for simpler test syntax
- Example code demonstrates Zod schema validation patterns