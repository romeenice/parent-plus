// src/dev/seedContent.js
import { collection, addDoc } from "firebase/firestore";
import { db } from "../services/firebaseConfig";

// ---------- ARTICLES SEED (10 тижнів) ----------

const articlesSeed = [
  // WEEK 1
  {
    month: 1,
    weekIndex: 1,
    order: 1,
    slug: "week1-tummy-time-basics",
    accessLevel: "free",
    title: {
      en: "Week 1: Tummy time basics",
      uk: "1 тиждень: основи часу на животику",
      es: "Semana 1: fundamentos del tummy time",
    },
    summary: {
      en: "Why tummy time matters from the very first week.",
      uk: "Чому час на животику важливий уже з першого тижня.",
      es: "Por qué el tummy time importa desde la primera semana.",
    },
    development: {
      en: "From the first week, short periods on the tummy help your baby strengthen neck, shoulder, and core muscles. Start with 2–3 minutes on a firm surface, 1–2 times a day, always under your supervision.",
      uk: "Вже з першого тижня короткі періоди на животику допомагають малюку зміцнювати мʼязи шиї, плечей та корпусу. Почніть із 2–3 хвилин на твердій поверхні 1–2 рази на день під вашим наглядом.",
      es: "Desde la primera semana, breves ratos boca abajo ayudan a tu bebé a fortalecer los músculos del cuello, los hombros y el tronco. Empieza con 2–3 minutos sobre una superficie firme, 1–2 veces al día, siempre bajo tu supervisión.",
    },
    psychology: {
      en: "Being close to the floor gives your baby a new perspective on the world. Stay at eye level, talk calmly, and smile. Your face and voice are the most important emotional anchor right now.",
      uk: "Положення на животику дає малюку новий погляд на світ. Будьте поруч на рівні очей, спокійно розмовляйте та усміхайтеся. Ваше обличчя й голос — головна емоційна опора зараз.",
      es: "Estar cerca del suelo ofrece a tu bebé una nueva perspectiva del mundo. Ponte a la altura de sus ojos, háblale con calma y sonríe. Tu rostro y tu voz son su principal ancla emocional ahora.",
    },
    health: {
      en: "Tummy time reduces the risk of flat spots on the back of the head and supports healthy posture. Always place your baby on the back for sleep and on the tummy only when awake and supervised.",
      uk: "Час на животику зменшує ризик пласкої потилиці та підтримує формування здорової постави. Для сну завжди кладіть малюка на спину, а на животику — тільки під час неспання й під наглядом.",
      es: "El tummy time reduce el riesgo de que la parte posterior de la cabeza se aplane y favorece una postura saludable. Para dormir, acuesta siempre a tu bebé boca arriba, y boca abajo solo cuando esté despierto y supervisado.",
    },
    play: {
      en: "Make tummy time playful: lay your baby on your chest while you lie back, sing, or gently move a high‑contrast toy from side to side in front of their eyes.",
      uk: "Зробіть час на животику грою: покладіть малюка собі на груди, коли ви напівлежите, наспівуйте пісеньку або повільно рухайте контрастну іграшку перед очима.",
      es: "Convierte el tummy time en juego: coloca a tu bebé sobre tu pecho mientras tú te recuestas, cántale o mueve lentamente un juguete de alto contraste delante de sus ojos.",
    },
  },

  // WEEK 2
  {
    month: 1,
    weekIndex: 2,
    order: 2,
    slug: "week2-follow-the-face",
    accessLevel: "free",
    title: {
      en: "Week 2: Follow the face",
      uk: "2 тиждень: слідкуємо за обличчям",
      es: "Semana 2: sigue el rostro",
    },
    summary: {
      en: "Encourage your baby to follow your face and voice.",
      uk: "Заохочуйте малюка стежити за вашим обличчям і голосом.",
      es: "Anima a tu bebé a seguir tu rostro y tu voz.",
    },
    development: {
      en: "At this age, babies already try to briefly fix their gaze and follow slow movements. Move your face or a simple black‑and‑white card 20–25 cm from their eyes, giving them time to focus.",
      uk: "У цьому віці малюки вже намагаються коротко фіксувати погляд і стежити за повільними рухами. Рухайте своє обличчя чи чорно‑білу картку на відстані 20–25 см від очей, даючи час сфокусуватися.",
      es: "A esta edad, los bebés ya intentan fijar brevemente la mirada y seguir movimientos lentos. Mueve tu rostro o una tarjeta en blanco y negro a 20–25 cm de sus ojos, dándole tiempo para enfocarse.",
    },
    psychology: {
      en: "Face‑to‑face contact builds a sense of safety. When your baby looks at you, паuse, respond with a smile or a gentle sound. This is the first ‘dialogue’ and it supports emotional bonding.",
      uk: "Контакт обличчям до обличчя формує відчуття безпеки. Коли малюк дивиться на вас, зробіть паузу, відповідайте усмішкою чи мʼяким звуком. Це перший «діалог», який зміцнює емоційний звʼязок.",
      es: "El contacto cara a cara construye una sensación de seguridad. Cuando tu bebé te mira, haz una pausa y responde con una sonrisa o un sonido suave. Es su primer «diálogo» y fortalece el vínculo emocional.",
    },
    health: {
      en: "Short sessions on the back and side help your baby learn to turn the head symmetrically. Alternate the side where you hold and feed the baby to avoid constant pressure on one area.",
      uk: "Короткі періоди на спині й боці допомагають дитині вчитися симетрично повертати голову. Чередуйте бік, на якому тримаєте та годуєте малюка, щоб уникати постійного тиску на одну ділянку.",
      es: "Breves ratos boca arriba y de lado ayudan a tu bebé a aprender a girar la cabeza de forma simétrica. Alterna el lado en el que lo sostienes y das de comer para evitar presión constante en una sola zona.",
    },
    play: {
      en: "Turn following into a game: slowly move your head from side to side, play peek‑a‑boo behind your hands, or gently sway while holding your baby in your arms.",
      uk: "Перетворіть стеження на гру: повільно рухайте головою з боку в бік, грайте в «ку‑ку» за долонями або плавно погойдуйтесь, тримаючи малюка на руках.",
      es: "Convierte el seguimiento en un juego: mueve lentamente la cabeza de un lado a otro, juega al cucú tras tus manos o mécete suavemente con tu bebé en brazos.",
    },
  },

  // WEEK 3
  {
    month: 1,
    weekIndex: 3,
    order: 3,
    slug: "week3-hands-and-touch",
    accessLevel: "free",
    title: {
      en: "Week 3: Discovering hands and touch",
      uk: "3 тиждень: відкриваємо ручки й дотики",
      es: "Semana 3: descubriendo manos y tacto",
    },
    summary: {
      en: "Gentle touch and contact with hands support early body awareness.",
      uk: "Ніжні дотики й контакт із ручками підтримують усвідомлення власного тіла.",
      es: "El tacto suave y el contacto con las manos favorecen la conciencia corporal temprana.",
    },
    development: {
      en: "Your baby still moves arms chaotically, but they already enjoy having their hands brought together. Help them touch their chest, cheeks, or your face to build early body maps in the brain.",
      uk: "Рухи ручок ще хаотичні, але малюкам подобається, коли ви допомагаєте зʼєднати руки. Допомагайте торкатися грудей, щічок або вашого обличчя, формуючи в мозку перші «карти» тіла.",
      es: "Tu bebé aún mueve los brazos de forma caótica, pero ya disfruta cuando le ayudas a juntar las manos. Ayúdale a tocar su pecho, sus mejillas o tu rostro para construir en el cerebro los primeros «mapas» corporales.",
    },
    psychology: {
      en: "Slow, predictable touch teaches your baby that the world is safe and caring. Describe what you are doing in a calm voice: “Now I touch your hand, now your tummy.”",
      uk: "Повільні, передбачувані дотики вчать малюка, що світ безпечний і турботливий. Описуйте спокійним голосом, що робите: «Зараз торкаюсь твоєї ручки, зараз твого животика».",
      es: "Un tacto lento y predecible enseña a tu bebé que el mundo es seguro y cuidadoso. Describe con voz tranquila lo que haces: «Ahora toco tu mano, ahora tu barriguita».",
    },
    health: {
      en: "Short daily massage with natural oil or lotion can improve circulation and digestion. Avoid strong pressure; instead, use smooth strokes from the center of the body toward the limbs.",
      uk: "Короткий щоденний масаж з натуральною олією чи лосьйоном покращує кровообіг і травлення. Уникайте сильного натиску, використовуйте плавні рухи від центру тіла до кінцівок.",
      es: "Un masaje diario breve con aceite o loción natural mejora la circulación y la digestión. Evita la presión fuerte y usa movimientos suaves desde el centro del cuerpo hacia las extremidades.",
    },
    play: {
      en: "Play ‘hand games’: gently хлюпай пальчиками, робіть легкі «плескання» долоньками та доторки до різних текстур — м’якої тканини, рушничка, вашої сорочки.",
      uk: "Грайтеся з ручками: мʼяко перебирайте пальчики, робіть легкі «плескання» долонями та доторки до різних текстур — мʼякої тканини, рушничка, вашої сорочки.",
      es: "Jugad con las manos: acaricia suavemente sus dedos, haz pequeños «aplausos» con sus palmas y ofrécele diferentes texturas: una tela suave, una toalla, tu camiseta.",
    },
  },

  // WEEK 4
  {
    month: 1,
    weekIndex: 4,
    order: 4,
    slug: "week4-daily-rhythm",
    accessLevel: "free",
    title: {
      en: "Week 4: Building a gentle rhythm",
      uk: "4 тиждень: мʼякий денний ритм",
      es: "Semana 4: creando un ritmo suave",
    },
    summary: {
      en: "Introduce gentle, predictable patterns to your baby’s day.",
      uk: "Вводьте мʼякі, передбачувані елементи в розпорядок дня малюка.",
      es: "Introduce patrones suaves y predecibles en el día de tu bebé.",
    },
    development: {
      en: "Repeated daily patterns help the nervous system feel safer. Simple routines around waking, feeding, and sleep make it easier for your baby to adapt to the outside world.",
      uk: "Повторювані щоденні патерни допомагають нервовій системі почуватися безпечніше. Прості ритуали навколо пробудження, годування та сну полегшують адаптацію до зовнішнього світу.",
      es: "Los patrones diarios repetidos ayudan al sistema nervioso a sentirse más seguro. Rutinas sencillas en torno al despertar, la alimentación y el sueño facilitan la adaptación al mundo exterior.",
    },
    psychology: {
      en: "Even tiny rituals — the same phrase before sleep, the same lullaby — give your baby a feeling of predictability. You are teaching: “I know what happens next, and I’m not alone.”",
      uk: "Навіть маленькі ритуали — однакова фраза перед сном, та сама колискова — дають малюку відчуття передбачуваності. Ви ніби кажете: «Я знаю, що буде далі, і ти не сам».",
      es: "Incluso los pequeños rituales —la misma frase antes de dormir, la misma nana— dan a tu bebé sensación de previsibilidad. Le enseñas: «Sé lo que viene después y no estás solo».",
    },
    health: {
      en: "Observe your baby’s sleepy cues: looking away, slower movements, yawning. Putting the baby to sleep at the first signs of tiredness often prevents overstimulation and evening crying.",
      uk: "Спостерігайте за ознаками втоми: відведення погляду, уповільнення рухів, позіхання. Якщо вкладати спати при перших сигналах, це часто запобігає перевтомі й вечірньому плачу.",
      es: "Observa las señales de sueño: apartar la mirada, movimientos más lentos, bostezos. Acostar al bebé con los primeros signos de cansancio suele evitar la sobreestimulación y el llanto nocturno.",
    },
    play: {
      en: "Create a short ‘good morning’ and ‘good night’ ritual with a simple song, soft light, and one or two calm movements, like a gentle stretch or cuddle.",
      uk: "Створіть короткі ритуали «доброго ранку» та «надобраніч» — проста пісенька, мʼяке світло й 1–2 спокійні дії, наприклад легке потягування або обійми.",
      es: "Crea un breve ritual de «buenos días» y «buenas noches» con una canción sencilla, luz suave y uno o dos gestos calmados, como un estiramiento suave o un abrazo.",
    },
  },

  // WEEK 5
  {
    month: 2,
    weekIndex: 1,
    order: 5,
    slug: "week5-longer-tummy-time",
    accessLevel: "free",
    title: {
      en: "Week 5: Longer tummy time",
      uk: "5 тиждень: довший час на животику",
      es: "Semana 5: tummy time más largo",
    },
    summary: {
      en: "Gradually increase tummy time and head control.",
      uk: "Поступово збільшуємо час на животику та контроль голови.",
      es: "Aumenta poco a poco el tummy time y el control de la cabeza.",
    },
    development: {
      en: "By now your baby may lift the head a little higher and hold it for longer. Aim for 15–20 minutes of tummy time spread across the day in several short sessions.",
      uk: "До цього часу малюк може підіймати голівку трохи вище й утримувати довше. Орієнтуйтесь на 15–20 хвилин часу на животику протягом дня, розділених на кілька коротких підходів.",
      es: "A estas alturas tu bebé puede levantar la cabeza un poco más y mantenerla durante más tiempo. Intenta llegar a 15–20 minutos de tummy time al día, repartidos en varias sesiones breves.",
    },
    psychology: {
      en: "Celebrate effort, not result: коментуйте спроби підняти голову як важливе досягнення, навіть якщо рух невеликий.",
      uk: "Святкуйте зусилля, а не результат: коментуйте спроби підняти голову як важливе досягнення, навіть якщо рух дуже невеликий.",
      es: "Celebra el esfuerzo, no el resultado: comenta los intentos de levantar la cabeza como un gran logro, incluso si el movimiento es pequeño.",
    },
    health: {
      en: "If your baby protests, зменшіть тривалість, але повторюйте частіше. Краще кілька коротких приємних спроб, ніж один довгий стресовий підхід.",
      uk: "Якщо малюк протестує, зменшіть тривалість, але повторюйте частіше. Краще кілька коротких приємних спроб, ніж один довгий стресовий підхід.",
      es: "Si tu bebé protesta, reduce la duración pero repite más veces. Es mejor varios intentos breves y agradables que una única sesión larga y estresante.",
    },
    play: {
      en: "Lie on the floor facing your baby, використовуйте дзеркало чи контрастні картинки, щоб утримувати інтерес під час tummy time.",
      uk: "Ляжте на підлогу навпроти малюка, використовуйте дзеркало чи контрастні картинки, щоб утримувати інтерес під час tummy time.",
      es: "Túmbate en el suelo frente a tu bebé y usa un espejo o imágenes de alto contraste para mantener su interés durante el tummy time.",
    },
  },

  // WEEK 6
  {
    month: 2,
    weekIndex: 2,
    order: 6,
    slug: "week6-sounds-and-voice",
    accessLevel: "free",
    title: {
      en: "Week 6: Sounds and your voice",
      uk: "6 тиждень: звуки та ваш голос",
      es: "Semana 6: sonidos y tu voz",
    },
    summary: {
      en: "Your baby listens closely and starts recognizing familiar sounds.",
      uk: "Малюк уважно прислухається й починає впізнавати знайомі звуки.",
      es: "Tu bebé escucha con atención y empieza a reconocer sonidos familiares.",
    },
    development: {
      en: "Babies are especially sensitive to human voices. Alternate between calm talking, gentle singing, and short pauses, giving your child time to ‘answer’ with movements or sounds.",
      uk: "Малюки особливо чутливі до людського голосу. Чергуйте спокійну розмову, мʼякий спів та короткі паузи, даючи дитині час «відповісти» рухом чи звуком.",
      es: "Los bebés son especialmente sensibles a las voces humanas. Alterna entre hablar con calma, cantar suavemente y hacer pequeñas pausas, dejando que tu hijo «responda» con movimientos o sonidos.",
    },
    psychology: {
      en: "This early ‘conversation’ вчить, що його сигнали важливі й помітні. Коли малюк видає звук, зробіть паузу та відповідайте, ніби це фраза.",
      uk: "Цей ранній «діалог» вчить дитину, що її сигнали важливі й помітні. Коли малюк видає звук, зробіть паузу та відповідайте, ніби це фраза.",
      es: "Este primer «diálogo» le enseña que sus señales son importantes y visibles. Cuando tu bebé emite un sonido, haz una pausa y responde como si fuera una frase.",
    },
    health: {
      en: "Якщо ви помічаєте, що дитина ніколи не здригається від гучного звуку, не реагує на голос, який звучить збоку, обговоріть це з педіатром.",
      uk: "Якщо ви помічаєте, що дитина ніколи не здригається від гучного звуку, не реагує на голос, який звучить збоку, обговоріть це з педіатром.",
      es: "Si notas que tu bebé nunca se sobresalta con un ruido fuerte o no reacciona a voces a su alrededor, coméntalo con su pediatra.",
    },
    play: {
      en: "Створіть «оркестр» з побутових предметів: тихо постукуйте ложкою по пластиковій мисці, шелестіть папером, коментуючи кожен новий звук.",
      uk: "Створіть «оркестр» з побутових предметів: тихо постукуйте ложкою по пластиковій мисці, шелестіть папером, коментуючи кожен новий звук.",
      es: "Cread una especie de «orquesta» con objetos cotidianos: golpea suavemente una cuchara contra un cuenco de plástico, arruga papel y comenta cada nuevo sonido.",
    },
  },

  // WEEK 7
  {
    month: 2,
    weekIndex: 3,
    order: 7,
    slug: "week7-side-lying",
    accessLevel: "free",
    title: {
      en: "Week 7: Comfortable side‑lying",
      uk: "7 тиждень: зручне положення на боці",
      es: "Semana 7: postura cómoda de lado",
    },
    summary: {
      en: "Side‑lying gives a new way to explore hands and the world.",
      uk: "Положення на боці дає новий спосіб досліджувати ручки й світ.",
      es: "Estar de lado ofrece una nueva forma de explorar las manos y el entorno.",
    },
    development: {
      en: "Side‑lying helps your baby bring hands to the middle and later roll over. Підкладайте згорнутий рушник за спину, щоб утримати положення на боці на кілька хвилин.",
      uk: "Положення на боці допомагає малюку зводити ручки до серединної лінії й у майбутньому легше перевертатися. Підкладайте згорнутий рушник за спину, щоб утримати це положення кілька хвилин.",
      es: "La postura de lado ayuda a tu bebé a llevar las manos al centro y, más adelante, a rodar. Coloca una toalla enrollada detrás de su espalda para mantener la posición unos minutos.",
    },
    psychology: {
      en: "Новий кут огляду робить світ цікавішим, але важливо, щоб малюк бачив ваше обличчя. Розмовляйте й усміхайтеся, коли він лежить на боці.",
      uk: "Новий кут огляду робить світ цікавішим, але важливо, щоб малюк бачив ваше обличчя. Розмовляйте й усміхайтеся, коли він лежить на боці.",
      es: "El nuevo ángulo de visión hace el mundo más interesante, pero es importante que pueda ver tu rostro. Háblale y sonríele cuando esté de lado.",
    },
    health: {
      en: "Side‑lying знижує навантаження на потилицю й допомагає рівномірно розподіляти тиск на голову. Завжди кладіть малюка на бік тільки під наглядом.",
      uk: "Положення на боці знижує навантаження на потилицю й допомагає рівномірно розподіляти тиск на голову. Завжди кладіть малюка на бік тільки під наглядом.",
      es: "Estar de lado reduce la presión en la parte posterior de la cabeza y ayuda a distribuirla de forma uniforme. Solo pon a tu bebé de lado bajo supervisión.",
    },
    play: {
      en: "Підвісьте одну-дві легкі іграшки збоку так, щоб дитина могла випадково торкатися їх ручками. Це заохочує перші цілеспрямовані дотики.",
      uk: "Підвісьте одну-дві легкі іграшки збоку так, щоб дитина могла випадково торкатися їх ручками. Це заохочує перші цілеспрямовані дотики.",
      es: "Cuelga uno o dos juguetes ligeros a un lado para que tu bebé pueda tocarlos accidentalmente con las manos. Esto fomenta los primeros toques intencionados.",
    },
  },

  // WEEK 8
  {
    month: 2,
    weekIndex: 4,
    order: 8,
    slug: "week8-first-smiles",
    accessLevel: "free",
    title: {
      en: "Week 8: First social smiles",
      uk: "8 тиждень: перші соціальні усмішки",
      es: "Semana 8: primeras sonrisas sociales",
    },
    summary: {
      en: "Your baby starts smiling in response to your face and voice.",
      uk: "Малюк починає усміхатися у відповідь на ваше обличчя та голос.",
      es: "Tu bebé comienza a sonreír en respuesta a tu rostro y tu voz.",
    },
    development: {
      en: "A social smile means your baby is already linking your face, tone of voice, and pleasant body sensations. Це важливий етап розвитку нервової системи.",
      uk: "Соціальна усмішка означає, що малюк уже повʼязує ваше обличчя, тон голосу та приємні тілесні відчуття. Це важливий етап розвитку нервової системи.",
      es: "La sonrisa social indica que tu bebé ya conecta tu rostro, el tono de tu voz y sensaciones corporales agradables. Es una etapa importante del desarrollo del sistema nervioso.",
    },
    psychology: {
      en: "Відповідайте на кожну усмішку: усміхайтесь ширше, коментуйте, як ви радієте. Так ви зміцнюєте відчуття, що його емоції помічені й прийняті.",
      uk: "Відповідайте на кожну усмішку: усміхайтесь ширше, коментуйте, як ви радієте. Так ви зміцнюєте відчуття, що його емоції помічені й прийняті.",
      es: "Responde a cada sonrisa: sonríe aún más y comenta lo feliz que te hace. Así refuerzas la sensación de que sus emociones son vistas y aceptadas.",
    },
    health: {
      en: "Якщо до 8–9 тижнів ви ніколи не бачили жодної усмішки у відповідь, але малюк загалом активний, просто відмітьте це й згадайте на черговому візиті до педіатра.",
      uk: "Якщо до 8–9 тижнів ви ніколи не бачили жодної усмішки у відповідь, але малюк загалом активний, просто відмітьте це й згадайте на черговому візиті до педіатра.",
      es: "Si hacia las 8–9 semanas aún no has visto ninguna sonrisa en respuesta, pero tu bebé está activo en general, simplemente anótalo y coméntalo en la próxima visita al pediatra.",
    },
    play: {
      en: "Грайте в прості «емоційні» ігри: змінюйте вираз обличчя від здивування до радості, супроводжуючи це короткими звуками: «О-о!», «Ух ти!».",
      uk: "Грайте в прості «емоційні» ігри: змінюйте вираз обличчя від здивування до радості, супроводжуючи це короткими звуками: «О-о!», «Ух ти!».",
      es: "Jugad a juegos «emocionales» sencillos: cambia tu expresión de sorpresa a alegría, acompañándolo con sonidos cortos como «oh» o «¡guau!».",
    },
  },

  // WEEK 9
  {
    month: 3,
    weekIndex: 1,
    order: 9,
    slug: "week9-hands-to-mouth",
    accessLevel: "free",
    title: {
      en: "Week 9: Hands to mouth",
      uk: "9 тиждень: ручки до рота",
      es: "Semana 9: manos a la boca",
    },
    summary: {
      en: "Bringing hands to the mouth is an important self‑soothing skill.",
      uk: "Піднесення ручок до рота — важливий навик самозаспокоєння.",
      es: "Llevarse las manos a la boca es una habilidad importante de autorregulación.",
    },
    development: {
      en: "When your baby finds their hands, вони вчаться керувати рухами й отримують знайомий заспокійливий стимул. Не заважайте безпечному смоктанню кулачків.",
      uk: "Коли малюк знаходить свої ручки, він вчиться керувати рухами й отримує знайомий заспокійливий стимул. Не заважайте безпечному смоктанню кулачків.",
      es: "Cuando tu bebé descubre sus manos, aprende a controlar mejor los movimientos y recibe un estímulo calmante conocido. No impidas que chupe sus puños si es seguro.",
    },
    psychology: {
      en: "Самостійне смоктання руки — перший крок до самозаспокоєння. Це не «погана звичка», а спосіб впоратися з напругою.",
      uk: "Самостійне смоктання руки — перший крок до самозаспокоєння. Це не «погана звичка», а спосіб впоратися з напругою.",
      es: "Chuparse la mano es un primer paso hacia la autorregulación. No es un «mal hábito», sino una forma de manejar la tensión.",
    },
    health: {
      en: "Пропонуйте безпечні предмети для рота — мʼякі прорізувачі за віком. Слідкуйте, щоб на руках і іграшках не було дрібних деталей чи різких країв.",
      uk: "Пропонуйте безпечні предмети для рота — мʼякі прорізувачі за віком. Слідкуйте, щоб на руках і іграшках не було дрібних деталей чи різких країв.",
      es: "Ofrece objetos seguros para la boca, como mordedores suaves apropiados para su edad. Asegúrate de que no haya piezas pequeñas ni bordes afilados.",
    },
    play: {
      en: "Пропонуйте дитині торкатися вашої долоні, мʼяких тканин, різних форм, щоб поєднати тактильні відчуття й рух рук до рота.",
      uk: "Пропонуйте дитині торкатися вашої долоні, мʼяких тканин, різних форм, щоб поєднати тактильні відчуття й рух рук до рота.",
      es: "Invita a tu bebé a tocar tu mano, telas suaves y diferentes formas para combinar las sensaciones táctiles con el movimiento de las manos hacia la boca.",
    },
  },

  // WEEK 10
  {
    month: 3,
    weekIndex: 2,
    order: 10,
    slug: "week10-looking-around",
    accessLevel: "free",
    title: {
      en: "Week 10: Looking around more",
      uk: "10 тиждень: розглядаємо світ активніше",
      es: "Semana 10: explorando más con la mirada",
    },
    summary: {
      en: "Your baby is more alert and spends longer awake and observing.",
      uk: "Малюк більш бадьорий і довше проводить час, розглядаючи все навколо.",
      es: "Tu bebé está más despierto y pasa más tiempo observando el entorno.",
    },
    development: {
      en: "Longer periods of quiet alertness — це час, коли мозок активно вчиться. Забезпечте достатньо світла, але без яскравого мерехтіння й надлишку стимулів.",
      uk: "Довші періоди спокійної бадьорості — це час, коли мозок активно вчиться. Забезпечте достатньо світла, але без яскравого мерехтіння й надлишку стимулів.",
      es: "Los periodos más largos de alerta tranquila son momentos en los que el cerebro aprende de forma activa. Ofrece buena luz, pero evita destellos intensos y exceso de estímulos.",
    },
    psychology: {
      en: "Малюк може вибирати, на що дивитись: на вашу усмішку чи на вікно. Дозволяйте невеликі «перепочинки» від контакту очі-в-очі, це нормально.",
      uk: "Малюк може вибирати, на що дивитись: на вашу усмішку чи на вікно. Дозволяйте невеликі «перепочинки» від контакту очі-в-очі, це нормально.",
      es: "Tu bebé puede elegir mirar tu sonrisa o la ventana. Permite pequeños descansos del contacto visual directo; es normal.",
    },
    health: {
      en: "Стежте, щоб голова не була постійно повернута в один бік. Переміщайте іграшки та міняйте сторону, з якої підходите до ліжечка.",
      uk: "Стежте, щоб голова не була постійно повернута в один бік. Переміщайте іграшки та міняйте сторону, з якої підходите до ліжечка.",
      es: "Vigila que la cabeza no esté siempre girada hacia el mismo lado. Cambia de lado al acercarte a la cuna y mueve los juguetes de posición.",
    },
    play: {
      en: "Покажіть дитині «тур екскурсію» кімнатою на руках: повільно рухайтесь, зупиняючись біля вікна, рослин, картинок, коментуючи те, що бачите.",
      uk: "Покажіть дитині «екскурсію» кімнатою на руках: повільно рухайтесь, зупиняючись біля вікна, рослин, картинок, коментуючи те, що бачите.",
      es: "Haz una pequeña «excursión» por la habitación con tu bebé en brazos: muévete despacio, deteniéndote junto a la ventana, plantas o cuadros y comenta lo que ves.",
    },
  },
];

// ---------- TASKS SEED (10 тижнів) ----------

const tasksSeed = [
  // WEEK 1
  {
    month: 1,
    weekIndex: 1,
    order: 1,
    slug: "week1-tummy-time-3-5-min",
    accessLevel: "free",
    category: "daily",
    title: {
      en: "Daily tummy time 3–5 minutes",
      uk: "Щоденний tummy time 3–5 хвилин",
      es: "Tummy time diario 3–5 minutos",
    },
    description: {
      en: "Once or twice a day, place your baby on the tummy on a firm surface for 3–5 minutes, staying at eye level and talking calmly.",
      uk: "1–2 рази на день кладіть малюка на животик на тверду поверхню на 3–5 хвилин, будьте поруч на рівні очей та спокійно розмовляйте.",
      es: "1–2 veces al día coloca a tu bebé boca abajo sobre una superficie firme durante 3–5 minutos, mantente a la altura de sus ojos y háblale con calma.",
    },
  },
  {
    month: 1,
    weekIndex: 1,
    order: 2,
    slug: "week1-skin-to-skin",
    accessLevel: "free",
    category: "connection",
    title: {
      en: "Skin‑to‑skin cuddle",
      uk: "Обійми «шкіра до шкіри»",
      es: "Contacto piel con piel",
    },
    description: {
      en: "Hold your baby against your bare chest for at least 10–15 minutes, covered with a blanket, allowing them to hear your heartbeat.",
      uk: "Притисніть малюка до свого оголеного грудей на 10–15 хвилин, накривши ковдрою, щоб він чув ваше серцебиття.",
      es: "Sujeta a tu bebé contra tu pecho descubierto durante 10–15 minutos, cubriéndolo con una manta para que escuche tu corazón.",
    },
  },

  // WEEK 2
  {
    month: 1,
    weekIndex: 2,
    order: 3,
    slug: "week2-follow-face",
    accessLevel: "free",
    category: "daily",
    title: {
      en: "Face‑following game",
      uk: "Гра «слідкуємо за обличчям»",
      es: "Juego de seguir el rostro",
    },
    description: {
      en: "Hold your baby about 20–25 cm from your face and slowly move your head from side to side, giving them time to follow you with their eyes.",
      uk: "Тримайте малюка на відстані 20–25 см від обличчя та повільно рухайте голову з боку в бік, даючи час стежити поглядом.",
      es: "Sujeta a tu bebé a 20–25 cm de tu rostro y mueve la cabeza lentamente de un lado a otro, dándole tiempo para seguirte con la mirada.",
    },
  },
  {
    month: 1,
    weekIndex: 2,
    order: 4,
    slug: "week2-contrast-card",
    accessLevel: "free",
    category: "play",
    title: {
      en: "Show a high‑contrast card",
      uk: "Показати контрастну картку",
      es: "Mostrar una tarjeta de alto contraste",
    },
    description: {
      en: "For 1–2 minutes, show a simple black‑and‑white card in front of your baby and move it slowly left–right.",
      uk: "1–2 хвилини показуйте просту чорно‑білу картку перед малюком, повільно рухаючи її вліво‑вправо.",
      es: "Durante 1–2 minutos, enseña una tarjeta en blanco y negro delante de tu bebé y muévela lentamente de izquierda a derecha.",
    },
  },

  // WEEK 3
  {
    month: 1,
    weekIndex: 3,
    order: 5,
    slug: "week3-hand-massage",
    accessLevel: "free",
    category: "care",
    title: {
      en: "Gentle hand massage",
      uk: "Ніжний масаж ручок",
      es: "Masaje suave de manos",
    },
    description: {
      en: "After a diaper change, gently stroke each finger and the palm, naming the fingers in your language.",
      uk: "Після зміни підгузка мʼяко погладьте кожен пальчик і долоньку, називаючи пальчики вголос.",
      es: "Después de cambiar el pañal, acaricia suavemente cada dedo y la palma, nombrando los dedos en voz alta.",
    },
  },
  {
    month: 1,
    weekIndex: 3,
    order: 6,
    slug: "week3-hands-to-face",
    accessLevel: "free",
    category: "connection",
    title: {
      en: "Help hands touch face",
      uk: "Допомогти ручкам торкнутися обличчя",
      es: "Ayudar a las manos a tocar la cara",
    },
    description: {
      en: "Guide your baby’s hands to touch their cheeks or your face for a few seconds, keeping the movements slow and calm.",
      uk: "Спрямовуйте ручки малюка до його щічок або до вашого обличчя на кілька секунд, рухаючи повільно й спокійно.",
      es: "Guía las manos de tu bebé para que toquen sus mejillas o tu rostro durante unos segundos, con movimientos lentos y suaves.",
    },
  },

  // WEEK 4
  {
    month: 1,
    weekIndex: 4,
    order: 7,
    slug: "week4-evening-ritual",
    accessLevel: "free",
    category: "routine",
    title: {
      en: "Create an evening ritual",
      uk: "Створити вечірній ритуал",
      es: "Crear un ritual de noche",
    },
    description: {
      en: "Choose one simple phrase and lullaby to repeat every evening before sleep, keeping lights dim and movements slow.",
      uk: "Обирайте одну просту фразу та колискову, які повторюватимете щовечора перед сном, при приглушеному світлі й повільних рухах.",
      es: "Elige una frase sencilla y una nana que repetirás cada noche antes de dormir, con luz tenue y movimientos tranquilos.",
    },
  },
  {
    month: 1,
    weekIndex: 4,
    order: 8,
    slug: "week4-day-observation",
    accessLevel: "free",
    category: "reflection",
    title: {
      en: "Observe your baby’s sleepy signs",
      uk: "Поспостерігати за ознаками втоми",
      es: "Observar señales de sueño del bebé",
    },
    description: {
      en: "During one day, notice when your baby starts looking away, yawning, or moving more slowly, and try to offer sleep a bit earlier.",
      uk: "Протягом дня відмічайте, коли малюк відводить погляд, позіхає чи рухається повільніше, і спробуйте запропонувати сон трохи раніше.",
      es: "Durante un día, fíjate en cuándo tu bebé aparta la mirada, bosteza o se mueve más despacio, e intenta ofrecerle dormir un poco antes.",
    },
  },

  // WEEK 5
  {
    month: 2,
    weekIndex: 1,
    order: 9,
    slug: "week5-extend-tummy-time",
    accessLevel: "free",
    category: "daily",
    title: {
      en: "Extend tummy time to 10 minutes",
      uk: "Збільшити tummy time до 10 хвилин",
      es: "Ampliar tummy time a 10 minutos",
    },
    description: {
      en: "Split tummy time into 3–4 short sessions during the day, trying to reach a total of about 10 minutes.",
      uk: "Розділіть час на животику на 3–4 короткі сесії протягом дня, намагаючись загалом набрати близько 10 хвилин.",
      es: "Divide el tummy time en 3–4 sesiones breves a lo largo del día e intenta llegar a un total de unos 10 minutos.",
    },
  },
  {
    month: 2,
    weekIndex: 1,
    order: 10,
    slug: "week5-tummy-on-parent",
    accessLevel: "free",
    category: "connection",
    title: {
      en: "Tummy time on your chest",
      uk: "Tummy time на ваших грудях",
      es: "Tummy time sobre tu pecho",
    },
    description: {
      en: "Lie back and place your baby on your chest tummy‑down so they lift the head to look at your face.",
      uk: "Напівлежачи, покладіть малюка животиком на свої груди, щоб він піднімав голівку й дивився на ваше обличчя.",
      es: "Recuéstate y coloca a tu bebé boca abajo sobre tu pecho para que levante la cabeza y mire tu rostro.",
    },
  },

  // WEEK 6
  {
    month: 2,
    weekIndex: 2,
    order: 11,
    slug: "week6-voice-dialogue",
    accessLevel: "free",
    category: "play",
    title: {
      en: "Voice ‘dialogue’ game",
      uk: "Гра «голосний діалог»",
      es: "Juego de «diálogo» con la voz",
    },
    description: {
      en: "Talk or sing a short phrase, pause, and wait for any sound or movement from your baby, then ‘answer’ back.",
      uk: "Промовте чи проспівайте коротку фразу, зробіть паузу й зачекайте будь-який звук або рух від малюка, потім «відповідайте» у відповідь.",
      es: "Di o canta una frase corta, haz una pausa y espera algún sonido o movimiento de tu bebé, luego «respóndele».",
    },
  },
  {
    month: 2,
    weekIndex: 2,
    order: 12,
    slug: "week6-sound-exploration",
    accessLevel: "free",
    category: "play",
    title: {
      en: "Explore soft household sounds",
      uk: "Дослідити мʼякі звуки вдома",
      es: "Explorar sonidos suaves de la casa",
    },
    description: {
      en: "Gently make 2–3 different sounds (paper, spoon on plastic, quiet humming) and show the source to your baby.",
      uk: "Ніжно створіть 2–3 різні звуки (папір, ложка по пластику, тихе наспівування) і покажіть дитині, звідки вони лунають.",
      es: "Produce suavemente 2–3 sonidos distintos (papel, cuchara en plástico, tarareo suave) y muestra a tu bebé de dónde vienen.",
    },
  },

  // WEEK 7
  {
    month: 2,
    weekIndex: 3,
    order: 13,
    slug: "week7-side-lying-play",
    accessLevel: "free",
    category: "daily",
    title: {
      en: "Short side‑lying play",
      uk: "Коротка гра в положенні на боці",
      es: "Juego breve de lado",
    },
    description: {
      en: "Place your baby on the side with a rolled towel behind the back for 3–5 minutes, offering a light toy near the hands.",
      uk: "Покладіть малюка на бік, підклавши згорнутий рушник за спину на 3–5 хвилин, і запропонуйте легку іграшку біля ручок.",
      es: "Coloca a tu bebé de lado con una toalla enrollada detrás de la espalda durante 3–5 minutos y ofrece un juguete ligero cerca de sus manos.",
    },
  },
  {
    month: 2,
    weekIndex: 3,
    order: 14,
    slug: "week7-switch-sides",
    accessLevel: "free",
    category: "care",
    title: {
      en: "Switch the side you hold on",
      uk: "Міняйте бік, на якому тримаєте",
      es: "Cambiar de lado al sostenerlo",
    },
    description: {
      en: "During the day, consciously alternate the side on which you carry and feed your baby to keep head position symmetric.",
      uk: "Протягом дня свідомо чергуйте бік, на якому носите й годуєте малюка, щоб положення голови було більш симетричним.",
      es: "A lo largo del día, alterna conscientemente el lado en el que lo llevas y alimentas para mantener una posición de cabeza más simétrica.",
    },
  },

  // WEEK 8
  {
    month: 2,
    weekIndex: 4,
    order: 15,
    slug: "week8-smile-time",
    accessLevel: "free",
    category: "connection",
    title: {
      en: "Smile time",
      uk: "Час для усмішок",
      es: "Momento de sonrisas",
    },
    description: {
      en: "Spend a few minutes simply looking at your baby, waiting for small smiles and responding with your own big smile.",
      uk: "Проведіть кілька хвилин, просто дивлячись на малюка, чекаючи на невеликі усмішки й відповідаючи своєю широкою усмішкою.",
      es: "Dedica unos minutos a mirar a tu bebé, esperando pequeñas sonrisas y respondiendo con tu propia gran sonrisa.",
    },
  },
  {
    month: 2,
    weekIndex: 4,
    order: 16,
    slug: "week8-emotion-faces",
    accessLevel: "free",
    category: "play",
    title: {
      en: "Show 2–3 emotion faces",
      uk: "Показати 2–3 емоційні вирази",
      es: "Mostrar 2–3 expresiones faciales",
    },
    description: {
      en: "Gently show surprised, happy, and calm faces, adding short sounds like “oh” or “yay”, watching how your baby reacts.",
      uk: "Ніжно покажіть здивоване, радісне та спокійне обличчя, додаючи короткі звуки типу «о-о» чи «ура», спостерігаючи за реакцією малюка.",
      es: "Muestra suavemente caras de sorpresa, alegría y calma, añadiendo sonidos cortos como «oh» o «bien», observando la reacción de tu bebé.",
    },
  },

  // WEEK 9
  {
    month: 3,
    weekIndex: 1,
    order: 17,
    slug: "week9-hands-to-mouth-practice",
    accessLevel: "free",
    category: "daily",
    title: {
      en: "Hands‑to‑mouth practice",
      uk: "Практика «ручки до рота»",
      es: "Practicar manos a la boca",
    },
    description: {
      en: "Give your baby time on the back with free hands so they can find their fists and bring them to the mouth.",
      uk: "Давайте малюку час на спині з вільними ручками, щоб він міг знаходити кулачки й підносити їх до рота.",
      es: "Deja a tu bebé boca arriba con las manos libres para que pueda encontrar sus puños y llevárselos a la boca.",
    },
  },
  {
    month: 3,
    weekIndex: 1,
    order: 18,
    slug: "week9-safe-teether",
    accessLevel: "free",
    category: "care",
    title: {
      en: "Offer a safe teether",
      uk: "Запропонувати безпечний прорізувач",
      es: "Ofrecer un mordedor seguro",
    },
    description: {
      en: "Once a day, offer a soft age‑appropriate teether, letting your baby explore it with the mouth for a short time.",
      uk: "Раз на день пропонуйте мʼякий прорізувач за віком, дозволяючи малюку недовго досліджувати його ротиком.",
      es: "Una vez al día, ofrece un mordedor suave adecuado a su edad y deja que tu bebé lo explore con la boca durante un rato.",
    },
  },

  // WEEK 10
  {
    month: 3,
    weekIndex: 2,
    order: 19,
    slug: "week10-room-tour",
    accessLevel: "free",
    category: "play",
    title: {
      en: "Slow ‘room tour’ on arms",
      uk: "Повільна «екскурсія кімнатою» на руках",
      es: "Lenta «visita por la habitación» en brazos",
    },
    description: {
      en: "Carry your baby around the room for a few minutes, stopping at the window, plants, or pictures and quietly naming what you see.",
      uk: "Понесіть малюка по кімнаті на кілька хвилин, зупиняючись біля вікна, рослин чи картинок і тихо називаючи те, що бачите.",
      es: "Lleva a tu bebé por la habitación durante unos minutos, deteniéndote en la ventana, plantas o cuadros y nombrando en voz baja lo que ves.",
    },
  },
  {
    month: 3,
    weekIndex: 2,
    order: 20,
    slug: "week10-toy-switch",
    accessLevel: "free",
    category: "play",
    title: {
      en: "Switch toy positions",
      uk: "Поміняти місця іграшок",
      es: "Cambiar la posición de los juguetes",
    },
    description: {
      en: "Move hanging toys or mobiles to the opposite side of the crib or play area to encourage turning the head in both directions.",
      uk: "Перемістіть підвішені іграшки чи мобіль на протилежний бік ліжечка або зони гри, щоб заохочувати повороти голови в обидва боки.",
      es: "Mueve los móviles o juguetes colgantes al lado opuesto de la cuna o zona de juego para animar a tu bebé a girar la cabeza hacia ambos lados.",
    },
  },
];

// ---------- SEED FUNCTIONS ----------

export async function seedArticlesOnce() {
  const colRef = collection(db, "articles");
  for (const art of articlesSeed) {
    await addDoc(colRef, art);
  }
  // console.log("Seeded articles:", articlesSeed.length);
}

export async function seedTasksOnce() {
  const colRef = collection(db, "tasks");
  for (const task of tasksSeed) {
    await addDoc(colRef, task);
  }
  // console.log("Seeded tasks:", tasksSeed.length);
}
