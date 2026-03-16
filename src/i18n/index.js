// src/i18n/index.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";

// тут будуть наші тексти для 3 мов
const resources = {
  en: {
    translation: {
     // en
profile_title: "Profile",
common_loading: "Loading...",
common_cancel: "Cancel",

current_child_age: "{{age}} old",
current_child_age_not_set: "Age not set yet.",
add_another_child: "Add another child",

children_section_title: "Children",
birthdate_not_set: "Birth date not set",
delete_child_button: "Delete",

delete_child_title: "Delete child",
delete_child_message: "Are you sure you want to delete {{name}}?",
delete_child_fallback_name: "this child",
delete_child_confirm: "Delete",

settings_section_title: "Settings",
settings_notifications_title: "Notifications",
settings_notifications_subtitle: "Daily reminders & updates",
settings_theme_title: "App Theme",
settings_theme_value: "Pastel Pink",

settings_language_title: "Language",
settings_language_placeholder: "Select language",

settings_help_title: "Help & Support",
settings_premium_title: "Premium+",
settings_premium_subtitle: "Extra content & features",

premium_title: "Premium+ coming soon",
premium_message: "Unlock extra content, expert tips and more. Stay tuned!",

logout_button: "Log Out",

language_change_title: "Change language?",
language_change_message: "You may need to reload some screens to see all texts updated.",
language_change_confirm: "Change",

add_child_header_edit: "Edit Child",
add_child_header_add: "Add Child",

add_child_step_text: "Step 2 of 5",

add_child_hero_title_edit: "Update your child details",
add_child_hero_title_add: "Tell us about your child",
add_child_hero_subtitle: "This helps us personalize your parenting journey.",

add_child_name_label: "Child's Name",
add_child_name_placeholder: "Enter name",

add_child_gender_label: "Gender",
add_child_gender_male: "Male",
add_child_gender_female: "Female",

add_child_birthdate_label: "Birth Date",
add_child_birthdate_placeholder: "Select birth date",

add_child_primary_saving: "Saving...",
add_child_primary_save_changes: "Save changes",
add_child_primary_save_continue: "Save and continue",

add_child_skip: "Skip for now",
app_start_loading: "Loading...",

article_no_data: "No article data.",
article_section_development: "🧠 Development",
article_section_psychology: "💬 Psychology",
article_section_health: "🍎 Health",
article_section_play: "🎲 Play",

auth_header_title: "Welcome back",
auth_header_subtitle: "Sign in to continue your parenting journey.",

auth_tab_login: "Log in",
auth_tab_signup: "Sign up",

auth_email_label: "Email",
auth_email_placeholder: "Enter your email",
auth_password_label: "Password",
auth_password_placeholder: "Enter password",
auth_confirm_password_label: "Confirm password",
auth_confirm_password_placeholder: "Repeat password",

auth_forgot_password_link: "Forgot password?",

auth_primary_loading: "Please wait...",
auth_primary_signup: "Create account",
auth_primary_login: "Log in",

auth_divider_or_continue: "or continue with",
auth_google_button: "Continue with Google",

auth_reset_title: "Reset password",
auth_reset_subtitle:
  "Enter your email and we'll send you a reset link.",
auth_reset_email_placeholder: "Email",
auth_reset_cancel: "Cancel",
auth_reset_send_link: "Send link",

auth_error_fill_all_fields: "Please fill in all fields",
auth_error_passwords_mismatch: "Passwords do not match",
auth_error_invalid_email: "Invalid email address",
auth_error_user_not_found: "User not found",
auth_error_wrong_password: "Wrong password",
auth_error_email_in_use: "Email already in use",
auth_error_weak_password: "Password should be at least 6 characters",
auth_error_generic: "Something went wrong. Please try again.",
auth_error_reset_no_email: "Enter email to reset password",
auth_error_reset_user_not_found: "User with this email not found",
auth_error_reset_generic: "Could not send reset email. Try again.",
auth_error_google: "Could not sign in with Google",

//home screen
home_no_child_text: "No child profile yet.",
home_add_first_child_button: "Add your first child",

home_no_articles_for_age: "There are no articles for this age yet.",

home_this_month_label: "THIS MONTH",
home_month_title_prefix: "Month {{month}}:",
home_month_subtitle: "Your child is about {{age}} old.",

home_section_development_title: "Development",
home_section_development_description: "What your baby is learning this month.",
home_section_psychology_title: "Psychology",
home_section_psychology_description: "Emotions, bonding and behavior.",
home_section_health_title: "Health",
home_section_health_description: "Sleep, feeding, health and safety.",
home_section_play_title: "Play",
home_section_play_description: "Games and activities for this age.",

// OnboardingScreen (English)
onboarding_title_line1: "Every step",
onboarding_title_accent: "together.",
onboarding_subtitle: "Simple monthly tips and tasks for your baby up to 3 years.",
onboarding_continue_button: "Continue",

// TasksScreen (English)
tasks_status_not_started: "Not started",
tasks_status_in_progress: "In progress",
tasks_status_done: "Done",

tasks_previous_tasks: "Previous tasks",
tasks_no_child: "No child profile yet.",

tasks_header_title: "Tasks for {{age}}",
tasks_empty_subtitle:
  "We do not have tasks for this age yet. Check back next week for new tasks or unlock more with Premium.",
tasks_all_done_subtitle:
  "All tasks for this week are completed. Check back next week for new tasks or unlock more with Premium.",
tasks_focus_subtitle:
  "Focusing on small daily actions for your child's growth.",
task_week_label: "Task for week {{week}}",
tasks_done_block_title: "Completed tasks",
tasks_previous_tasks_title: "Previous tasks",

    },
  },
  uk: {
    translation: {
      // uk
profile_title: "Профіль",
common_loading: "Завантаження...",
common_cancel: "Скасувати",

current_child_age: "{{age}}",
current_child_age_not_set: "Вік ще не вказано.",
add_another_child: "Додати ще одну дитину",

children_section_title: "Діти",
birthdate_not_set: "Дата народження не вказана",
delete_child_button: "Видалити",

delete_child_title: "Видалити дитину",
delete_child_message: "Ви впевнені, що хочете видалити {{name}}?",
delete_child_fallback_name: "цю дитину",
delete_child_confirm: "Видалити",

settings_section_title: "Налаштування",
settings_notifications_title: "Сповіщення",
settings_notifications_subtitle: "Щоденні нагадування та оновлення",
settings_theme_title: "Тема застосунку",
settings_theme_value: "Пастельний рожевий",

settings_language_title: "Мова",
settings_language_placeholder: "Оберіть мову",

settings_help_title: "Допомога та підтримка",
settings_premium_title: "Premium+",
settings_premium_subtitle: "Додатковий контент і функції",

premium_title: "Premium+ скоро",
premium_message: "Відкрийте більше контенту, поради експертів та інші фічі. Слідкуйте за оновленнями!",

logout_button: "Вийти",

language_change_title: "Змінити мову?",
language_change_message: "Можливо, доведеться перезавантажити екрани, щоб побачити всі оновлені тексти.",
language_change_confirm: "Змінити",

add_child_header_edit: "Редагувати дитину",
add_child_header_add: "Додати дитину",

add_child_step_text: "Крок 2 з 5",

add_child_hero_title_edit: "Оновіть дані про дитину",
add_child_hero_title_add: "Розкажіть нам про вашу дитину",
add_child_hero_subtitle: "Це допоможе нам персоналізувати ваш батьківський шлях.",

add_child_name_label: "Ім'я дитини",
add_child_name_placeholder: "Введіть ім'я",

add_child_gender_label: "Стать",
add_child_gender_male: "Хлопчик",
add_child_gender_female: "Дівчинка",

add_child_birthdate_label: "Дата народження",
add_child_birthdate_placeholder: "Оберіть дату народження",

add_child_primary_saving: "Зберігаємо...",
add_child_primary_save_changes: "Зберегти зміни",
add_child_primary_save_continue: "Зберегти і продовжити",

add_child_skip: "Пропустити зараз",
app_start_loading: "Завантаження...",

article_no_data: "Немає даних статті.",
article_section_development: "🧠 Розвиток",
article_section_psychology: "💬 Психологія",
article_section_health: "🍎 Здоровʼя",
article_section_play: "🎲 Гра",

auth_header_title: "Раді бачити вас знову",
auth_header_subtitle:
  "Увійдіть, щоб продовжити свою батьківську подорож.",

auth_tab_login: "Увійти",
auth_tab_signup: "Зареєструватися",

auth_email_label: "Електронна пошта",
auth_email_placeholder: "Введіть вашу електронну пошту",
auth_password_label: "Пароль",
auth_password_placeholder: "Введіть пароль",
auth_confirm_password_label: "Підтвердьте пароль",
auth_confirm_password_placeholder: "Повторіть пароль",

auth_forgot_password_link: "Забули пароль?",

auth_primary_loading: "Будь ласка, зачекайте...",
auth_primary_signup: "Створити акаунт",
auth_primary_login: "Увійти",

auth_divider_or_continue: "або продовжити з",
auth_google_button: "Продовжити через Google",

auth_reset_title: "Скидання пароля",
auth_reset_subtitle:
  "Введіть свою електронну пошту, і ми надішлемо посилання для скидання.",
auth_reset_email_placeholder: "Електронна пошта",
auth_reset_cancel: "Скасувати",
auth_reset_send_link: "Надіслати посилання",

auth_error_fill_all_fields: "Будь ласка, заповніть усі поля",
auth_error_passwords_mismatch: "Паролі не збігаються",
auth_error_invalid_email: "Некоректна електронна пошта",
auth_error_user_not_found: "Користувача не знайдено",
auth_error_wrong_password: "Невірний пароль",
auth_error_email_in_use: "Електронна пошта вже використовується",
auth_error_weak_password: "Пароль має містити щонайменше 6 символів",
auth_error_generic: "Щось пішло не так. Спробуйте ще раз.",
auth_error_reset_no_email: "Введіть email, щоб скинути пароль",
auth_error_reset_user_not_found:
  "Користувача з таким email не знайдено",
auth_error_reset_generic:
  "Не вдалося надіслати лист для скидання. Спробуйте ще раз.",
auth_error_google: "Не вдалося увійти через Google",

//home screen
home_no_child_text: "Профіль дитини ще не створено.",
home_add_first_child_button: "Додайте вашу першу дитину",

home_no_articles_for_age: "Поки що немає статей для цього віку.",

home_this_month_label: "ЦЬОГО МІСЯЦЯ",
home_month_title_prefix: "Місяць {{month}}:",
home_month_subtitle: "Вашій дитині приблизно {{age}}.",

home_section_development_title: "Розвиток",
home_section_development_description: "Що ваша дитина вчиться цього місяця.",
home_section_psychology_title: "Психологія",
home_section_psychology_description: "Емоції, прив’язаність та поведінка.",
home_section_health_title: "Здоровʼя",
home_section_health_description: "Сон, годування, здоровʼя та безпека.",
home_section_play_title: "Гра",
home_section_play_description: "Ігри та активності для цього віку.",

// OnboardingScreen (Ukrainian)
onboarding_title_line1: "Кожен крок",
onboarding_title_accent: "разом.",
onboarding_subtitle: "Прості щомісячні поради та завдання для вашої дитини до 3 років.",
onboarding_continue_button: "Продовжити",

// TasksScreen (Ukrainian)
tasks_status_not_started: "Ще не розпочато",
tasks_status_in_progress: "У процесі",
tasks_status_done: "Виконано",

tasks_previous_tasks: "Попередні завдання",
tasks_no_child: "Профіль дитини ще не створено.",

tasks_header_title: "Завдання для {{age}}",
tasks_empty_subtitle:
  "Для цього віку поки немає завдань. Зазирніть наступного тижня або відкрийте більше з Premium.",
tasks_all_done_subtitle:
  "Усі завдання на цей тиждень виконано. Зазирніть наступного тижня або відкрийте більше з Premium.",
tasks_focus_subtitle:
  "Зосереджуємось на маленьких щоденних діях для розвитку вашої дитини.",
task_week_label: "Завдання для {{week}} тижня",
tasks_done_block_title: "Виконані завдання",
 tasks_previous_tasks_title: "Попередні завдання",


    },
  },
  es: {
    translation: {
      // es
profile_title: "Perfil",
common_loading: "Cargando...",
common_cancel: "Cancelar",

current_child_age: "{{age}}",
current_child_age_not_set: "La edad aún no está establecida.",
add_another_child: "Agregar otro niño",

children_section_title: "Niños",
birthdate_not_set: "Fecha de nacimiento no establecida",
delete_child_button: "Eliminar",

delete_child_title: "Eliminar niño",
delete_child_message: "¿Seguro que quieres eliminar a {{name}}?",
delete_child_fallback_name: "este niño",
delete_child_confirm: "Eliminar",

settings_section_title: "Ajustes",
settings_notifications_title: "Notificaciones",
settings_notifications_subtitle: "Recordatorios y actualizaciones diarias",
settings_theme_title: "Tema de la app",
settings_theme_value: "Rosa pastel",

settings_language_title: "Idioma",
settings_language_placeholder: "Selecciona un idioma",

settings_help_title: "Ayuda y soporte",
settings_premium_title: "Premium+",
settings_premium_subtitle: "Contenido y funciones extra",

premium_title: "Premium+ muy pronto",
premium_message: "Desbloquea más contenido, consejos de expertos y mucho más. ¡Muy pronto!",

logout_button: "Cerrar sesión",

language_change_title: "¿Cambiar idioma?",
language_change_message: "Puede que tengas que recargar algunas pantallas para ver todos los textos actualizados.",
language_change_confirm: "Cambiar",
add_child_header_edit: "Editar niño",
add_child_header_add: "Agregar niño",

add_child_step_text: "Paso 2 de 5",

add_child_hero_title_edit: "Actualiza los datos de tu hijo",
add_child_hero_title_add: "Cuéntanos sobre tu hijo",
add_child_hero_subtitle: "Esto nos ayuda a personalizar tu camino como padre.",

add_child_name_label: "Nombre del niño",
add_child_name_placeholder: "Introduce el nombre",

add_child_gender_label: "Género",
add_child_gender_male: "Niño",
add_child_gender_female: "Niña",

add_child_birthdate_label: "Fecha de nacimiento",
add_child_birthdate_placeholder: "Selecciona la fecha de nacimiento",

add_child_primary_saving: "Guardando...",
add_child_primary_save_changes: "Guardar cambios",
add_child_primary_save_continue: "Guardar y continuar",

add_child_skip: "Omitir por ahora",
app_start_loading: "Cargando...",

article_no_data: "No hay datos del artículo.",
article_section_development: "🧠 Desarrollo",
article_section_psychology: "💬 Psicología",
article_section_health: "🍎 Salud",
article_section_play: "🎲 Juego",

auth_header_title: "Bienvenido de nuevo",
auth_header_subtitle:
  "Inicia sesión para continuar tu camino como padre/madre.",

auth_tab_login: "Iniciar sesión",
auth_tab_signup: "Crear cuenta",

auth_email_label: "Correo electrónico",
auth_email_placeholder: "Introduce tu correo electrónico",
auth_password_label: "Contraseña",
auth_password_placeholder: "Introduce tu contraseña",
auth_confirm_password_label: "Confirmar contraseña",
auth_confirm_password_placeholder: "Repite la contraseña",

auth_forgot_password_link: "¿Olvidaste tu contraseña?",

auth_primary_loading: "Por favor espera...",
auth_primary_signup: "Crear cuenta",
auth_primary_login: "Iniciar sesión",

auth_divider_or_continue: "o continúa con",
auth_google_button: "Continuar con Google",

auth_reset_title: "Restablecer contraseña",
auth_reset_subtitle:
  "Introduce tu correo y te enviaremos un enlace para restablecerla.",
auth_reset_email_placeholder: "Correo electrónico",
auth_reset_cancel: "Cancelar",
auth_reset_send_link: "Enviar enlace",

auth_error_fill_all_fields: "Por favor rellena todos los campos",
auth_error_passwords_mismatch: "Las contraseñas no coinciden",
auth_error_invalid_email: "Correo electrónico no válido",
auth_error_user_not_found: "Usuario no encontrado",
auth_error_wrong_password: "Contraseña incorrecta",
auth_error_email_in_use: "El correo ya está en uso",
auth_error_weak_password:
  "La contraseña debe tener al menos 6 caracteres",
auth_error_generic: "Algo salió mal. Inténtalo de nuevo.",
auth_error_reset_no_email:
  "Introduce un correo para restablecer la contraseña",
auth_error_reset_user_not_found:
  "No se encontró un usuario con este correo",
auth_error_reset_generic:
  "No se pudo enviar el correo de restablecimiento. Inténtalo de nuevo.",
auth_error_google: "No se pudo iniciar sesión con Google",

//home screen
home_no_child_text: "Todavía no hay un perfil de niño.",
home_add_first_child_button: "Agrega a tu primer hijo",

home_no_articles_for_age: "Todavía no hay artículos para esta edad.",

home_this_month_label: "ESTE MES",
home_month_title_prefix: "Mes {{month}}:",
home_month_subtitle: "Tu hijo tiene aproximadamente {{age}}.",

home_section_development_title: "Desarrollo",
home_section_development_description: "Lo que tu bebé está aprendiendo este mes.",
home_section_psychology_title: "Psicología",
home_section_psychology_description: "Emociones, apego y comportamiento.",
home_section_health_title: "Salud",
home_section_health_description: "Sueño, alimentación, salud y seguridad.",
home_section_play_title: "Juego",
home_section_play_description: "Juegos y actividades para esta edad.",

// OnboardingScreen (Spanish)
onboarding_title_line1: "Cada paso",
onboarding_title_accent: "juntos.",
onboarding_subtitle: "Consejos y tareas mensuales simples para tu bebé hasta los 3 años.",
onboarding_continue_button: "Continuar",

// TasksScreen (Spanish)
tasks_status_not_started: "No iniciado",
tasks_status_in_progress: "En progreso",
tasks_status_done: "Completado",

tasks_previous_tasks: "Tareas anteriores",
tasks_no_child: "Todavía no hay un perfil de niño.",

tasks_header_title: "Tareas para {{age}}",
tasks_empty_subtitle:
  "Todavía no tenemos tareas para esta edad. Vuelve la próxima semana para ver nuevas tareas o desbloquea más con Premium.",
tasks_all_done_subtitle:
  "Todas las tareas de esta semana están completadas. Vuelve la próxima semana para ver nuevas tareas o desbloquea más con Premium.",
tasks_focus_subtitle:
  "Nos enfocamos en pequeñas acciones diarias para el desarrollo de tu hijo.",
task_week_label: "Tarea para la semana {{week}}",
tasks_done_block_title: "Tareas completadas",
 tasks_previous_tasks_title: "Tareas anteriores",
    },
  },
};

// функція, яку будемо викликати в App.js
export async function initI18n(initialLanguage) {
  const fallback = "en";
  const deviceLang = Localization.getLocales()[0]?.languageCode || fallback;

  await i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: initialLanguage || deviceLang, // мова, з якої стартуємо
      fallbackLng: fallback,
      interpolation: { escapeValue: false },
    });

  return i18n;
}

export default i18n;
