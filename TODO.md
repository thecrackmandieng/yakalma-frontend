# TODO: Add logs for account creation error during reservation

## Tasks
- [ ] Add detailed logs in `saveOrder` method in `restaurant-menu.component.ts` before calling `registerClient`
- [ ] Add logs in `registerClient` method in `partenaire.service.ts` for HTTP request and response/error
- [ ] Add try-catch around `saveOrder` method for additional error logging
- [ ] Test the logs by making an order with account creation enabled
