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
  },
  {
    id: "supermarket",
    label: "Supermercado",
    groups: [
      {
        title: "Buscar productos",
        phrases: [
          { en: "Excuse me, where can I find the milk?", es: "Disculpe, ¿dónde encuentro la leche?" },
          { en: "Which aisle is the rice in?", es: "¿En qué pasillo está el arroz?" },
          { en: "Do you have gluten-free bread?", es: "¿Tienen pan sin gluten?" },
          { en: "It's in aisle five, next to the pasta.", es: "Está en el pasillo cinco, al lado de las pastas.", who: "Empleado" },
          { en: "We're out of stock, sorry.", es: "No nos queda, perdón.", who: "Empleado" }
        ]
      },
      {
        title: "En la verdulería y la fiambrería",
        phrases: [
          { en: "Can I have half a pound of ham, please?", es: "¿Me da un cuarto kilo de jamón, por favor?" },
          { en: "Are these apples fresh?", es: "¿Estas manzanas son frescas?" },
          { en: "How much are the tomatoes?", es: "¿A cuánto están los tomates?" },
          { en: "Is this on sale?", es: "¿Esto está en oferta?" }
        ]
      },
      {
        title: "En la caja",
        phrases: [
          { en: "Do you need a bag?", es: "¿Necesita bolsa?", who: "Cajero" },
          { en: "No, thanks. I brought my own bag.", es: "No, gracias. Traje mi bolsa." },
          { en: "Can I pay with my phone?", es: "¿Puedo pagar con el celular?" },
          { en: "Could I get a receipt, please?", es: "¿Me da el ticket, por favor?" },
          { en: "I think you charged me twice.", es: "Creo que me cobró dos veces." }
        ]
      }
    ],
    dialogue: [
      { who: "Vos", en: "Excuse me, where can I find the eggs?", es: "Disculpe, ¿dónde encuentro los huevos?" },
      { who: "Empleado", en: "They're in aisle three, at the end.", es: "Están en el pasillo tres, al fondo." },
      { who: "Vos", en: "Thanks! And do you sell fresh bread?", es: "¡Gracias! ¿Y venden pan fresco?" },
      { who: "Empleado", en: "Yes, the bakery is next to the entrance.", es: "Sí, la panadería está al lado de la entrada." },
      { who: "Cajero", en: "That's eighteen fifty. Do you need a bag?", es: "Son dieciocho con cincuenta. ¿Necesita bolsa?" },
      { who: "Vos", en: "Yes, please. Can I pay by card?", es: "Sí, por favor. ¿Puedo pagar con tarjeta?" },
      { who: "Cajero", en: "Sure. Here's your receipt. Have a nice day!", es: "Claro. Acá tiene su ticket. ¡Que tenga buen día!" }
    ]
  },
  {
    id: "doctor",
    label: "Médico",
    groups: [
      {
        title: "Pedir un turno",
        phrases: [
          { en: "I'd like to make an appointment with a doctor.", es: "Quisiera pedir un turno con un médico." },
          { en: "Is there anything available today?", es: "¿Hay algún turno disponible para hoy?" },
          { en: "Do you take my insurance?", es: "¿Aceptan mi seguro médico?" },
          { en: "What's your date of birth?", es: "¿Cuál es su fecha de nacimiento?", who: "Recepción" }
        ]
      },
      {
        title: "Explicar lo que te pasa",
        phrases: [
          { en: "I don't feel well.", es: "No me siento bien." },
          { en: "I have a headache and a fever.", es: "Tengo dolor de cabeza y fiebre." },
          { en: "My throat hurts.", es: "Me duele la garganta." },
          { en: "I've had a cough for three days.", es: "Tengo tos desde hace tres días." },
          { en: "I'm allergic to penicillin.", es: "Soy alérgico a la penicilina." },
          { en: "I feel dizzy.", es: "Estoy mareado." }
        ]
      },
      {
        title: "Lo que te puede decir el médico",
        phrases: [
          { en: "What are your symptoms?", es: "¿Qué síntomas tiene?", who: "Médico" },
          { en: "Where does it hurt?", es: "¿Dónde le duele?", who: "Médico" },
          { en: "Take a deep breath.", es: "Respire hondo.", who: "Médico" },
          { en: "Take this twice a day after meals.", es: "Tome esto dos veces por día después de comer.", who: "Médico" },
          { en: "Come back if you don't feel better.", es: "Vuelva si no se siente mejor.", who: "Médico" }
        ]
      }
    ],
    dialogue: [
      { who: "Médico", en: "Hello, what brings you in today?", es: "Hola, ¿por qué viene hoy?" },
      { who: "Vos", en: "I have a sore throat and a fever.", es: "Me duele la garganta y tengo fiebre." },
      { who: "Médico", en: "How long have you felt like this?", es: "¿Hace cuánto que se siente así?" },
      { who: "Vos", en: "Since Monday.", es: "Desde el lunes." },
      { who: "Médico", en: "Let me take a look. Open your mouth, please.", es: "Déjeme revisarlo. Abra la boca, por favor." },
      { who: "Médico", en: "It's a throat infection. I'll give you a prescription.", es: "Es una infección de garganta. Le voy a dar una receta." },
      { who: "Vos", en: "Thank you, doctor.", es: "Gracias, doctor." }
    ]
  },
  {
    id: "pharmacy",
    label: "Farmacia",
    groups: [
      {
        title: "Pedir algo",
        phrases: [
          { en: "I need something for a cold.", es: "Necesito algo para el resfrío." },
          { en: "Do you have anything for a headache?", es: "¿Tiene algo para el dolor de cabeza?" },
          { en: "I'd like to pick up a prescription.", es: "Vengo a retirar una receta." },
          { en: "Do I need a prescription for this?", es: "¿Necesito receta para esto?" }
        ]
      },
      {
        title: "Preguntar cómo tomarlo",
        phrases: [
          { en: "How often should I take it?", es: "¿Cada cuánto lo tengo que tomar?" },
          { en: "Can I take it with food?", es: "¿Lo puedo tomar con comida?" },
          { en: "Does it make you sleepy?", es: "¿Da sueño?" },
          { en: "Take one pill every eight hours.", es: "Tome una pastilla cada ocho horas.", who: "Farmacéutico" }
        ]
      }
    ],
    dialogue: [
      { who: "Vos", en: "Hi, do you have something for a cough?", es: "Hola, ¿tiene algo para la tos?" },
      { who: "Farmacéutico", en: "Is it a dry cough?", es: "¿Es tos seca?" },
      { who: "Vos", en: "Yes, and it's worse at night.", es: "Sí, y empeora a la noche." },
      { who: "Farmacéutico", en: "Try this syrup. Take ten milliliters three times a day.", es: "Pruebe este jarabe. Tome diez mililitros tres veces por día." },
      { who: "Vos", en: "Does it make you sleepy?", es: "¿Da sueño?" },
      { who: "Farmacéutico", en: "A little, so don't drive after taking it.", es: "Un poco, así que no maneje después de tomarlo." }
    ]
  },
  {
    id: "cafe",
    label: "Cafetería",
    groups: [
      {
        title: "Pedir",
        phrases: [
          { en: "Can I get a medium latte, please?", es: "¿Me da un café con leche mediano, por favor?" },
          { en: "Could I have it with oat milk?", es: "¿Me lo puede hacer con leche de avena?" },
          { en: "For here or to go?", es: "¿Para tomar acá o para llevar?", who: "Empleado" },
          { en: "To go, please.", es: "Para llevar, por favor." },
          { en: "What's the name for the order?", es: "¿A nombre de quién?", who: "Empleado" }
        ]
      },
      {
        title: "Quedarse un rato",
        phrases: [
          { en: "Is this seat taken?", es: "¿Está ocupado este asiento?" },
          { en: "Do you have Wi-Fi?", es: "¿Tienen wifi?" },
          { en: "Where's the restroom?", es: "¿Dónde está el baño?" },
          { en: "Could I get a refill?", es: "¿Me puede volver a llenar la taza?" }
        ]
      }
    ],
    dialogue: [
      { who: "Empleado", en: "Hi! What can I get you?", es: "¡Hola! ¿Qué le sirvo?" },
      { who: "Vos", en: "A small cappuccino and a croissant, please.", es: "Un capuchino chico y una medialuna, por favor." },
      { who: "Empleado", en: "For here or to go?", es: "¿Para tomar acá o para llevar?" },
      { who: "Vos", en: "For here.", es: "Para tomar acá." },
      { who: "Empleado", en: "That's seven dollars. I'll bring it to your table.", es: "Son siete dólares. Se lo llevo a la mesa." },
      { who: "Vos", en: "Great, thanks!", es: "¡Genial, gracias!" }
    ]
  },
  {
    id: "clothes",
    label: "Tienda de ropa",
    groups: [
      {
        title: "Buscar y probarse",
        phrases: [
          { en: "I'm just looking, thanks.", es: "Solo estoy mirando, gracias." },
          { en: "Do you have this in a medium?", es: "¿Tienen esto en talle M?" },
          { en: "Do you have it in another color?", es: "¿Lo tienen en otro color?" },
          { en: "Where are the fitting rooms?", es: "¿Dónde están los probadores?" },
          { en: "It's too small. Do you have a bigger size?", es: "Me queda chico. ¿Tienen un talle más grande?" }
        ]
      },
      {
        title: "Comprar o cambiar",
        phrases: [
          { en: "How much is this jacket?", es: "¿Cuánto sale esta campera?" },
          { en: "I'll take it.", es: "Me lo llevo." },
          { en: "Can I return it if it doesn't fit?", es: "¿Lo puedo devolver si no me queda bien?" },
          { en: "I'd like to exchange this for a smaller size.", es: "Quisiera cambiar esto por un talle más chico." }
        ]
      }
    ],
    dialogue: [
      { who: "Vendedor", en: "Hi, can I help you find anything?", es: "Hola, ¿lo ayudo a buscar algo?" },
      { who: "Vos", en: "Yes, do you have these jeans in a size thirty-two?", es: "Sí, ¿tienen estos jeans en talle treinta y dos?" },
      { who: "Vendedor", en: "Let me check. Here you go. The fitting rooms are over there.", es: "Déjeme ver. Acá tiene. Los probadores están por allá." },
      { who: "Vos", en: "Thanks. They fit perfectly. How much are they?", es: "Gracias. Me quedan perfectos. ¿Cuánto salen?" },
      { who: "Vendedor", en: "They're forty dollars, but they're twenty percent off today.", es: "Salen cuarenta dólares, pero hoy tienen veinte por ciento de descuento." },
      { who: "Vos", en: "Great, I'll take them.", es: "Genial, me los llevo." }
    ]
  },
  {
    id: "transport",
    label: "Transporte",
    groups: [
      {
        title: "Colectivo, tren y subte",
        phrases: [
          { en: "Does this bus go downtown?", es: "¿Este colectivo va al centro?" },
          { en: "Where can I buy a ticket?", es: "¿Dónde compro el boleto?" },
          { en: "A round-trip ticket, please.", es: "Un boleto de ida y vuelta, por favor." },
          { en: "Which stop should I get off at?", es: "¿En qué parada me tengo que bajar?" },
          { en: "How often does the train come?", es: "¿Cada cuánto pasa el tren?" }
        ]
      },
      {
        title: "Taxi",
        phrases: [
          { en: "Could you take me to this address?", es: "¿Me puede llevar a esta dirección?" },
          { en: "How long will it take?", es: "¿Cuánto vamos a tardar?" },
          { en: "Can you stop here, please?", es: "¿Puede parar acá, por favor?" },
          { en: "How much do I owe you?", es: "¿Cuánto le debo?" }
        ]
      }
    ],
    dialogue: [
      { who: "Vos", en: "Excuse me, does this train go to the airport?", es: "Disculpe, ¿este tren va al aeropuerto?" },
      { who: "Empleado", en: "No, you need the blue line.", es: "No, tiene que tomar la línea azul." },
      { who: "Vos", en: "Where can I take it?", es: "¿Dónde la tomo?" },
      { who: "Empleado", en: "Go down the stairs and it's on platform two.", es: "Baje la escalera y está en el andén dos." },
      { who: "Vos", en: "How long does it take to get there?", es: "¿Cuánto tarda en llegar?" },
      { who: "Empleado", en: "About forty minutes.", es: "Unos cuarenta minutos." }
    ]
  },
  {
    id: "directions",
    label: "En la calle",
    groups: [
      {
        title: "Preguntar cómo llegar",
        phrases: [
          { en: "Excuse me, how do I get to the train station?", es: "Disculpe, ¿cómo llego a la estación de tren?" },
          { en: "Is it far from here?", es: "¿Queda lejos de acá?" },
          { en: "Can I walk there?", es: "¿Se puede ir caminando?" },
          { en: "Is there a bank near here?", es: "¿Hay un banco cerca de acá?" },
          { en: "I'm lost. Can you help me?", es: "Estoy perdido. ¿Me puede ayudar?" }
        ]
      },
      {
        title: "Entender la respuesta",
        phrases: [
          { en: "Go straight for two blocks.", es: "Siga derecho dos cuadras.", who: "Persona" },
          { en: "Turn left at the corner.", es: "Doble a la izquierda en la esquina.", who: "Persona" },
          { en: "It's on your right, across from the park.", es: "Está a su derecha, enfrente del parque.", who: "Persona" },
          { en: "It's about a ten-minute walk.", es: "Son unos diez minutos caminando.", who: "Persona" }
        ]
      }
    ],
    dialogue: [
      { who: "Vos", en: "Excuse me, is there a pharmacy near here?", es: "Disculpe, ¿hay una farmacia cerca de acá?" },
      { who: "Persona", en: "Yes, go straight and turn right at the traffic light.", es: "Sí, siga derecho y doble a la derecha en el semáforo." },
      { who: "Vos", en: "Is it far?", es: "¿Queda lejos?" },
      { who: "Persona", en: "No, it's just five minutes from here. It's next to the bank.", es: "No, está a solo cinco minutos. Queda al lado del banco." },
      { who: "Vos", en: "Thank you so much!", es: "¡Muchas gracias!" },
      { who: "Persona", en: "You're welcome.", es: "De nada." }
    ]
  },
  {
    id: "bank",
    label: "Banco",
    groups: [
      {
        title: "Trámites",
        phrases: [
          { en: "I'd like to open an account.", es: "Quisiera abrir una cuenta." },
          { en: "I'd like to exchange dollars for euros.", es: "Quisiera cambiar dólares por euros." },
          { en: "What's the exchange rate today?", es: "¿A cuánto está el cambio hoy?" },
          { en: "Is there an ATM nearby?", es: "¿Hay un cajero automático cerca?" }
        ]
      },
      {
        title: "Problemas",
        phrases: [
          { en: "The ATM kept my card.", es: "El cajero se tragó mi tarjeta." },
          { en: "I lost my credit card.", es: "Perdí mi tarjeta de crédito." },
          { en: "There's a charge I don't recognize.", es: "Hay un cobro que no reconozco." },
          { en: "Can I see your ID, please?", es: "¿Me muestra su documento, por favor?", who: "Empleado" }
        ]
      }
    ],
    dialogue: [
      { who: "Empleado", en: "Good morning. How can I help you?", es: "Buen día. ¿En qué lo puedo ayudar?" },
      { who: "Vos", en: "I lost my debit card and I need to cancel it.", es: "Perdí mi tarjeta de débito y necesito darla de baja." },
      { who: "Empleado", en: "No problem. Can I see your ID?", es: "No hay problema. ¿Me muestra su documento?" },
      { who: "Vos", en: "Here you go.", es: "Acá tiene." },
      { who: "Empleado", en: "Done. Your new card will arrive in five business days.", es: "Listo. Su tarjeta nueva le llega en cinco días hábiles." }
    ]
  },
  {
    id: "phone",
    label: "Por teléfono",
    groups: [
      {
        title: "Atender y llamar",
        phrases: [
          { en: "Hello, this is Alex speaking.", es: "Hola, habla Alex." },
          { en: "Could I speak to Sarah, please?", es: "¿Podría hablar con Sarah, por favor?" },
          { en: "Who's calling, please?", es: "¿De parte de quién?", who: "Otra persona" },
          { en: "Hold on a second, please.", es: "Un segundo, por favor.", who: "Otra persona" },
          { en: "She's not available right now. Can I take a message?", es: "Ahora no está disponible. ¿Le dejo un mensaje?", who: "Otra persona" }
        ]
      },
      {
        title: "Cuando no se entiende",
        phrases: [
          { en: "Sorry, I can't hear you very well.", es: "Perdón, no te escucho bien." },
          { en: "Could you speak more slowly, please?", es: "¿Podría hablar más despacio, por favor?" },
          { en: "Could you spell that, please?", es: "¿Me lo podría deletrear, por favor?" },
          { en: "I'll call you back later.", es: "Te llamo más tarde." }
        ]
      }
    ],
    dialogue: [
      { who: "Recepción", en: "Good morning, Green Dental Clinic.", es: "Buen día, Clínica Dental Green." },
      { who: "Vos", en: "Hi, I'd like to make an appointment for a cleaning.", es: "Hola, quisiera pedir un turno para una limpieza." },
      { who: "Recepción", en: "Sure. Can I have your name, please?", es: "Claro. ¿Me dice su nombre, por favor?" },
      { who: "Vos", en: "It's Alex Martinez.", es: "Alex Martínez." },
      { who: "Recepción", en: "Could you spell your last name?", es: "¿Me deletrea su apellido?" },
      { who: "Vos", en: "M-A-R-T-I-N-E-Z.", es: "M-A-R-T-I-N-E-Z." },
      { who: "Recepción", en: "Thank you. Is Thursday at ten OK?", es: "Gracias. ¿Le queda bien el jueves a las diez?" },
      { who: "Vos", en: "Perfect, see you then.", es: "Perfecto, nos vemos." }
    ]
  },
  {
    id: "smalltalk",
    label: "Charla casual",
    groups: [
      {
        title: "Para empezar",
        phrases: [
          { en: "How's it going?", es: "¿Cómo va?" },
          { en: "Nice to meet you. Where are you from?", es: "Un gusto. ¿De dónde sos?" },
          { en: "I'm from Argentina.", es: "Soy de Argentina." },
          { en: "What do you do for a living?", es: "¿A qué te dedicás?" },
          { en: "How long have you lived here?", es: "¿Hace cuánto que vivís acá?" }
        ]
      },
      {
        title: "Para seguir la charla",
        phrases: [
          { en: "What do you do in your free time?", es: "¿Qué hacés en tu tiempo libre?" },
          { en: "I love watching soccer.", es: "Me encanta mirar fútbol." },
          { en: "Have you been here before?", es: "¿Ya habías venido acá antes?" },
          { en: "That sounds great!", es: "¡Suena genial!" },
          { en: "Really? Tell me more.", es: "¿En serio? Contame más." }
        ]
      },
      {
        title: "Para despedirse",
        phrases: [
          { en: "It was nice talking to you.", es: "Fue un gusto charlar con vos." },
          { en: "Let's keep in touch.", es: "Sigamos en contacto." },
          { en: "See you around!", es: "¡Nos vemos!" },
          { en: "Have a great weekend!", es: "¡Que tengas un lindo fin de semana!" }
        ]
      }
    ],
    dialogue: [
      { who: "Persona", en: "Hi, I'm Sam. I don't think we've met.", es: "Hola, soy Sam. Creo que no nos conocemos." },
      { who: "Vos", en: "Hi Sam, I'm Alex. Nice to meet you.", es: "Hola Sam, soy Alex. Un gusto." },
      { who: "Persona", en: "Nice to meet you too. Where are you from?", es: "Igualmente. ¿De dónde sos?" },
      { who: "Vos", en: "I'm from Buenos Aires. And you?", es: "Soy de Buenos Aires. ¿Y vos?" },
      { who: "Persona", en: "I'm from Chicago. What brings you here?", es: "Soy de Chicago. ¿Qué te trae por acá?" },
      { who: "Vos", en: "I'm here for work, but I'm also visiting the city.", es: "Vine por trabajo, pero también estoy conociendo la ciudad." },
      { who: "Persona", en: "That's great. You should try the pizza here!", es: "¡Qué bueno! ¡Tenés que probar la pizza de acá!" }
    ]
  },
  {
    id: "gym",
    label: "Gimnasio",
    groups: [
      {
        title: "Inscribirse",
        phrases: [
          { en: "How much is a monthly membership?", es: "¿Cuánto sale la cuota mensual?" },
          { en: "Can I try a free class?", es: "¿Puedo probar una clase gratis?" },
          { en: "What time do you open on weekends?", es: "¿A qué hora abren los fines de semana?" },
          { en: "Do you have yoga classes?", es: "¿Tienen clases de yoga?" }
        ]
      },
      {
        title: "Entrenando",
        phrases: [
          { en: "Are you using this machine?", es: "¿Estás usando esta máquina?" },
          { en: "Can I work in with you?", es: "¿Puedo intercalar series con vos?" },
          { en: "Could you show me how to use this?", es: "¿Me mostrás cómo se usa esto?" },
          { en: "Do three sets of twelve reps.", es: "Hacé tres series de doce repeticiones.", who: "Entrenador" },
          { en: "Keep your back straight.", es: "Mantené la espalda derecha.", who: "Entrenador" }
        ]
      }
    ],
    dialogue: [
      { who: "Vos", en: "Hi, I'd like some information about memberships.", es: "Hola, quería información sobre las cuotas." },
      { who: "Recepción", en: "Sure. It's forty dollars a month, and it includes all classes.", es: "Claro. Son cuarenta dólares por mes e incluye todas las clases." },
      { who: "Vos", en: "Can I try it before I sign up?", es: "¿Puedo probar antes de anotarme?" },
      { who: "Recepción", en: "Yes, the first day is free.", es: "Sí, el primer día es gratis." },
      { who: "Vos", en: "Great! What time do you close?", es: "¡Genial! ¿A qué hora cierran?" },
      { who: "Recepción", en: "At ten p.m. on weekdays.", es: "A las diez de la noche de lunes a viernes." }
    ]
  },
  {
    id: "emergency",
    label: "Emergencias",
    groups: [
      {
        title: "Pedir ayuda",
        phrases: [
          { en: "Help! Call an ambulance!", es: "¡Ayuda! ¡Llamen a una ambulancia!" },
          { en: "Call the police, please.", es: "Llamen a la policía, por favor." },
          { en: "There's been an accident.", es: "Hubo un accidente." },
          { en: "I need a doctor right away.", es: "Necesito un médico urgente." },
          { en: "Where is the nearest hospital?", es: "¿Dónde está el hospital más cercano?" }
        ]
      },
      {
        title: "Explicar qué pasó",
        phrases: [
          { en: "My wallet was stolen.", es: "Me robaron la billetera." },
          { en: "I lost my passport.", es: "Perdí mi pasaporte." },
          { en: "He can't breathe.", es: "Él no puede respirar." },
          { en: "She fell and hurt her leg.", es: "Ella se cayó y se lastimó la pierna." },
          { en: "Is anyone hurt?", es: "¿Hay alguien herido?", who: "Policía" }
        ]
      }
    ],
    dialogue: [
      { who: "Operador", en: "Nine-one-one, what's your emergency?", es: "Nueve uno uno, ¿cuál es su emergencia?" },
      { who: "Vos", en: "A man fell down the stairs and he's not moving.", es: "Un hombre se cayó por la escalera y no se mueve." },
      { who: "Operador", en: "Is he breathing?", es: "¿Está respirando?" },
      { who: "Vos", en: "Yes, but he's unconscious.", es: "Sí, pero está inconsciente." },
      { who: "Operador", en: "What's the address?", es: "¿Cuál es la dirección?" },
      { who: "Vos", en: "Two-twenty Main Street, on the second floor.", es: "Main Street 220, en el segundo piso." },
      { who: "Operador", en: "An ambulance is on its way. Stay with him.", es: "Va una ambulancia en camino. Quédese con él." }
    ]
  }
];
