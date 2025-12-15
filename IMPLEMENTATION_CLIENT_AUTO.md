# Implémentation de la création automatique de compte client

## Résumé des modifications

Cette implémentation permet de créer automatiquement un compte client lors de l'acceptation d'une commande par le restaurant, et d'envoyer le mot de passe par défaut par email.

## Modifications apportées

### 1. Interface Order (partenaire.service.ts)
- Ajout du champ `email: string` à l'interface Order pour stocker l'email du client

### 2. Service PartenaireService (partenaire.service.ts)
- Import des opérateurs RxJS nécessaires : `switchMap`, `catchError`
- Modification de la méthode `acceptOrderRestaurant` :
  - Vérifie si la commande a déjà un `clientId`
  - Si pas de clientId et que les données sont suffisantes, crée automatiquement un compte client
  - Utilise `registerClient` avec les données de la commande
  - Met à jour la commande avec le nouveau `clientId`
  - Gère les erreurs gracieusement

### 3. Composant Header (header.component.ts/html)
- Ajout du champ `email` à l'objet `payment`
- Ajout du champ email dans le formulaire de paiement HTML
- Mise à jour de la validation pour inclure l'email
- Mise à jour de la création de commande pour inclure l'email

### 4. Composant Restaurant Menu (restaurant-menu.component.ts)
- Mise à jour de la création de commande pour inclure l'email

### 5. Template de gestion des commandes (restaurant-menu-management.component.html)
- Affichage de l'email du client dans les détails
- Indication visuelle du statut du compte client (créé automatiquement ou non)

## Fonctionnement

1. **Création de commande** : L'email du client est maintenant collecté et stocké avec la commande
2. **Acceptation de commande** : Quand le restaurant accepte une commande (`acceptOrder`)
3. **Vérification** : Le système vérifie si un `clientId` existe déjà
4. **Création automatique** : Si pas de client et données suffisantes, création automatique via `registerClient`
5. **Envoi email** : Le backend envoie le mot de passe par défaut à l'email du client
6. **Mise à jour** : La commande est marquée avec le nouveau `clientId`

## Avantages

- **Expérience utilisateur améliorée** : Les clients recoivent automatiquement leurs identifiants
- **Pas de perte de données** : Les commandes sans compte client sont automatiquement converties
- **Traçabilité** : Visualisation claire du statut du compte client dans l'interface
- **Robustesse** : Gestion d'erreurs pour ne pas bloquer le processus principal

## Notes techniques

- La méthode utilise les observables RxJS pour chaîner les opérations
- En cas d'échec de création de compte, la commande continue normalement sans clientId
- L'email est maintenant un champ obligatoire pour toutes les nouvelles commandes
- Le backend doit gérer l'envoi du mot de passe par défaut par email
