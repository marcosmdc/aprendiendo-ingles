// Frases habituales por lugar, con traduccion y un dialogo de ejemplo.

export type Phrase = { en: string; es: string; who?: string };
export type PhraseGroup = { title: string; phrases: Phrase[] };
export type Place = { id: string; label: string; groups: PhraseGroup[]; dialogue: Phrase[] };

export const places: Place[] = [
  {
    id: "restaurant",
    label: "Restaurante",
    groups: [
      {
        title: "Al llegar",
        phrases: [
          { en: "Hi, do you have a table for two?", es: "Hola, ¿tienen una mesa para dos?" },
          { en: "We have a reservation under Martinez.", es: "Tenemos una reserva a nombre de Martínez." },
          { en: "Could we sit by the window?", es: "¿Podemos sentarnos junto a la ventana?" }
        ]
      },
      {
        title: "Para pedir",
        phrases: [
          { en: "Can I see the menu, please?", es: "¿Me trae la carta, por favor?" },
          { en: "What do you recommend?", es: "¿Qué me recomienda?" },
          { en: "I'd like the chicken with salad.", es: "Quisiera el pollo con ensalada." },
          { en: "Could I get a glass of water?", es: "¿Me trae un vaso de agua?" },
          { en: "I'm allergic to nuts.", es: "Soy alérgico a los frutos secos." }
        ]
      },
      {
        title: "Lo que te puede decir el mozo",
        phrases: [
          { en: "Are you ready to order?", es: "¿Ya saben qué van a pedir?", who: "Mozo" },
          { en: "How would you like your steak?", es: "¿Cómo quiere la carne?", who: "Mozo" },
          { en: "Can I get you anything else?", es: "¿Les traigo algo más?", who: "Mozo" }
        ]
      },
      {
        title: "Para pagar",
        phrases: [
          { en: "Could we have the check, please?", es: "¿Nos trae la cuenta, por favor?" },
          { en: "Can I pay by card?", es: "¿Puedo pagar con tarjeta?" },
          { en: "Keep the change.", es: "Quédese con el vuelto." },
          { en: "Everything was delicious.", es: "Estaba todo riquísimo." }
        ]
      }
    ],
    dialogue: [
      { who: "Mozo", en: "Good evening! Table for two?", es: "¡Buenas noches! ¿Mesa para dos?" },
      { who: "Vos", en: "Yes, please.", es: "Sí, por favor." },
      { who: "Mozo", en: "Here's the menu. Can I get you something to drink?", es: "Acá tienen la carta. ¿Les traigo algo para tomar?" },
      { who: "Vos", en: "A lemonade for me, please.", es: "Para mí una limonada, por favor." },
      { who: "Mozo", en: "Are you ready to order?", es: "¿Ya saben qué van a pedir?" },
      { who: "Vos", en: "Yes, I'll have the pasta.", es: "Sí, voy a pedir la pasta." },
      { who: "Mozo", en: "Great choice. Anything else?", es: "Muy buena elección. ¿Algo más?" },
      { who: "Vos", en: "No, that's all, thanks.", es: "No, nada más, gracias." }
    ]
  },
  {
    id: "cinema",
    label: "Cine",
    groups: [
      {
        title: "Entradas",
        phrases: [
          { en: "Two tickets for the seven o'clock show, please.", es: "Dos entradas para la función de las siete, por favor." },
          { en: "Is it in English with subtitles?", es: "¿Es en inglés con subtítulos?" },
          { en: "Are there any seats left?", es: "¿Quedan asientos?" },
          { en: "Can we sit together?", es: "¿Podemos sentarnos juntos?" },
          { en: "How long is the movie?", es: "¿Cuánto dura la película?" }
        ]
      },
      {
        title: "En el candy",
        phrases: [
          { en: "A large popcorn and two sodas, please.", es: "Un pochoclo grande y dos gaseosas, por favor." },
          { en: "Salted or sweet?", es: "¿Salado o dulce?", who: "Empleado" },
          { en: "Do you want to make it a combo?", es: "¿Querés que sea un combo?", who: "Empleado" }
        ]
      },
      {
        title: "En la sala",
        phrases: [
          { en: "Excuse me, I think you're in my seat.", es: "Disculpe, creo que está en mi asiento." },
          { en: "Could you please be quiet?", es: "¿Podría hacer silencio, por favor?" },
          { en: "Can you see the screen?", es: "¿Ves bien la pantalla?" }
        ]
      },
      {
        title: "Para charlar de la película",
        phrases: [
          { en: "What do you want to watch?", es: "¿Qué querés ver?" },
          { en: "I've heard it's really good.", es: "Escuché que está muy buena." },
          { en: "What did you think of the movie?", es: "¿Qué te pareció la película?" },
          { en: "I loved it! The ending was amazing.", es: "¡Me encantó! El final fue increíble." },
          { en: "It was a bit boring.", es: "Fue un poco aburrida." }
        ]
      }
    ],
    dialogue: [
      { who: "Vos", en: "Hi, two tickets for The Last Journey, please.", es: "Hola, dos entradas para The Last Journey, por favor." },
      { who: "Cajero", en: "Sure. The seven thirty or the nine forty-five show?", es: "Claro. ¿La función de las siete y media o la de las diez menos cuarto?" },
      { who: "Vos", en: "The seven thirty, please.", es: "La de las siete y media, por favor." },
      { who: "Cajero", en: "Where would you like to sit?", es: "¿Dónde les gustaría sentarse?" },
      { who: "Vos", en: "In the middle, if possible.", es: "En el medio, si se puede." },
      { who: "Cajero", en: "That's twenty-four dollars. Enjoy the movie!", es: "Son veinticuatro dólares. ¡Que disfruten la película!" }
    ]
  },
  {
    id: "office",
    label: "Oficina",
    groups: [
      {
        title: "Saludar y presentarse",
        phrases: [
          { en: "Good morning! How was your weekend?", es: "¡Buen día! ¿Qué tal tu fin de semana?" },
          { en: "Hi, I'm Alex. I just joined the team.", es: "Hola, soy Alex. Me acabo de sumar al equipo." },
          { en: "Nice to meet you.", es: "Encantado de conocerte." }
        ]
      },
      {
        title: "En una reunión",
        phrases: [
          { en: "Can we schedule a meeting for tomorrow?", es: "¿Podemos agendar una reunión para mañana?" },
          { en: "Sorry, I'm running a bit late.", es: "Perdón, estoy llegando un poco tarde." },
          { en: "Could you repeat that, please?", es: "¿Podrías repetir eso, por favor?" },
          { en: "I agree with you.", es: "Estoy de acuerdo con vos." },
          { en: "Let's move on to the next point.", es: "Pasemos al siguiente punto." }
        ]
      },
      {
        title: "Día a día",
        phrases: [
          { en: "Do you have a minute?", es: "¿Tenés un minuto?" },
          { en: "Can you help me with this?", es: "¿Me podés ayudar con esto?" },
          { en: "I'm working on it.", es: "Estoy trabajando en eso." },
          { en: "I'll send you the report by Friday.", es: "Te mando el informe antes del viernes." },
          { en: "I'm out of the office tomorrow.", es: "Mañana no estoy en la oficina." },
          { en: "Thanks for your help! See you tomorrow.", es: "¡Gracias por tu ayuda! Hasta mañana." }
        ]
      }
    ],
    dialogue: [
      { who: "Compañero", en: "Hey, do you have a minute?", es: "Che, ¿tenés un minuto?" },
      { who: "Vos", en: "Sure, what's up?", es: "Claro, ¿qué pasa?" },
      { who: "Compañero", en: "Can you check the presentation before the meeting?", es: "¿Podés revisar la presentación antes de la reunión?" },
      { who: "Vos", en: "No problem. When is the meeting?", es: "No hay problema. ¿Cuándo es la reunión?" },
      { who: "Compañero", en: "At three o'clock.", es: "A las tres." },
      { who: "Vos", en: "OK, I'll send you my comments before lunch.", es: "Dale, te mando mis comentarios antes del almuerzo." },
      { who: "Compañero", en: "Thanks a lot!", es: "¡Muchas gracias!" }
    ]
  },
  {
    id: "airport",
    label: "Aeropuerto",
    groups: [
      {
        title: "Check-in",
        phrases: [
          { en: "I'd like to check in for my flight to Miami.", es: "Quisiera hacer el check-in para mi vuelo a Miami." },
          { en: "Can I have a window seat, please?", es: "¿Me puede dar un asiento junto a la ventanilla, por favor?" },
          { en: "How many bags can I check?", es: "¿Cuántas valijas puedo despachar?" },
          { en: "Is this bag OK as carry-on?", es: "¿Puedo llevar este bolso como equipaje de mano?" },
          { en: "Can I see your passport, please?", es: "¿Me muestra su pasaporte, por favor?", who: "Empleado" }
        ]
      },
      {
        title: "Seguridad y migraciones",
        phrases: [
          { en: "Please take out your laptop and liquids.", es: "Por favor, saque la computadora y los líquidos.", who: "Seguridad" },
          { en: "What's the purpose of your visit?", es: "¿Cuál es el motivo de su viaje?", who: "Migraciones" },
          { en: "I'm here on vacation for two weeks.", es: "Vengo de vacaciones por dos semanas." },
          { en: "I'm staying at a hotel downtown.", es: "Me voy a alojar en un hotel del centro." },
          { en: "Do you have anything to declare?", es: "¿Tiene algo para declarar?", who: "Aduana" }
        ]
      },
      {
        title: "En la terminal",
        phrases: [
          { en: "Where is gate twelve?", es: "¿Dónde está la puerta doce?" },
          { en: "Is the flight on time?", es: "¿El vuelo está en horario?" },
          { en: "My flight was delayed.", es: "Mi vuelo se atrasó." },
          { en: "I missed my connection. What should I do?", es: "Perdí mi conexión. ¿Qué tengo que hacer?" },
          { en: "Where can I pick up my luggage?", es: "¿Dónde retiro mi equipaje?" },
          { en: "My suitcase didn't arrive.", es: "Mi valija no llegó." }
        ]
      }
    ],
    dialogue: [
      { who: "Empleado", en: "Good morning. Where are you flying today?", es: "Buen día. ¿A dónde viaja hoy?" },
      { who: "Vos", en: "To New York. Here's my passport.", es: "A Nueva York. Acá tiene mi pasaporte." },
      { who: "Empleado", en: "Thank you. Are you checking any bags?", es: "Gracias. ¿Va a despachar alguna valija?" },
      { who: "Vos", en: "Yes, just this one.", es: "Sí, solo esta." },
      { who: "Empleado", en: "Would you prefer a window or an aisle seat?", es: "¿Prefiere ventanilla o pasillo?" },
      { who: "Vos", en: "A window seat, please.", es: "Ventanilla, por favor." },
      { who: "Empleado", en: "Here's your boarding pass. Boarding starts at ten at gate twelve.", es: "Acá tiene su tarjeta de embarque. El embarque empieza a las diez en la puerta doce." },
      { who: "Vos", en: "Great, thank you!", es: "¡Perfecto, gracias!" }
    ]
  },
  {
    id: "hotel",
    label: "Hotel",
    groups: [
      {
        title: "Al llegar",
        phrases: [
          { en: "Hi, I have a reservation under Martinez.", es: "Hola, tengo una reserva a nombre de Martínez." },
          { en: "Do you have any rooms available tonight?", es: "¿Tienen habitaciones disponibles para esta noche?" },
          { en: "What time is check-out?", es: "¿A qué hora es el check-out?" },
          { en: "Is breakfast included?", es: "¿El desayuno está incluido?" },
          { en: "Can I leave my bags here until check-in?", es: "¿Puedo dejar mis valijas acá hasta el check-in?" }
        ]
      },
      {
        title: "Durante la estadía",
        phrases: [
          { en: "What's the Wi-Fi password?", es: "¿Cuál es la contraseña del wifi?" },
          { en: "The air conditioning doesn't work.", es: "El aire acondicionado no funciona." },
          { en: "Could I get some extra towels, please?", es: "¿Me podrían dar más toallas, por favor?" },
          { en: "I locked myself out of my room.", es: "Me quedé afuera de la habitación." },
          { en: "Could you recommend a good place to eat nearby?", es: "¿Me recomienda un buen lugar para comer cerca?" },
          { en: "Can you call a taxi for me?", es: "¿Me puede pedir un taxi?" }
        ]
      },
      {
        title: "Al irse",
        phrases: [
          { en: "I'd like to check out, please.", es: "Quisiera hacer el check-out, por favor." },
          { en: "Can I pay by card?", es: "¿Puedo pagar con tarjeta?" },
          { en: "I think there's a mistake on the bill.", es: "Creo que hay un error en la cuenta." },
          { en: "Thank you, we had a great stay.", es: "Gracias, la pasamos muy bien." }
        ]
      }
    ],
    dialogue: [
      { who: "Recepción", en: "Good afternoon, welcome! How can I help you?", es: "¡Buenas tardes, bienvenido! ¿En qué lo puedo ayudar?" },
      { who: "Vos", en: "Hi, I have a reservation under Martinez.", es: "Hola, tengo una reserva a nombre de Martínez." },
      { who: "Recepción", en: "Let me check. Yes, a double room for three nights.", es: "Déjeme ver. Sí, una habitación doble por tres noches." },
      { who: "Vos", en: "That's right. Is breakfast included?", es: "Así es. ¿El desayuno está incluido?" },
      { who: "Recepción", en: "Yes, it's served from seven to ten on the first floor.", es: "Sí, se sirve de siete a diez en el primer piso." },
      { who: "Vos", en: "Perfect. And what's the Wi-Fi password?", es: "Perfecto. ¿Y cuál es la contraseña del wifi?" },
      { who: "Recepción", en: "It's on your key card. Your room is four-oh-two. Enjoy your stay!", es: "Está en su tarjeta llave. Su habitación es la 402. ¡Que disfrute la estadía!" }
    ]
  }
];
