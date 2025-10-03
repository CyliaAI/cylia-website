# Five NITTs at Freddy's

Welcome to the Project of Five NITTs at Freddy's in TransfiNITTe '25

## Requirements

``` bash
- Node.js v22+
- pnpm v10+
```

## Setup

### 1. Fork the Repository and Clone it

### 2. Install Packages and Create .env

```bash
    cd frontend
    cp .env.example .env
    pnpm i
    pnpm dev
```

```bash
    cd backend
    cp .env.example .env
    pnpm i
    pnpm prisma:generate
    pnpm prisma:migrate
    pnpm dev
```
