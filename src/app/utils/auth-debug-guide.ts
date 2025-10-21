/**
 * Guide de dépannage rapide pour l'erreur 401 "Token manquant"
 * 
 * Instructions d'utilisation :
 * 1. Ouvrir la console du navigateur (F12 → Console)
 * 2. Exécuter les fonctions ci-dessous pour diagnostiquer le problème
 */

export class AuthDebugGuide {
  /**
   * Vérifier l'état complet de l'authentification
   */
  static checkAuthState() {
    console.log('🔍 DIAGNOSTIC AUTHENTIFICATION');
    console.log('================================');
    
    // Vérifier le token
    const token = localStorage.getItem('token');
    const authToken = localStorage.getItem('authToken');
    
    console.log('📋 Tokens trouvés:', {
      token: token ? '✅ Présent' : '❌ Absent',
      authToken: authToken ? '✅ Présent' : '❌ Absent',
      tokenValue: token || authToken || 'Aucun'
    });
    
    // Vérifier les autres clés localStorage
    console.log('📦 Autres clés localStorage:', Object.keys(localStorage));
    
    // Vérifier la validité du token
    if (token || authToken) {
      this.checkTokenValidity(token || authToken);
    }
    
    console.log('================================');
  }
  
  /**
   * Vérifier la validité du token JWT
   */
  static checkTokenValidity(token: string) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('📋 Payload du token:', payload);
      
      // Vérifier l'expiration
      const currentTime = Math.floor(Date.now() / 1000);
      const isExpired = payload.exp && payload.exp < currentTime;
      
      console.log('⏰ Statut expiration:', isExpired ? '❌ Expiré' : '✅ Valide');
      
      if (isExpired) {
        console.warn('⚠️ Le token est expiré. Veuillez vous reconnecter.');
      }
      
      return !isExpired;
    } catch (error) {
      console.error('❌ Token invalide ou corrompu:', error);
      return false;
    }
  }
  
  /**
   * Tester la connexion API avec le token actuel
   */
  static async testApiConnection() {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      
      if (!token) {
        console.error('❌ Aucun token disponible pour le test');
        return;
      }
      
      const response = await fetch('https://yakalma.onrender.com/api/orders/delivered', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('🧪 Test API:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Erreur API:', errorData);
      }
      
    } catch (error) {
      console.error('❌ Erreur connexion:', error);
    }
  }
  
  /**
   * Réinitialiser l'authentification (à utiliser en dernier recours)
   */
  static resetAuth() {
    console.log('🔄 Réinitialisation de l\'authentification...');
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    console.log('✅ Authentification réinitialisée');
  }
}

// Instructions rapides :
// 1. Ouvrir la console (F12)
// 2. Coller ce code et exécuter :
// AuthDebugGuide.checkAuthState()
// AuthDebugGuide.testApiConnection()
