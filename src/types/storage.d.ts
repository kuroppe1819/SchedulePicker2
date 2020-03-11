import { ContextMenuDayId } from './contextmenu';

export type UserSetting = {
    specifiedDate: Date | undefined;
    filterSetting: FilterSetting;
    isPostMarkdown: boolean;
    templateText: string;
};

export type StorageItem = {
    specifiedDateStr: string | undefined;
    isIncludePrivateEvent: boolean;
    isIncludeAllDayEvent: boolean;
    isPostMarkdown: boolean;
    templateText: string | undefined;
};

export type FilterSetting = {
    isIncludePrivateEvent: boolean;
    isIncludeAllDayEvent: boolean;
};

export const enum StorageKeys {
    SPECIFIED_DATE_STR = 'specifiedDateStr',
    IS_INCLUDE_PRIVATE_EVENT = 'isIncludePrivateEvent',
    IS_INCLUDE_ALL_DAY_EVENT = 'isIncludeAllDayEvent',
    IS_POST_MARKDOWN = 'isPostMarkdown',
    TEMPLATE_TEXT = 'templateText',
}
