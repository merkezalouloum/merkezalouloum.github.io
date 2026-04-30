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
    if (isPrivacyPolicyPage()) return;

    const cookieResponse = localStorage.getItem('cookieConsent');
    if (cookieResponse) {
        const existingPopup = document.getElementById('persistent-popup');
        if (existingPopup) {
            existingPopup.style.display = 'none';
            document.body.classList.remove('popup-active');
        }
        return;
    }

    if (window.__cookiePopupTimeout) {
        clearTimeout(window.__cookiePopupTimeout);
    }

    let popup = document.getElementById('persistent-popup');
    if (!popup) {
        popup = document.createElement('div');
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

        document.getElementById('accept-cookies-btn').addEventListener('click', () => {
            setCookie('cookiesAccepted', 'true', 365);
            setCookie('cookiesRejected', 'false', 365);
            localStorage.setItem('cookieConsent', 'accepted');
            if (typeof loadGoogleAnalytics === 'function') {
                loadGoogleAnalytics();
            }
            closePopup();
        });

        document.getElementById('reject-cookies-btn').addEventListener('click', () => {
            setCookie('cookiesAccepted', 'false', 365);
            setCookie('cookiesRejected', 'true', 365);
            localStorage.setItem('cookieConsent', 'rejected');
            closePopup();
        });
    }

    window.__cookiePopupTimeout = setTimeout(() => {
        popup.style.display = 'flex';
        document.body.classList.add('popup-active');
    }, 500);
}

function closePopup() {
    const popup = document.getElementById('persistent-popup');
    if (popup) {
        popup.style.display = 'none';
    }
    document.body.classList.remove('popup-active');
}

// Fonction pour fermer la popup
function closePopup() {
    const popup = document.getElementById('persistent-popup');
    if (popup) {
        popup.style.display = 'none';
        document.body.style.overflow = '';
    }
}
