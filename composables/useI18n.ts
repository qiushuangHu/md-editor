import { locale, setLocale, toggleLocale, t } from "~/i18n";

export const useI18n = () => ({ t, locale, setLocale, toggleLocale });
