Google doc with important info: https://docs.google.com/document/d/1M-xBujeangKtHIK9dtPN6sxXpqRMv935K1UDBh33Ohw/

# How to run locally:
1. npm install
2. npm run dev

# How to update db schemas:
## Option A: make changes in sqlite and push to prisma
1. Alter/add tables in sqlite using your favorite method (e.g. sqliteStudio)
2. run npx prisma db pull to pull these changes to schemas.prisma
3. npx prisma generate

## Option B: make changes in schema.prisma then push to sqlite
1. make schema changes to schema.prisma
2. npx prisma push (or npx prisma migrate dev if we need to version the schema changes)
3. npx prisma generate
4. quite and rerun npm run dev