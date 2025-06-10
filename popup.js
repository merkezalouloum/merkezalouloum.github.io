function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function loadGoogleAnalytics() {
    // Script Google Analytics
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX'); // À remplacer par votre ID Google Analytics
    
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX';
    document.head.appendChild(script);
}

function isPrivacyPolicyPage() {
    return window.location.pathname.includes('politique_confidentialite.html') ||
           window.location.pathname.includes('cgu.html');
}

function managePopup() {
    // Ne pas afficher sur la page politique de confidentialité
    if (isPrivacyPolicyPage()) return;

    // Vérifier si la réponse a été reçue
    const cookieResponse = localStorage.getItem('cookieConsent');
    console.log('Cookie consent status:', cookieResponse);
    if (cookieResponse) return; // Ne pas afficher si réponse déjà donnée

    if (!cookieResponse) {
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
                console.log('Accept cookies clicked');
                setCookie('cookiesAccepted', 'true', 365);
                setCookie('cookiesRejected', 'false', 365);
                localStorage.setItem('cookieConsent', 'accepted');
                if (typeof loadGoogleAnalytics === 'function') {
                    loadGoogleAnalytics();
                }
                closePopup();
                console.log('Cookies accepted and popup closed');
            });

            document.getElementById('reject-cookies-btn').addEventListener('click', () => {
                console.log('Reject cookies clicked');
                setCookie('cookiesAccepted', 'false', 365);
                setCookie('cookiesRejected', 'true', 365);
                localStorage.setItem('cookieConsent', 'rejected');
                closePopup();
                console.log('Cookies rejected and popup closed');
            });
        }

        // Afficher la pop-up après un léger délai
        setTimeout(() => {
            document.getElementById('persistent-popup').style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }, 1000);
    } else {
        // Masquer la pop-up si la réponse a été reçue
        const popup = document.getElementById('persistent-popup');
        if (popup) {
            popup.style.display = 'none';
            document.body.style.overflow = '';
        }
    }
}

// Fonction pour fermer la popup
function closePopup() {
    const popup = document.getElementById('persistent-popup');
    if (popup) {
        popup.style.display = 'none';
        document.body.style.overflow = '';
    }
}
