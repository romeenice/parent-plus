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
home_month_subtitle: "Your child is {{age}} old.",

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

//home
"home_feed_title": "Articles feed",
  "home_this_week_new_articles": "New articles this week",
  "home_this_week_new_articles_subtitle": "See what is new and useful for you and your baby.",
  "home_feed_filter_all": "All",
  "home_feed_filter_development": "Development",
  "home_feed_filter_psychology": "Psychology",
  "home_feed_filter_health": "Health",
  "home_feed_filter_play": "Play",
  "home_category_label_development": "Development",
  "home_category_label_psychology": "Psychology",
  "home_category_label_health": "Health",
  "home_category_label_play": "Play",
  "home_category_label_general": "Article",
  "home_week_label": "Week {{week}}",
  "home_new_articles_title": "New articles",
  "home_read_articles_title": "Read articles",
  "home_no_new_articles": "There are no new articles right now. You’ve seen everything 👏",
  "home_no_read_articles": "You haven’t read any articles for this period yet.",
  "home_article_status_new": "New",
  "home_article_status_read": "Read",
  "home_new_articles_in": "New articles coming in {{days}} days",
  "tasks_new_tasks_in": "New tasks coming in {{days}} days",
  "theme_pastel_pink": "Pastel Pink",
"theme_depressive_grey": "Depressive Grey",
"theme_cosmic_dust": "Cosmic Dust",
"home_previous_weeks_title": "Previous weeks",
 month: "month",
    months: "months",
    year: "year",
    years: "years",
    and: "and",
   categories: {
      psychology: "Psychology",
      health: "Health",
      development: "Development",
      play: "Play"
    },
    "settings_help_title": "Help & Support",
"help_name_placeholder": "Your name",
"help_message_placeholder": "Describe your issue...",
"help_send_button": "Send",
"help_fill_all_fields": "Please fill in all fields",
"help_sent_success": "Thank you! Your message has been sent",
"help_sent_error": "Error sending message. Please try again",
"common_sending": "Sending...",
"success": "Success",
"error": "Error",
"auth_google_signin": "Continue with Google",
  "auth_google_signin_failed": "Failed to sign in with Google",
  "auth_or": "OR",
   "onboarding_skip": "Skip",
  "onboarding_next": "Next",
  "onboarding_get_started": "Get Started",
  
  "onboarding_slide1_title": "Welcome to Parents+",
  "onboarding_slide1_description": "Your personal assistant for baby care. Get weekly articles and tips tailored to your child's age.",
  
  "onboarding_slide2_title": "Helpful Weekly Articles",
  "onboarding_slide2_description": "Learn about development, health, and psychology. Everything adapted to your baby's current age.",
  
  "onboarding_slide3_title": "Tasks & Reminders",
  "onboarding_slide3_description": "Don't miss important moments: doctor visits, vaccinations, developmental milestones.",
   "onboarding_slide1_title": "Weekly Parenting Guide",
  "onboarding_slide1_description": "Get personalized articles about development, health, and psychology tailored to your baby's age.",
  
  "onboarding_feature1_articles": "Expert articles every week",
  "onboarding_feature1_categories": "4 categories: psychology, health, development, play",
  "onboarding_feature1_languages": "3 languages: Ukrainian, English, Spanish",
  
  "onboarding_slide2_title": "Never Miss Important Moments",
  "onboarding_slide2_description": "Keep track of doctor visits, vaccinations, and important developmental milestones for your child.",
  
  "onboarding_feature2_reminders": "Tasks and reminders",
  "onboarding_feature2_checkups": "Medical checkup tracking",
  "onboarding_feature2_milestones": "Baby development calendar",
  
  "onboarding_slide3_title": "Track Your Baby's Journey",
  "onboarding_slide3_description": "Personalized experience for your family. Everything you need to know about your child's first years.",
  
  "onboarding_feature3_tracking": "Milestone tracking",
  "onboarding_feature3_personalized": "Personalized content and themes",
  "onboarding_feature3_private": "Private and secure data",
  "auth_name_label": "Name",
"auth_name_placeholder": "Enter your name",
"auth_name_placeholder": "Enter your name",
"createAccount": "Create your account",
"welcomeBack": "Welcome back",
"auth_google_signin": "Continue with Google",
"auth_or": "OR",
"signUp": "Sign Up",
"signIn": "Sign In",
"alreadyHaveAccount": "Already have an account? Sign In",
"dontHaveAccount": "Don't have an account? Sign Up",
"loading": "Loading...",
"errorFillFields": "Please fill in all fields",
"errorEnterName": "Please enter your name",
"unavailableInExpoGo": "Unavailable in Expo Go",
"googleSignInExpoGoMessage": "Google Sign-In only works in built APK. Use email/password for testing in Expo Go.",

  "onboarding_skip": "Skip",
  "onboarding_next": "Next",
  "onboarding_continue_to_paywall": "Continue",

  "onboarding_slide1_title": "Parenting is hard enough without guessing every week",
  "onboarding_slide1_description": "When your baby is growing fast, it is easy to wonder if you are doing enough, focusing on the right things, or missing something important. Parents+ helps reduce that stress by turning uncertainty into clear, simple guidance.",
  "onboarding_slide1_feature1": "Stop searching through random advice and trying to figure out what matters right now.",
  "onboarding_slide1_feature2": "Feel more confident about what your child may need at this stage.",
  "onboarding_slide1_feature3": "Get calm, practical support instead of information overload.",

  "onboarding_slide2_title": "Your child changes quickly, and the right support changes too",
  "onboarding_slide2_description": "A newborn, a 4-month-old, and a 1-year-old need completely different support. That is why generic parenting content often feels overwhelming or irrelevant. Parents+ helps you focus on what fits your child now.",
  "onboarding_slide2_feature1": "Age-based content that follows your child’s current week or month.",
  "onboarding_slide2_feature2": "Topics that match real parenting needs as your child grows.",
  "onboarding_slide2_feature3": "More relevant guidance, less noise and confusion.",

  "onboarding_slide3_title": "Get clear weekly guidance you can actually use",
  "onboarding_slide3_description": "Instead of endless reading, Parents+ gives you simple, useful ideas you can apply in real life. Each week is designed to feel manageable, supportive, and realistic for busy parents.",
  "onboarding_slide3_feature1": "Helpful articles written in a simple, easy-to-follow way.",
  "onboarding_slide3_feature2": "Weekly tasks you can try at home without overcomplicating your routine.",
  "onboarding_slide3_feature3": "Practical advice that feels supportive, not overwhelming.",

  "onboarding_slide4_title": "Everything adapts to your child’s age",
  "onboarding_slide4_description": "Parents+ is built around your child’s stage of development. As your baby grows, the app updates the content so you keep seeing what is most useful right now.",
  "onboarding_slide4_feature1": "Personalized content based on your child’s birth date.",
  "onboarding_slide4_feature2": "Weekly and monthly progress that changes as your child grows.",
  "onboarding_slide4_feature3": "A more personal experience that feels made for your family.",

  "onboarding_slide5_title": "Less overwhelm, more confidence",
  "onboarding_slide5_description": "You do not need to do everything perfectly. You just need the right next step. Parents+ helps you feel more prepared, more informed, and more confident in the small things that matter every day.",
  "onboarding_slide5_feature1": "Know what to focus on this week instead of guessing.",
  "onboarding_slide5_feature2": "Build small, meaningful routines with your child.",
  "onboarding_slide5_feature3": "Feel supported in development, emotions, health, and play.",

  "onboarding_slide6_title": "Unlock the full Parents+ experience",
  "onboarding_slide6_description": "With Premium, you get the complete experience: more guidance, more practical weekly support, and more personalized content designed to grow with your child. It is not just more content — it is a clearer parenting plan.",
  "onboarding_slide6_feature1": "Full access to weekly tasks and the complete content feed.",
  "onboarding_slide6_feature2": "Topics across development, psychology, health, and play.",
  "onboarding_slide6_feature3": "A more guided experience designed for real everyday parenting.",
  "onboarding_slide6_feature4": "Continue to see the plan that fits your child as they grow.",

paywall_title: "Upgrade to Parents+ Pro",
paywall_subtitle: "Unlock premium access and continue setting up your family space.",
paywall_feature_1: "Access all premium parenting tools",
paywall_feature_2: "Create and manage your child profiles",
paywall_feature_3: "Use personalized family planning features",
paywall_loading: "Loading plans...",
paywall_no_plans_title: "No plans found",
paywall_no_plans_message: "We couldn't load subscription plans right now. Please try again.",
paywall_retry: "Try again",
paywall_choose_plan: "Choose plan",
paywall_restore: "Restore purchases",
paywall_restoring: "Restoring...",
paywall_monthly: "Monthly plan",
paywall_yearly: "Yearly plan",
paywall_lifetime: "Lifetime access",
paywall_plan: "Subscription plan",
paywall_success_title: "Success",
paywall_success_message: "Your subscription is now active.",
paywall_inactive_title: "Subscription not active",
paywall_inactive_message: "The purchase finished, but access is not active yet.",
paywall_error_title: "Error",
paywall_purchase_error: "Could not complete the purchase.",
paywall_restore_success_title: "Restored",
paywall_restore_success_message: "Your subscription has been restored.",
paywall_restore_empty_title: "Nothing to restore",
paywall_restore_empty_message: "No active purchases were found.",
paywall_restore_error: "Could not restore purchases.",
"paywall_best_value": "Best value",
  "paywall_most_flexible": "Most flexible",
  "paywall_one_time": "One-time purchase",
  "paywall_continue_without_subscription": "Continue without subscription"


    },
    
    
  },
  uk: {
    translation: {
      // uk
profile_title: "Профіль",
common_loading: "Завантаження...",
common_cancel: "Скасувати",
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
home_month_subtitle: "Вашій дитині {{age}}.",

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
 //home
 "home_feed_title": "Стрічка статей",
  "home_this_week_new_articles": "Нові статті цього тижня",
  "home_this_week_new_articles_subtitle": "Перегляньте, що корисного зʼявилося для вас і малюка.",
  "home_feed_filter_all": "Усі",
  "home_feed_filter_development": "Розвиток",
  "home_feed_filter_psychology": "Психологія",
  "home_feed_filter_health": "Здоровʼя",
  "home_feed_filter_play": "Гра",
  "home_category_label_development": "Розвиток",
  "home_category_label_psychology": "Психологія",
  "home_category_label_health": "Здоровʼя",
  "home_category_label_play": "Гра",
  "home_category_label_general": "Стаття",
  "home_week_label": "{{week}} тиждень",
  "home_new_articles_title": "Нові статті",
  "home_read_articles_title": "Прочитані статті",
  "home_no_new_articles": "Наразі немає нових статей. Ви все переглянули 👏",
  "home_no_read_articles": "Ви ще не прочитали жодної статті за цей період.",
  "home_article_status_new": "Нове",
  "home_article_status_read": "Прочитано",
  "home_new_articles_in": "До нових статей залишилось {{days}} днів",
  "tasks_new_tasks_in": "До нових завдань залишилось {{days}} днів",
  "theme_pastel_pink": "Пастельний рожевий",
"theme_depressive_grey": "Депресивний сірий",
"theme_cosmic_dust": "Космічний порошок",
"home_previous_weeks_title": "Попередні тижні",
 month: "місяць",
    months: "місяці",
    year: "рік",
    years: "років",
    and: "і",
   categories: {
      psychology: "Психологія",
      health: "Здоров'я",
      development: "Розвиток",
      play: "Гра"
    },
    "settings_help_title": "Допомога та підтримка",
"help_name_placeholder": "Ваше ім'я",
"help_message_placeholder": "Опишіть проблему...",
"help_send_button": "Відправити",
"help_fill_all_fields": "Будь ласка, заповніть усі поля",
"help_sent_success": "Дякуємо! Ваше повідомлення відправлено",
"help_sent_error": "Помилка відправки. Спробуйте ще раз",
"common_sending": "Відправлення...",
"success": "Успіх",
"error": "Помилка",
"auth_google_signin": "Увійти через Google",
  "auth_google_signin_failed": "Не вдалося увійти через Google",
  "auth_or": "АБО",
   "onboarding_skip": "Пропустити",
  "onboarding_next": "Далі",
  "onboarding_continue_to_paywall": "Продовжити",

  "onboarding_slide1_title": "Батьківство і так складне, щоб ще щотижня гадати",
  "onboarding_slide1_description": "Коли дитина швидко росте, легко постійно сумніватися: чи ви робите достатньо, чи звертаєте увагу на правильні речі, чи не пропускаєте щось важливе. Parents+ допомагає зменшити цей стрес і перетворює невизначеність на зрозумілі, прості підказки.",
  "onboarding_slide1_feature1": "Менше випадкових порад з інтернету і менше відчуття, що ви губитесь у великій кількості інформації.",
  "onboarding_slide1_feature2": "Більше впевненості в тому, що саме зараз може бути важливим для вашої дитини.",
  "onboarding_slide1_feature3": "Спокійна, практична підтримка замість перевантаження інформацією.",

  "onboarding_slide2_title": "Дитина швидко змінюється, і правильна підтримка теж",
  "onboarding_slide2_description": "Новонароджена дитина, малюк у 4 місяці та дитина у 1 рік мають зовсім різні потреби. Саме тому загальні поради для батьків часто здаються або занадто хаотичними, або зовсім неактуальними. Parents+ допомагає зосередитися на тому, що підходить саме зараз.",
  "onboarding_slide2_feature1": "Контент, який підлаштовується під поточний тиждень або місяць вашої дитини.",
  "onboarding_slide2_feature2": "Теми, які відповідають реальним потребам батьків на кожному етапі росту.",
  "onboarding_slide2_feature3": "Більше корисних порад і менше шуму та плутанини.",

  "onboarding_slide3_title": "Отримуйте чіткі щотижневі підказки, які реально можна використати",
  "onboarding_slide3_description": "Замість нескінченного читання Parents+ дає прості та корисні ідеї, які легко застосувати в реальному житті. Кожен тиждень створений так, щоб підтримка була зрозумілою, посильною та реальною для зайнятих батьків.",
  "onboarding_slide3_feature1": "Корисні статті, написані простою і зрозумілою мовою.",
  "onboarding_slide3_feature2": "Щотижневі завдання, які можна легко спробувати вдома.",
  "onboarding_slide3_feature3": "Практичні поради, які підтримують, а не перевантажують.",

  "onboarding_slide4_title": "Усе підлаштовується під вік вашої дитини",
  "onboarding_slide4_description": "Parents+ побудований навколо етапу розвитку вашої дитини. У міру того як малюк росте, додаток оновлює контент, щоб ви завжди бачили те, що найбільш актуально саме зараз.",
  "onboarding_slide4_feature1": "Персоналізований контент на основі дати народження дитини.",
  "onboarding_slide4_feature2": "Щотижневий і щомісячний прогрес, який змінюється разом із ростом дитини.",
  "onboarding_slide4_feature3": "Більш особистий досвід, ніби додаток створений саме для вашої сім’ї.",

  "onboarding_slide5_title": "Менше перевантаження, більше впевненості",
  "onboarding_slide5_description": "Вам не потрібно робити все ідеально. Потрібно лише розуміти правильний наступний крок. Parents+ допомагає почуватися більш підготовлено, більш спокійно та впевнено в маленьких щоденних речах, які справді мають значення.",
  "onboarding_slide5_feature1": "Розумійте, на чому краще зосередитися цього тижня, а не вгадуйте.",
  "onboarding_slide5_feature2": "Формуйте маленькі, але важливі щоденні звички разом із дитиною.",
  "onboarding_slide5_feature3": "Отримуйте підтримку в розвитку, емоціях, здоров’ї та грі.",

  "onboarding_slide6_title": "Відкрийте повний досвід Parents+",
  "onboarding_slide6_description": "З Premium ви отримуєте повний досвід: більше підказок, більше практичної щотижневої підтримки та більше персоналізованого контенту, який росте разом із вашою дитиною. Це не просто більше матеріалів — це більш зрозумілий батьківський план.",
  "onboarding_slide6_feature1": "Повний доступ до щотижневих завдань і всього контенту.",
  "onboarding_slide6_feature2": "Теми про розвиток, психологію, здоров’я та гру.",
  "onboarding_slide6_feature3": "Більш структурований досвід, створений для реального повсякденного батьківства.",
  "onboarding_slide6_feature4": "Продовжуйте бачити план, який відповідає віку і потребам вашої дитини.",

  "auth_name_label": "Ім'я",
"auth_name_placeholder": "Введіть ваше ім'я",
"auth_name_placeholder": "Введіть ваше ім'я",
"createAccount": "Створити акаунт",
"welcomeBack": "Вітаємо знову",
"auth_google_signin": "Увійти через Google",
"auth_or": "АБО",
"signUp": "Зареєструватися",
"signIn": "Увійти",
"alreadyHaveAccount": "Вже є акаунт? Увійти",
"dontHaveAccount": "Немає акаунту? Зареєструватися",
"loading": "Завантаження...",
"errorFillFields": "Будь ласка, заповніть всі поля",
"errorEnterName": "Будь ласка, введіть ваше ім'я",
"unavailableInExpoGo": "Недоступно в Expo Go",
"googleSignInExpoGoMessage": "Google Sign-In працює тільки в зібраному APK. Використовуйте email/password для тестування.",

// Onboarding Slide 1
"onboarding_slide1_title": "Щотижневі статті для батьків",
"onboarding_slide1_description": "Кожної неділі ви отримуєте 4 нові експертні статті про розвиток, здоров'я, психологію та ігри — адаптовані під поточний вік вашої дитини.",
"onboarding_feature1_articles": "Нові статті кожної неділі",
"onboarding_feature1_categories": "4 категорії: розвиток, здоров'я, психологія, ігри",
"onboarding_feature1_languages": "Контент на 3 мовах: українська, англійська, іспанська",

// Onboarding Slide 2
"onboarding_slide2_title": "Завдання для розвитку дитини",
"onboarding_slide2_description": "Виконуйте щотижневі практичні завдання та краще розумійте що потрібно вашій дитині на кожному етапі її розвитку.",
"onboarding_feature2_reminders": "Практичні поради та завдання щотижня",
"onboarding_feature2_checkups": "Нагадування про важливі візити до лікаря",
"onboarding_feature2_milestones": "Відстеження етапів розвитку малюка",

// Onboarding Slide 3
"onboarding_slide3_title": "Все для вашої зручності",
"onboarding_slide3_description": "Застосунок створений з думкою про батьків. Налаштуйте все під себе та отримайте найкращий досвід користування.",
"onboarding_feature3_languages": "3 мови інтерфейсу на вибір",
"onboarding_feature3_themes": "8 тем оформлення під різний настрій",
"onboarding_feature3_multiple_children": "Додавайте кілька дітей в один профіль",
"onboarding_feature3_notifications": "Розумні сповіщення та нагадування",
"onboarding_feature3_support": "Швидкий зв'язок з підтримкою 24/7",

 "paywall_title": "Спробуйте Parents+ Pro безкоштовно 30 днів",
  "paywall_subtitle": "Відкрийте повний доступ до персоналізованих матеріалів, щотижневих завдань і функцій для батьків. Скасувати підписку можна будь-коли.",
  "paywall_feature_1": "Персоналізовані статті та поради під вік вашої дитини",
  "paywall_feature_2": "Щотижневі завдання та прості ідеї для використання вдома",
  "paywall_feature_3": "Повний доступ до матеріалів про розвиток, гру, здоров’я та емоції",
  "paywall_feature_4": "Керуйте профілями дітей і сімейним досвідом в одному місці",
  "paywall_trial_badge": "30 днів безкоштовно",
  "paywall_cancel_anytime": "Скасувати можна будь-коли",
  "paywall_plan_button": "Почати 30 днів безкоштовно",
  "paywall_footer_note": "30 днів безкоштовно, далі — автоматичне продовження за обраним тарифом. Скасувати можна будь-коли в налаштуваннях App Store або Google Play.",
  "paywall_restore": "Відновити покупки",
  "paywall_best_value": "Найвигідніше",
  "paywall_most_flexible": "Найгнучкіший варіант",
  "paywall_one_time": "Разова покупка",
  "paywall_continue_without_subscription": "Продовжити без підписки"


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
home_month_subtitle: "Tu hijo tiene  {{age}}.",

home_section_development_title: "Desarrollo",
home_section_development_description: "Lo que tu bebé está aprendiendo este mes.",
home_section_psychology_title: "Psicología",
home_section_psychology_description: "Emociones, apego y comportamiento.",
home_section_health_title: "Salud",
home_section_health_description: "Sueño, alimentación, salud y seguridad.",
home_section_play_title: "Juego",
home_section_play_description: "Juegos y actividades para esta edad.",

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

 //home
 "home_feed_title": "Feed de artículos",
  "home_this_week_new_articles": "Artículos nuevos de esta semana",
  "home_this_week_new_articles_subtitle": "Descubre qué hay de nuevo y útil para ti y tu bebé.",
  "home_feed_filter_all": "Todos",
  "home_feed_filter_development": "Desarrollo",
  "home_feed_filter_psychology": "Psicología",
  "home_feed_filter_health": "Salud",
  "home_feed_filter_play": "Juego",
  "home_category_label_development": "Desarrollo",
  "home_category_label_psychology": "Psicología",
  "home_category_label_health": "Salud",
  "home_category_label_play": "Juego",
  "home_category_label_general": "Artículo",
  "home_week_label": "Semana {{week}}",
  "home_new_articles_title": "Artículos nuevos",
  "home_read_articles_title": "Artículos leídos",
  "home_no_new_articles": "Por ahora no hay artículos nuevos. Ya lo has visto todo 👏",
  "home_no_read_articles": "Todavía no has leído ningún artículo de este período.",
  "home_article_status_new": "Nuevo",
  "home_article_status_read": "Leído",
  "home_new_articles_in": "Nuevos artículos en {{days}} días",
  "tasks_new_tasks_in": "Nuevas tareas en {{days}} días",
  "theme_pastel_pink": "Rosa Pastel",
"theme_depressive_grey": "Gris Depresivo",
"theme_cosmic_dust": "Polvo Cósmico",
"home_previous_weeks_title": "Semanas anteriores",
 month: "mes",
    months: "meses",
    year: "año",
    years: "años",
    and: "y",
   categories: {
      psychology: "Psicología",
      health: "Salud",
      development: "Desarrollo",
      play: "Juego"
    },

    "settings_help_title": "Ayuda y soporte",
"help_name_placeholder": "Tu nombre",
"help_message_placeholder": "Describe tu problema...",
"help_send_button": "Enviar",
"help_fill_all_fields": "Por favor, completa todos los campos",
"help_sent_success": "¡Gracias! Tu mensaje ha sido enviado",
"help_sent_error": "Error al enviar el mensaje. Inténtalo de nuevo",
"common_sending": "Enviando...",
"success": "Éxito",
"error": "Error",
"auth_google_signin": "Continuar con Google",
  "auth_google_signin_failed": "Error al iniciar sesión con Google",
  "auth_or": "O",
   "onboarding_skip": "Saltar",
  "onboarding_next": "Siguiente",
  "onboarding_continue_to_paywall": "Continuar",

  "onboarding_slide1_title": "La crianza ya es bastante difícil como para adivinar cada semana",
  "onboarding_slide1_description": "Cuando tu bebé crece tan rápido, es normal preguntarte si estás haciendo lo suficiente, si te estás enfocando en lo correcto o si te estás perdiendo algo importante. Parents+ ayuda a reducir ese estrés y convierte la incertidumbre en una guía clara y sencilla.",
  "onboarding_slide1_feature1": "Deja de buscar consejos al azar y de intentar descubrir qué es lo más importante en este momento.",
  "onboarding_slide1_feature2": "Siéntete con más confianza sobre lo que tu hijo puede necesitar en esta etapa.",
  "onboarding_slide1_feature3": "Recibe apoyo práctico y tranquilo en lugar de demasiada información.",

  "onboarding_slide2_title": "Tu hijo cambia rápido, y la ayuda adecuada también cambia",
  "onboarding_slide2_description": "Un recién nacido, un bebé de 4 meses y un niño de 1 año necesitan apoyos completamente distintos. Por eso el contenido genérico sobre crianza muchas veces se siente abrumador o poco útil. Parents+ te ayuda a enfocarte en lo que realmente encaja con tu hijo ahora.",
  "onboarding_slide2_feature1": "Contenido según la semana o el mes actual de tu hijo.",
  "onboarding_slide2_feature2": "Temas que responden a necesidades reales de crianza a medida que tu hijo crece.",
  "onboarding_slide2_feature3": "Más orientación útil y menos ruido o confusión.",

  "onboarding_slide3_title": "Recibe orientación semanal clara que realmente puedas usar",
  "onboarding_slide3_description": "En lugar de leer sin parar, Parents+ te da ideas simples y útiles que puedes aplicar en la vida real. Cada semana está pensada para sentirse manejable, útil y realista para padres ocupados.",
  "onboarding_slide3_feature1": "Artículos útiles escritos de forma clara y fácil de entender.",
  "onboarding_slide3_feature2": "Tareas semanales que puedes probar en casa sin complicar tu rutina.",
  "onboarding_slide3_feature3": "Consejos prácticos que acompañan y apoyan, en lugar de abrumar.",

  "onboarding_slide4_title": "Todo se adapta a la edad de tu hijo",
  "onboarding_slide4_description": "Parents+ está diseñado en función de la etapa de desarrollo de tu hijo. A medida que tu bebé crece, la app actualiza el contenido para mostrarte lo que más te sirve en este momento.",
  "onboarding_slide4_feature1": "Contenido personalizado según la fecha de nacimiento de tu hijo.",
  "onboarding_slide4_feature2": "Progreso semanal y mensual que cambia junto con su crecimiento.",
  "onboarding_slide4_feature3": "Una experiencia más personal, como si la app hubiera sido hecha para tu familia.",

  "onboarding_slide5_title": "Menos agobio, más confianza",
  "onboarding_slide5_description": "No necesitas hacerlo todo perfecto. Solo necesitas saber cuál es el siguiente paso correcto. Parents+ te ayuda a sentirte más preparado, más informado y más seguro en esas pequeñas cosas diarias que realmente importan.",
  "onboarding_slide5_feature1": "Sabe en qué enfocarte esta semana en lugar de adivinar.",
  "onboarding_slide5_feature2": "Crea pequeñas rutinas valiosas con tu hijo.",
  "onboarding_slide5_feature3": "Recibe apoyo en desarrollo, emociones, salud y juego.",

  "onboarding_slide6_title": "Desbloquea la experiencia completa de Parents+",
  "onboarding_slide6_description": "Con Premium obtienes la experiencia completa: más orientación, más apoyo práctico cada semana y más contenido personalizado que crece junto con tu hijo. No es solo más contenido: es un plan de crianza más claro.",
  "onboarding_slide6_feature1": "Acceso completo a tareas semanales y a todo el contenido.",
  "onboarding_slide6_feature2": "Temas sobre desarrollo, psicología, salud y juego.",
  "onboarding_slide6_feature3": "Una experiencia más guiada, diseñada para la crianza real del día a día.",
  "onboarding_slide6_feature4": "Sigue viendo el plan que se adapta a tu hijo a medida que crece.",

  
  "auth_name_label": "Nombre",
"auth_name_placeholder": "Introduce tu nombre",
"auth_name_placeholder": "Introduce tu nombre",
"createAccount": "Crear cuenta",
"welcomeBack": "Bienvenido de nuevo",
"auth_google_signin": "Continuar con Google",
"auth_or": "O",
"signUp": "Registrarse",
"signIn": "Iniciar sesión",
"alreadyHaveAccount": "¿Ya tienes cuenta? Iniciar sesión",
"dontHaveAccount": "¿No tienes cuenta? Registrarse",
"loading": "Cargando...",
"errorFillFields": "Por favor, completa todos los campos",
"errorEnterName": "Por favor, introduce tu nombre",
"unavailableInExpoGo": "No disponible en Expo Go",
"googleSignInExpoGoMessage": "Google Sign-In solo funciona en APK compilado. Usa email/password para probar en Expo Go.",


"paywall_title": "Prueba Parents+ Pro gratis durante 30 días",
  "paywall_subtitle": "Obtén acceso completo a contenido personalizado, tareas semanales y herramientas premium para padres. Cancela en cualquier momento.",
  "paywall_feature_1": "Artículos y orientación personalizados según la edad de tu hijo",
  "paywall_feature_2": "Tareas semanales e ideas simples para usar en casa",
  "paywall_feature_3": "Acceso completo a contenido sobre desarrollo, juego, salud y emociones",
  "paywall_feature_4": "Gestiona los perfiles de tus hijos y la experiencia familiar en un solo lugar",
  "paywall_trial_badge": "30 días gratis",
  "paywall_cancel_anytime": "Cancela cuando quieras",
  "paywall_plan_button": "Comenzar 30 días gratis",
  "paywall_footer_note": "30 días gratis y luego se renueva automáticamente con el plan elegido. Puedes cancelar en cualquier momento desde App Store o Google Play.",
  "paywall_restore": "Restaurar compras",
   "paywall_best_value": "Mejor opción",
  "paywall_most_flexible": "Más flexible",
  "paywall_one_time": "Pago único",
  "paywall_continue_without_subscription": "Continuar sin suscripción"

    },
  },
};

export async function initI18n(initialLanguage) {
  const fallback = "en";
  const deviceLang = Localization.getLocales()[0]?.languageCode || fallback;

  await i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: initialLanguage || deviceLang,
      fallbackLng: fallback,
      interpolation: { escapeValue: false },
    });

  return i18n;
}

export default i18n;
