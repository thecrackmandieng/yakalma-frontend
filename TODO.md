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

# TODO: Inclure l'ID de la table dans l'URL du QR code
## Étapes à suivre :
- [ ] Modifier `generateQRCodes` dans `restaurant-tables.component.ts` pour inclure `?table=${table.id}` dans l'URL.
- [ ] Mettre à jour `RestaurantMenuComponent` pour capturer `tableId` depuis `queryParams`.
- [ ] Mettre à jour `saveOrder` pour inclure `tableId` dans `orderPayload`.
- [ ] Tester la génération et le scan du QR.
- [ ] Vérifier que les commandes incluent l'ID de table.
