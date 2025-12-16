# TODO: Add logs for account creation error during reservation

## Tasks
- [x] Add detailed logs in `saveOrder` method in `restaurant-menu.component.ts` before calling `registerClient`
- [x] Add logs in `registerClient` method in `partenaire.service.ts` for HTTP request and response/error
- [x] Add try-catch around `saveOrder` method for additional error logging
- [x] Test the logs by making an order with account creation enabled - API backend confirmed working
