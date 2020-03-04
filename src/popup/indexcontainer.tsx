import React, { useState, useCallback, useMemo } from 'react';
import { FilterSetting } from 'src/types/storage';
import { UserSettingServiceImpl } from '../storage/usersettingservice';
import { IndexMain, Props as IndexProps } from './components/indexmain';

export type IndexContainerProps = {
    initFilterSetting: FilterSetting;
    initTemplateText: string;
};

export const IndexContainer: React.FC<IndexContainerProps> = (props: IndexContainerProps) => {
    const { initFilterSetting, initTemplateText } = props;
    const [filterSetting, setFilterSetting] = useState(initFilterSetting);
    const [templateText, setTemplateText] = useState(initTemplateText);
    const [openAlert, setOpenAlert] = useState(false);
    const userSetting = useMemo(() => UserSettingServiceImpl.getInstance(), []);

    const handleChangeSwitch = useCallback(
        (name: string) => (event: React.ChangeEvent<HTMLInputElement>): void => {
            setFilterSetting({ ...filterSetting, [name]: event.target.checked });
        },
        [filterSetting]
    );

    const handleChangeText = useCallback((event: React.ChangeEvent<HTMLInputElement>): void => {
        setTemplateText(event.target.value);
    }, []);

    const handleSaveBtnClick = useCallback(async (): Promise<void> => {
        setOpenAlert(true);
        await userSetting.setFilterSetting(filterSetting);
        await userSetting.setTemplateText(templateText);
    }, [filterSetting, templateText]);

    const handleCloseAlert = useCallback((event?: React.SyntheticEvent, reason?: string): void => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenAlert(false);
    }, []);

    const indexProps: IndexProps = {
        isIncludePrivateEvent: filterSetting.isIncludePrivateEvent,
        isIncludeAllDayEvent: filterSetting.isIncludeAllDayEvent,
        templateText: templateText,
        openAlert: openAlert,
        handleChangeSwitch: handleChangeSwitch,
        handleChangeText: handleChangeText,
        handleSaveBtnClicked: handleSaveBtnClick,
        handleCloseAlert: handleCloseAlert,
    };

    return <IndexMain {...indexProps} />;
};
