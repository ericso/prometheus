# Development Notes

[Previous sections remain unchanged...]

## Path Aliases and Module Resolution

The project uses TypeScript path aliases (defined in `tsconfig.json`) for cleaner imports:

```typescript
// Instead of relative imports like:
import { something } from '../../../config/something';

// We can use:
import { something } from '@config/something';
```

### Configuration by Tool

Different tools handle path aliases differently:

1. **TypeScript Compiler (`npm run build`)**
   - Uses `tsconfig.json` paths directly
   - No additional configuration needed
   - Automatically resolves aliases during compilation

2. **Jest Tests (`npm test`)**
   - Configured in `jest.config.ts`
   - Uses `ts-jest` and `pathsToModuleNameMapper` utility
   - Automatically converts TypeScript paths to Jest module mappings
   ```typescript
   moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths || {}, {
     prefix: '<rootDir>/src/',
   })
   ```

3. **Runtime Execution (`npm run dev`, `npm run migrate`)**
   - Requires `tsconfig-paths/register` for runtime resolution
   - Scripts must include `-r tsconfig-paths/register` flag
   ```json
   {
     "dev": "nodemon -r tsconfig-paths/register src/app.ts",
     "migrate": "ts-node -r tsconfig-paths/register src/db/migrate.ts"
   }
   ```

### Current Path Aliases

```json
{
  "@models/*": ["models/*"],
  "@utils/*": ["utils/*"],
  "@config/*": ["config/*"]
}
```

### Troubleshooting

If you encounter `MODULE_NOT_FOUND` errors:
1. For runtime scripts: Ensure `-r tsconfig-paths/register` is added to the command
2. For tests: Check `jest.config.ts` has correct path mappings
3. For build: Verify paths in `tsconfig.json` match your directory structure 