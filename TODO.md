# TODO: Fix 401 Unauthorized Error for /api/orders/delivered

## Issue
- 401 Unauthorized error when calling /api/orders/delivered endpoint
- Inconsistency between auth interceptor (checks multiple token keys) and services (only check 'token')

## Tasks
- [x] Update OrdersService.getAuthHeaders() to check multiple token keys ('token', 'authToken', 'accessToken', 'jwt')
- [x] Update PartenaireService.getAuthHeaders() similarly for consistency
- [x] Add better error handling for token issues
- [x] Test the fix by running the app and checking if 401 error is resolved

## Files to Edit
- src/app/services/orders.service.ts
- src/app/services/partenaire.service.ts

## Followup Steps
- Test the application to ensure 401 error is fixed
- If issues persist, check token validity and expiration
