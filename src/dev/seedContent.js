// src/dev/seedContent.js
import { collection, addDoc } from "firebase/firestore";
import { db } from "../services/firebaseConfig";

// 4 статті для 1-го тижня, 1-й місяць
const articlesSeed = [
  {
    month: 1,
    weekIndex: 1,
    order: 1,
    category: "development",
    accessLevel: "free",
    slug: "week1-development-tummy-time",
    title: {
      en: "Week 1 • Development: First tummy time",
      uk: "1 тиждень • Розвиток: перший час на животику",
      es: "Semana 1 • Desarrollo: primer tummy time",
    },
    summary: {
      en: "Short tummy time sessions to start strengthening neck and shoulders.",
      uk: "Короткі сесії на животику, щоб почати зміцнювати шию та плечі.",
      es: "Sesiones breves de tummy time para empezar a fortalecer cuello y hombros.",
    },
    content: {
      en: "From the very first week, a few minutes of tummy time each day help your baby strengthen neck, shoulder, and core muscles. Place your baby on a firm surface or on your chest while you lie back. Start with 2–3 minutes once or twice a day and stop if your baby becomes too upset.",
      uk: "Вже з першого тижня кілька хвилин на животику щодня допомагають малюку зміцнювати мʼязи шиї, плечей та корпусу. Покладіть дитину на тверду поверхню або собі на груди, коли ви напівлежите. Почніть із 2–3 хвилин 1–2 рази на день і зупиніться, якщо малюк надто засмучується.",
      es: "Desde la primera semana, unos minutos de tummy time al día ayudan a tu bebé a fortalecer los músculos del cuello, los hombros y el tronco. Coloca al bebé sobre una superficie firme o sobre tu pecho mientras te recuestas. Empieza con 2–3 minutos una o dos veces al día y detente si tu bebé se molesta demasiado.",
    },
  },
  {
    month: 1,
    weekIndex: 1,
    order: 2,
    category: "psychology",
    accessLevel: "free",
    slug: "week1-psychology-safe-contact",
    title: {
      en: "Week 1 • Psychology: Feeling safe with you",
      uk: "1 тиждень • Психологія: відчувати себе в безпеці з вами",
      es: "Semana 1 • Psicología: sentirse seguro contigo",
    },
    summary: {
      en: "How eye contact, voice and touch help your baby calm down.",
      uk: "Як зоровий контакт, голос і дотики допомагають малюку заспокоїтися.",
      es: "Cómo el contacto visual, la voz y el tacto ayudan a calmar a tu bebé.",
    },
    content: {
      en: "Your face, voice, and hands are the main source of safety right now. Hold your baby close, speak calmly, and look into their eyes for a few seconds at a time. When your baby turns the head away, it is a sign they need a short break from stimulation.",
      uk: "Ваше обличчя, голос і руки — головне джерело безпеки для немовляти зараз. Тримайте малюка близько, говоріть спокійно й дивіться в очі по кілька секунд. Коли дитина відвертає голову, це сигнал, що їй потрібна коротка пауза від стимуляції.",
      es: "Tu rostro, tu voz y tus manos son la principal fuente de seguridad en este momento. Mantén a tu bebé cerca, habla con calma y mira a sus ojos durante unos segundos. Cuando gire la cabeza, es señal de que necesita una breve pausa de estimulación.",
    },
  },
  {
    month: 1,
    weekIndex: 1,
    order: 3,
    category: "health",
    accessLevel: "free",
    slug: "week1-health-sleep-on-back",
    title: {
      en: "Week 1 • Health: Safe sleep on the back",
      uk: "1 тиждень • Здоровʼя: безпечний сон на спині",
      es: "Semana 1 • Salud: sueño seguro boca arriba",
    },
    summary: {
      en: "Why sleeping on the back is safest in the first months.",
      uk: "Чому сон на спині є найбезпечнішим у перші місяці.",
      es: "Por qué dormir boca arriba es la opción más segura en los primeros meses.",
    },
    content: {
      en: "For every sleep, day and night, place your baby on the back on a firm mattress without pillows or heavy blankets. This position reduces the risk of SIDS. Tummy time is only for awake periods under your supervision.",
      uk: "Для кожного сну, вдень і вночі, кладіть малюка на спину на жорсткий матрац без подушок і важких ковдр. Таке положення зменшує ризик синдрому раптової дитячої смерті. Час на животику — тільки для періодів неспання під вашим наглядом.",
      es: "Para cada sueño, de día y de noche, coloca a tu bebé boca arriba sobre un colchón firme, sin almohadas ni mantas pesadas. Esta posición reduce el riesgo de SMSL. El tummy time es solo para cuando esté despierto y bajo tu supervisión.",
    },
  },
  {
    month: 1,
    weekIndex: 1,
    order: 4,
    category: "play",
    accessLevel: "free",
    slug: "week1-play-soft-greetings",
    title: {
      en: "Week 1 • Play: Soft greetings",
      uk: "1 тиждень • Гра: мʼякі привітання",
      es: "Semana 1 • Juego: saludos suaves",
    },
    summary: {
      en: "Simple playful rituals for the first days at home.",
      uk: "Прості ігрові ритуали для перших днів удома.",
      es: "Rituales de juego sencillos para los primeros días en casa.",
    },
    content: {
      en: "Choose a short phrase you repeat every time you pick your baby up, like “Hi, it’s mum again”. Use a calm, sing‑song voice. This predictability helps your baby learn that good things happen when they hear your voice.",
      uk: "Оберіть коротку фразу, яку повторюватимете щоразу, коли берете малюка на руки, наприклад: «Привіт, це знову мама». Говоріть спокійним, трохи співучим голосом. Така передбачуваність допомагає дитині вчитися, що приємні речі повʼязані з вашим голосом.",
      es: "Elige una frase corta que repitas cada vez que coges a tu bebé en brazos, como «Hola, soy mamá otra vez». Usa una voz calmada y ligeramente cantada. Esta previsibilidad le ayuda a aprender que cosas buenas pasan cuando escucha tu voz.",
    },
  },
];

export async function seedArticlesOnce() {
  const colRef = collection(db, "articles");
  for (const art of articlesSeed) {
    await addDoc(colRef, art);
  }
  console.log("Seeded articles:", articlesSeed.length);
}
