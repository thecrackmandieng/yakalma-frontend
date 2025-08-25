# Corrections pour l'intégration PayTech

## Problèmes identifiés:
1. Casse incorrecte des headers API (API-KEY/API-SECRET au lieu de api-key/api-secret) ✅ CORRIGÉ
2. Configurations PayTech manquantes dans environment.prod.ts ✅ CORRIGÉ

## Étapes à compléter:
- [x] Corriger la casse des headers dans payment.service.ts
- [x] Ajouter les configurations PayTech dans environment.prod.ts
- [ ] Tester la requête après les corrections

## Fichiers modifiés:
- src/app/services/payment.service.ts - Headers corrigés (api-key/api-secret)
- src/environments/environment.prod.ts - Configurations PayTech ajoutées

## Prochaines étapes:
1. Déployer les modifications
2. Tester la requête POST vers https://paytech.sn/api/payment/request-payment
3. Vérifier que l'erreur 401 est résolue
