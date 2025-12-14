import {getRussianPluralForm} from "@/shared/utils/getRussianPluralForm.ts";


export const getPluralKey = (count: number, lang: string, type: 'day' | 'month') => {
    if (lang === 'en') {
        return count === 1 ? `date.${type}Ago` : `date.${type}sAgo`;
    }

    if (lang === 'ru') {
        return getRussianPluralForm(count, type);
    }
    return `date.${type}sAgo`
};