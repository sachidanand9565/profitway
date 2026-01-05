# TODO: Standardize mysqlClient Imports to Use '@/' Alias

## Files to Update
- [ ] src/app/api/users/withdraw-request/route.js: Change '../../../../lib/mysqlClient' to '@/lib/mysqlClient'
- [ ] src/app/api/users/withdraw-history/route.js: Change '../../../../lib/mysqlClient' to '@/lib/mysqlClient'
- [ ] src/app/api/users/wallet/route.js: Change "../../../../lib/mysqlClient" to '@/lib/mysqlClient'
- [ ] src/app/api/users/update-profile/route.js: Change "../../../../lib/mysqlClient" to '@/lib/mysqlClient'
- [ ] src/app/api/users/change-password/route.js: Change "../../../../lib/mysqlClient" to '@/lib/mysqlClient'
- [ ] src/app/api/test-table/route.js: Change "../../../lib/mysqlClient" to '@/lib/mysqlClient'
- [ ] src/app/api/test-mysql/route.js: Change "../../../lib/mysqlClient" to '@/lib/mysqlClient'
- [ ] src/app/api/seed-packages/route.js: Change "../../../lib/mysqlClient" to '@/lib/mysqlClient'
- [ ] src/app/api/test-db/route.js: Change "../../../lib/mysqlClient" to '@/lib/mysqlClient'
- [ ] src/app/api/purchases/route.js: Change "../../../lib/mysqlClient" to '@/lib/mysqlClient'
- [ ] src/app/api/packages/route.js: Change "../../../lib/mysqlClient" to '@/lib/mysqlClient'
- [ ] src/app/api/packages/[id]/videos/route.js: Change "../../../../../lib/mysqlClient" to '@/lib/mysqlClient'
- [ ] src/app/api/packages/[id]/videos/[videoId]/route.js: Change "../../../../../../lib/mysqlClient" to '@/lib/mysqlClient'
- [ ] src/app/api/checkout/route.js: Change "../../../lib/mysqlClient" to '@/lib/mysqlClient'
- [ ] src/app/api/check-email/route.js: Change '../../../lib/mysqlClient' to '@/lib/mysqlClient'
- [ ] src/app/api/check-sponsor/route.js: Change '../../../lib/mysqlClient' to '@/lib/mysqlClient'
- [ ] src/app/api/admin/withdrawals/route.js: Change '../../../../lib/mysqlClient' to '@/lib/mysqlClient'
- [ ] src/app/api/auth/verify-otp/route.js: Change "../../../../lib/mysqlClient" to '@/lib/mysqlClient'
- [ ] src/app/api/auth/validate-reset-token/route.js: Change '../../../../lib/mysqlClient' to '@/lib/mysqlClient'
- [ ] src/app/api/auth/reset-password/route.js: Change '../../../../lib/mysqlClient' to '@/lib/mysqlClient'
- [ ] src/app/api/auth/login/route.js: Change "../../../../lib/mysqlClient" to '@/lib/mysqlClient'
- [ ] src/app/api/auth/forgot-password/route.js: Change "../../../../lib/mysqlClient" to '@/lib/mysqlClient'
- [ ] src/app/api/auth/admin-login/route.js: Change '../../../../lib/mysqlClient' to '@/lib/mysqlClient'

## Notes
- Files already using '@/lib/mysqlClient' do not need changes: src/app/api/users/route.js and src/app/api/users/referred-users/route.js
- Update imports for both 'query' and 'getConnection' where applicable.
