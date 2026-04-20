# Clinic Appointment System UI

Vue 3 + Vite UI project for a clinic appointment system. This repository contains:

- Route-level screens in `src/views`
- A shared app shell in `src/layouts`
- Reusable UI primitives in `src/components/ui`
- Shared composables, types, and utilities

Original design source:
https://www.figma.com/design/6SZZdAgXXTjtqoWVosX50D/Clinic-Appointment-System-UI

## Stack

- `vue` 3
- `vite`
- `typescript`
- `vue-router`
- `tailwindcss` v4
- `shadcn-vue` style component structure
- `reka-ui` / `radix-vue`
- `lucide-vue-next`

## Project Structure

```text
src/
  App.vue
  main.ts
  router/
  layouts/
  views/
    auth/
    patient/
    doctor/
    receptionist/
    admin/
  components/
    common/
    ui/
  composables/
  lib/
  styles/
  types/
```

## Requirements

- Node.js 18+ recommended
- `pnpm` recommended

## Local Development

Install dependencies:

```bash
pnpm install
```

Start the dev server:

```bash
pnpm dev
```

Run type checking:

```bash
pnpm typecheck
```

Create a production build:

```bash
pnpm build
```

## Installed Packages

### Runtime dependencies

- `vue`
- `vue-router`
- `@vueuse/core`
- `@internationalized/date`
- `lucide-vue-next`
- `class-variance-authority`
- `clsx`
- `tailwind-merge`
- `date-fns`
- `zod`
- `vee-validate`
- `@vee-validate/zod`

### UI and component packages

- `reka-ui`
- `radix-vue`
- `cmdk-vue`
- `embla-carousel-vue`
- `vaul-vue`
- `vue-input-otp`
- `vue-sonner`
- `@tanstack/vue-table`

### Build and tooling

- `vite`
- `@vitejs/plugin-vue`
- `typescript`
- `vue-tsc`
- `tailwindcss`
- `@tailwindcss/vite`
- `tw-animate-css`

## Styling and Aliases

This project uses:

- Tailwind entry file: [src/styles/tailwind.css](/Volumes/DataSSD/projects/clinicappointmentsystemui/src/styles/tailwind.css:1)
- Global style entry: [src/styles/index.css](/Volumes/DataSSD/projects/clinicappointmentsystemui/src/styles/index.css:1)
- Alias config in [vite.config.ts](/Volumes/DataSSD/projects/clinicappointmentsystemui/vite.config.ts:1)
- shadcn-vue style aliases in [components.json](/Volumes/DataSSD/projects/clinicappointmentsystemui/components.json:1)

Important aliases:

- `@/components`
- `@/components/ui`
- `@/composables`
- `@/lib`
- `@/types`

## How To Use This Repo

### Run the existing app

Use the routes already configured in [src/router/index.ts](/Volumes/DataSSD/projects/clinicappointmentsystemui/src/router/index.ts:1). The app includes:

- Auth screens
- Patient dashboard, booking, records
- Doctor dashboard and EMR form
- Receptionist queue and schedules
- Admin dashboard and user management

### Use it as a UI source for another project

This repository is structured so you can copy either:

- complete route screens from `src/views`
- reusable UI primitives from `src/components/ui`
- shared logic from `src/composables`, `src/types`, and `src/lib`

## Extracting Reusable UI Components

If you want only the reusable UI layer in another Vue 3 project, copy:

- `src/components/ui`
- `src/lib/utils.ts`
- `src/styles/tailwind.css`
- `src/styles/theme.css`
- `src/styles/fonts.css`
- `src/styles/index.css`
- `components.json` if you want to preserve the same alias conventions

Install the packages required by those components:

```bash
pnpm add vue @vueuse/core @internationalized/date lucide-vue-next class-variance-authority clsx tailwind-merge reka-ui radix-vue cmdk-vue embla-carousel-vue vaul-vue vue-input-otp vue-sonner @tanstack/vue-table date-fns zod vee-validate @vee-validate/zod
pnpm add -D vite @vitejs/plugin-vue typescript vue-tsc tailwindcss @tailwindcss/vite tw-animate-css
```

Your target project should also have:

- Vue 3
- Vite
- Tailwind CSS v4
- `@` alias mapped to `src`

## Extracting Pages or Features

If you want to move a complete page into another project, copy:

1. The page from `src/views/...`
2. Any layout it depends on from `src/layouts`
3. The shared UI primitives it imports from `src/components/ui`
4. Supporting types from `src/types`
5. Supporting composables from `src/composables`
6. Supporting helpers from `src/lib`

Typical examples:

- Auth pages depend on `useAuth`, shared UI primitives, and router
- Dashboard pages depend on `src/types` and multiple UI primitives
- Booking and scheduling pages also depend on `@internationalized/date`

## Fast Extraction Checklist

For another Vue project, make sure these are in place before copying files:

1. Add the `@` alias to `src`
2. Add Vue plugin config in Vite
3. Add Tailwind CSS v4 setup
4. Copy `src/components/ui`
5. Copy `src/lib/utils.ts`
6. Copy needed files from `src/views`, `src/layouts`, `src/composables`, and `src/types`
7. Install the matching runtime packages
8. Fix imports only if your target folder structure differs

## Minimal Target Project Config

At minimum, the target project should support:

- `.vue` single-file components
- TypeScript
- alias imports like `@/components/ui/button`
- Tailwind utility classes

If your target project does not use the same folder structure, the easiest approach is:

- keep `src/components/ui`
- keep `src/lib/utils.ts`
- keep `src/composables`
- keep `src/types`

That lets most copied files work with little or no import rewriting.

## Notes

- `src/components/ui` is the reusable shared UI layer
- `src/views` contains route-level application screens
- `src/layouts` contains application shell components
- The current auth flow is demo-oriented and stores user state in `localStorage`

## Recommended Reuse Strategy

If your goal is to reuse pieces in another project:

- Reuse `src/components/ui` for generic building blocks
- Reuse `src/views/...` only when you want a mostly complete screen
- Reuse `src/composables/useAuth.ts` only if the target project can accept the same auth assumptions, otherwise adapt it first

## Verification

This repository should pass:

```bash
pnpm typecheck
pnpm build
```
