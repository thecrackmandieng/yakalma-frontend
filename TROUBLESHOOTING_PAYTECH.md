# Résolution des problèmes d'authentification PayTech

## Problème
Erreur 401: "Erreur d'authentification PayTech. Vérifiez vos clés API et l'identifiant du vendeur."

## Causes possibles

### 1. Clés API invalides ou expirées
- Les clés API peuvent avoir été révoquées
- Les clés peuvent être expirées
- Mauvaise copie/collage des clés

### 2. Compte PayTech non activé
- Le compte marchand peut être en attente d'activation
- Des documents peuvent manquer pour l'activation

### 3. Environnement incorrect
- Utilisation de clés de test en production ou vice versa
- Mauvais URL d'API

## Étapes de résolution

### Étape 1: Vérifier les clés API
1. Connectez-vous à votre dashboard PayTech
2. Allez dans la section API/Developers
3. Vérifiez que les clés sont actives
4. Copiez à nouveau les clés et mettez à jour les fichiers d'environnement

### Étape 2: Contacter le support PayTech
Contactez le support PayTech avec les informations suivantes:
- Votre identifiant marchand
- Les clés API que vous utilisez
- Le message d'erreur exact
- L'URL de votre site

**Email support PayTech**: support@paytech.sn
**Téléphone**: +221 33 839 33 33

### Étape 3: Vérifier la configuration
Dans `src/environments/environment.ts` et `environment.prod.ts`:
```typescript
API_KEY: 'e19ac059b2019575877e88c8f9ead3fd568e5e47f9ef9083f383aafdce72c08b',
API_SECRET: 'f4eea5bf5cbf312b61ad6587dbe9952609da0b3ec28018a547a7e8bb8f2b3097',
paytechApiUrl: 'https://paytech.sn/api/payment/request-payment',
```

### Étape 4: Tester avec Postman
Utilisez Postman pour tester directement l'API PayTech:

**URL**: `POST https://paytech.sn/api/payment/request-payment`
**Headers**:
- `Content-Type: application/json`
- `api-key: votre_clé_api`
- `api-secret: votre_secret_api`

**Body**:
```json
{
  "item_name": "Test paiement",
  "item_price": 1000,
  "currency": "XOF",
  "ref_command": "CMD12345",
  "env": "test",
  "customerName": "Test Client",
  "customerEmail": "test@example.com",
  "success_url": "https://votresite.com/success",
  "cancel_url": "https://votresite.com/cancel",
  "ipn_url": "https://votresite.com/api/ipn"
}
```

## Configuration alternative temporaire

Si le problème persiste, vous pouvez configurer un mode de test sans authentification:

```typescript
// Dans payment.service.ts
initPayment(data: any) {
  // Mode test sans appel API réel
  if (environment.enableDebug) {
    console.log('Mode test PayTech - Redirection simulée');
    return of({
      success: 1,
      token: 'test_token_' + Date.now(),
      redirect_url: 'https://paytech.sn/payment/checkout/test',
      redirectUrl: 'https://paytech.sn/payment/checkout/test'
    });
  }
  // ... code existant
}
```

## URLs importantes
- **Dashboard PayTech**: https://paytech.sn/merchant/dashboard
- **Documentation API**: https://paytech.sn/api/doc
- **Support**: support@paytech.sn

## Statut des services PayTech
Vérifiez si PayTech a des interruptions de service sur:
- https://status.paytech.sn
- Leur page Facebook officielle
