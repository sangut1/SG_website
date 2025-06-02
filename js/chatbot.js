/**
 * Chatbot Integration for Santos Gutierrez Figueroa
 * WhatsApp and Telegram Integration
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotPopup = document.getElementById('chatbotPopup');
    const chatbotClose = document.getElementById('chatbotClose');
    
    // Toggle chatbot popup
    if (chatbotToggle) {
        chatbotToggle.addEventListener('click', function() {
            if (chatbotPopup.style.display === 'block') {
                chatbotPopup.style.display = 'none';
            } else {
                chatbotPopup.style.display = 'block';
                // Animation effect
                chatbotPopup.style.opacity = '0';
                setTimeout(() => {
                    chatbotPopup.style.opacity = '1';
                }, 50);
            }
        });
    }
    
    // Close chatbot popup
    if (chatbotClose) {
        chatbotClose.addEventListener('click', function() {
            chatbotPopup.style.opacity = '0';
            setTimeout(() => {
                chatbotPopup.style.display = 'none';
            }, 300);
        });
    }
    
    // WhatsApp direct link handler
    const whatsappOption = document.querySelector('.chatbot-option.whatsapp');
    if (whatsappOption) {
        whatsappOption.addEventListener('click', function(e) {
            // Track analytics if needed
            console.log('WhatsApp chat initiated');
            // Continue with default link behavior
        });
    }
    
    // Telegram direct link handler
    const telegramOption = document.querySelector('.chatbot-option.telegram');
    if (telegramOption) {
        telegramOption.addEventListener('click', function(e) {
            // Track analytics if needed
            console.log('Telegram chat initiated');
            // Continue with default link behavior
        });
    }
    
    // Add custom message options
    const chatbotBody = document.querySelector('.chatbot-body');
    if (chatbotBody) {
        // Common questions that can be added
        const commonQuestions = [
            { text: '¿Cómo puedo solicitar una consulta?', handler: handleConsultaQuestion },
            { text: '¿Cuáles son sus honorarios?', handler: handleHonorariosQuestion },
            { text: '¿En qué áreas está especializado?', handler: handleAreasQuestion }
        ];
        
        // Create quick reply buttons
        const quickReplies = document.createElement('div');
        quickReplies.className = 'chatbot-quick-replies';
        
        commonQuestions.forEach(question => {
            const button = document.createElement('button');
            button.className = 'chatbot-quick-reply';
            button.textContent = question.text;
            button.addEventListener('click', question.handler);
            quickReplies.appendChild(button);
        });
        
        chatbotBody.appendChild(quickReplies);
    }
    
    // Handle common questions
    function handleConsultaQuestion() {
        addBotMessage('Puede solicitar una consulta de varias formas: 1) Usando el formulario de contacto en esta web, 2) Concertando una cita a través de Calendly, o 3) Contactando directamente por WhatsApp o Telegram.');
    }
    
    function handleHonorariosQuestion() {
        addBotMessage('Los honorarios varían según el tipo de servicio y la complejidad del caso. Le invitamos a contactar directamente para recibir un presupuesto personalizado.');
    }
    
    function handleAreasQuestion() {
        addBotMessage('Estamos especializados en Derecho Digital, Blockchain, Criptomonedas, Protección de Datos, Derecho Procesal, Propiedad Industrial, Derecho Administrativo, Penal Patrimonial y Derecho Civil. Puede ver más detalles en la sección de Áreas de nuestra web.');
    }
    
    // Add bot message to chat
    function addBotMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chatbot-message';
        messageDiv.innerHTML = `<p>${text}</p>`;
        
        // Insert before options
        const options = document.querySelector('.chatbot-options');
        chatbotBody.insertBefore(messageDiv, options);
        
        // Scroll to bottom
        chatbotBody.scrollTop = chatbotBody.scrollHeight;
    }
    
    // Cookie consent handling
    const cookieConsent = document.getElementById('cookieConsent');
    const acceptCookiesBtn = document.getElementById('acceptCookies');
    
    // Check if user has already accepted cookies
    if (cookieConsent && !localStorage.getItem('cookiesAccepted')) {
        // Show cookie consent after a short delay
        setTimeout(() => {
            cookieConsent.style.display = 'block';
        }, 1000);
    }
    
    // Handle cookie acceptance
    if (acceptCookiesBtn) {
        acceptCookiesBtn.addEventListener('click', function() {
            localStorage.setItem('cookiesAccepted', 'true');
            cookieConsent.style.display = 'none';
        });
    }
    
    // Preloader handling
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', function() {
            setTimeout(() => {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 500);
            }, 500);
        });
    }
});
