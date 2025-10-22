# TODO: Update Service and Component URLs to Use Environment Variables

## Overview
Replace hardcoded backend URLs in Angular services and components with values from `environment.prod.ts` to make the frontend configurable for different environments.

## Files Updated ✅
- [x] `src/app/services/auth.service.ts`: Replaced `https://yakalma.onrender.com/api` with `environment.apiUrl + '/api'`
- [x] `src/app/services/partenaire.service.ts`: Replaced multiple hardcoded URLs with environment-based URLs
- [x] `src/app/services/livreurs.service.ts`: Replaced `https://yakalma.onrender.com/api/livreurs` with `environment.apiUrl + '/api/livreurs'`
- [x] `src/app/services/tracking.service.ts`: Replaced socket URL with `environment.socketServerUrl`
- [x] `src/app/services/auth-admin.service.ts`: Replaced `https://yakalma.onrender.com/api/admins` with `environment.apiUrl + '/api/admins'`
- [x] `src/app/services/admin-livreur.service.ts`: Replaced URLs with environment-based URLs
- [x] `src/app/services/orders.service.ts`: Replaced `https://yakalma.onrender.com/api/orders` with `environment.apiUrl + '/api/orders'`

## Components Updated ✅
- [x] `src/app/pages/restaurant/restaurant-dashboard/restaurant-dashboard.component.ts`: Replaced hardcoded URL with `environment.apiUrl`
- [x] `src/app/pages/restaurant/restaurant-menu-management/restaurant-menu-management.component.ts`: Replaced hardcoded URL with `environment.apiUrl`
- [x] `src/app/pages/header-restaurant/header-restaurant.component.ts`: Replaced hardcoded URL with `environment.apiUrl`
- [x] `src/app/pages/client/client-orders-history/client-orders-history.component.ts`: Replaced hardcoded URL with `environment.apiUrl`
- [x] `src/app/pages/client/header-client/header-client.component.ts`: Replaced hardcoded URL with `environment.apiUrl`
- [x] `src/app/pages/restaurant/restaurant-menu/restaurant-menu.component.ts`: Replaced hardcoded URL with `environment.apiUrl`

## Steps Completed ✅
1. Import environment in each service and component
2. Replace hardcoded URLs with environment variables
3. All services and components now use configurable URLs from environment.prod.ts

## Summary
All Angular services and components have been updated to use environment variables instead of hardcoded URLs. The frontend is now fully configurable for different environments (development, production, etc.) by simply changing the values in `environment.ts` or `environment.prod.ts`.
