// Vérifier si on est sur la page politique de confidentialité
function isPrivacyPolicyPage() {
    return window.location.pathname.includes('politique_confidentialite');
}

// Fonctions de gestion des cookies
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

// Fonction pour afficher/masquer la pop-up fullscreen avec cookies intégrés
function managePopup() {
    // Ne pas afficher sur la page politique de confidentialité
    if (isPrivacyPolicyPage()) return;
    
    // Vérifier si la réponse a été reçue et l'acceptation des cookies
    const responseReceived = localStorage.getItem('popupResponseReceived') === 'true';
    const cookiesAccepted = getCookie('cookiesAccepted') === 'true';
    const cookiesRejected = getCookie('cookiesRejected') === 'true';
    
    if (!responseReceived || (!cookiesAccepted && !cookiesRejected)) {
        // Créer la pop-up si elle n'existe pas
        if (!document.getElementById('persistent-popup')) {
            const popup = document.createElement('div');
            popup.id = 'persistent-popup';
            popup.innerHTML = `
                <div class="popup-content">
                    <h3>Message important</h3>
                    <p>Veuillez répondre à notre question pour continuer.</p>
                    
                    <div class="cookie-consent">
                        <p>Nous utilisons des cookies pour améliorer votre expérience.</p>
                        <div class="cookie-buttons">
                            <button id="accept-cookies-btn">Accepter les cookies</button>
                            <button id="reject-cookies-btn">Refuser les cookies</button>
                        </div>
                        <a href="politique_confidentialite.html#cookies">En savoir plus</a>
                    </div>
                </div>
            `;
            document.body.appendChild(popup);
            document.body.style.overflow = 'hidden';

            // Gérer les boutons cookies
            document.getElementById('accept-cookies-btn').addEventListener('click', () => {
                setCookie('cookiesAccepted', 'true', 365);
                setCookie('cookiesRejected', 'false', 365);
                // Charger Google Analytics si nécessaire
                if (typeof loadGoogleAnalytics === 'function') {
                    loadGoogleAnalytics();
                }
                // Fermer la popup
                closePopup();
            });
            
            document.getElementById('reject-cookies-btn').addEventListener('click', () => {
                setCookie('cookiesAccepted', 'false', 365);
                setCookie('cookiesRejected', 'true', 365);
                // Fermer la popup
                closePopup();
            });
        }
        
        // Afficher la pop-up immédiatement
        document.getElementById('persistent-popup').style.display = 'flex';
    } else {
        // Masquer la pop-up si la réponse a été reçue
        const popup = document.getElementById('persistent-popup');
        if (popup) {
            popup.style.display = 'none';
            document.body.classList.remove('popup-active');
        }
    }
}

// Fonction pour fermer la popup et rétablir le scroll
function closePopup() {
    const popup = document.getElementById('persistent-popup');
    if (popup) {
        popup.style.display = 'none';
        document.body.style.overflow = '';
    }
}

// Fonction pour marquer la réponse comme reçue (à appeler quand la réponse est soumise)
function setResponseReceived() {
    localStorage.setItem('popupResponseReceived', 'true');
    managePopup(); // Mettre à jour l'affichage
}

// Initialiser la pop-up quand le DOM est chargé
document.addEventListener('DOMContentLoaded', managePopup);

// Exposer la fonction pour pouvoir l'appeler depuis d'autres scripts
window.setResponseReceived = setResponseReceived;
