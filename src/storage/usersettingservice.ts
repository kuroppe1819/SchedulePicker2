import { UserSetting } from 'src/types/storage';
import { ContextMenuDayId } from 'src/types/contextmenu';
import { UserSettingLogic, UserSettingLogicImpl } from './usersettinglogic';
import { UserSettingRepositoryImpl } from './usersettingrepository';
import { SpecialTemplateCharactor } from 'src/types/event';

export interface UserSettingService {
    initialDefaultValue(): Promise<void>;
    setUserSetting(setting: UserSetting): Promise<void>;
    getUserSetting(): Promise<UserSetting>;
    setDayId(dayId: ContextMenuDayId): Promise<void>;
    setSpecifiedDate(specifiedDate?: Date): Promise<void>;
    getSpecifiedDate(): Promise<Date | undefined>;
    setTemplateText(templateText?: string): Promise<void>;
    getTemplateText(): Promise<string | undefined>;
}

export class UserSettingServiceImpl implements UserSettingService {
    private static instance: UserSettingService;
    private userSettingLogic: UserSettingLogic;

    constructor(callFunc: Function, userSettingLogic: UserSettingLogic) {
        if (callFunc === UserSettingServiceImpl.getInstance) {
            this.userSettingLogic = userSettingLogic;
            return;
        } else if (UserSettingServiceImpl.instance) {
            throw new Error('instance already exists');
        } else {
            throw new Error('IllegalArgumentException: コンストラクタの引数が不正です');
        }
    }

    public static getInstance(): UserSettingService {
        if (!this.instance) {
            this.instance = new UserSettingServiceImpl(
                UserSettingServiceImpl.getInstance,
                new UserSettingLogicImpl(new UserSettingRepositoryImpl())
            );
        }
        return this.instance;
    }

    public async initialDefaultValue(): Promise<void> {
        const setting = await this.userSettingLogic.getUserSetting();
        await this.userSettingLogic.setUserSetting({
            dayId: setting.dayId || ContextMenuDayId.TODAY,
            specifiedDate: setting.specifiedDate,
            isIncludePrivateEvent: setting.isIncludePrivateEvent || true,
            isIncludeAllDayEvent: setting.isIncludeAllDayEvent || true,
            templateText:
                setting.templateText ||
                `今日の予定を取得できるよ<br>${SpecialTemplateCharactor.SPECIFIED_DAY}<div><br><div>翌営業日の予定を取得できるよ<br>${SpecialTemplateCharactor.NEXT_BUSINESS_DAY}</div><div><br></div><div>前営業日の予定を取得できるよ<br>${SpecialTemplateCharactor.PREVIOUS_BUSINESS_DAY}</div></div>`,
        });
    }

    public async setUserSetting(setting: UserSetting): Promise<void> {
        await this.userSettingLogic.setUserSetting(setting);
    }

    public async getUserSetting(): Promise<UserSetting> {
        return await this.userSettingLogic.getUserSetting();
    }

    public async setDayId(dayId: ContextMenuDayId): Promise<void> {
        await this.userSettingLogic.setDayId(dayId);
    }

    public async setSpecifiedDate(specifiedDate?: Date | undefined): Promise<void> {
        await this.userSettingLogic.setSpecifiedDate(specifiedDate);
    }

    public async getSpecifiedDate(): Promise<Date | undefined> {
        return await this.userSettingLogic.getSpecifiedDate();
    }

    public async setTemplateText(templateText?: string | undefined): Promise<void> {
        await this.userSettingLogic.setTemplateText(templateText);
    }

    public async getTemplateText(): Promise<string | undefined> {
        return await this.userSettingLogic.getTemplateText();
    }
}