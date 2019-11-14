import GaroonDataSource from './garoondatasource';
import * as base from 'garoon-soap/dist/type/base';
import GaroonDataSourceImpl from './garoondatasource';
import { EventInfo, Participant, MyGroupEvent } from '../types/event';
import EventConverter from '../background/eventconverter';
import * as util from './util';
import { DateRange } from '../types/date';

interface ScheduleEventsLogic {
    getMyEvents(dateRange: DateRange, isPrivate: boolean, targetType: string, target: string): Promise<EventInfo[]>;
    getSortedMyEvents(
        dateRange: DateRange,
        isPrivate: boolean,
        targetType: string,
        target: string
    ): Promise<EventInfo[]>;
    getMyGroups(): Promise<base.MyGroupType[]>;
    getMyGroupEvents(dateRange: DateRange, isPrivate: boolean, groupId: string): Promise<MyGroupEvent[]>;
    getNarrowedDownPublicHolidays(specificYear: number): Promise<Date[]>;
}

export default class ScheduleEventsLogicImpl implements ScheduleEventsLogic {
    private garoonDataSource: GaroonDataSource;

    constructor(domain: string) {
        this.garoonDataSource = new GaroonDataSourceImpl(domain);
    }

    async getMyEvents(dateRange: DateRange, isPrivate: boolean, targetType = '', target = ''): Promise<EventInfo[]> {
        const events = await this.garoonDataSource.getScheduleEvents(
            dateRange.startDate.toISOString(),
            dateRange.endDate.toISOString(),
            targetType,
            target
        );
        if (isPrivate) {
            return events.filter(event => event.visibilityType !== 'PRIVATE');
        } else {
            return events;
        }
    }

    async getSortedMyEvents(
        dateRange: DateRange,
        isPrivate: boolean,
        targetType = '',
        target = ''
    ): Promise<EventInfo[]> {
        const eventInfoList = await this.getMyEvents(dateRange, isPrivate, targetType, target);
        return eventInfoList.sort(util.sortByTimeFunc);
    }

    // TODO: 型定義ファイルを作る
    async getMyGroups(): Promise<base.MyGroupType[]> {
        const myGroupVersions = await this.garoonDataSource.getMyGroupVersions([]);
        const myGroupIds = myGroupVersions.map(group => group.id);
        return this.garoonDataSource.getMyGroupsById(myGroupIds);
    }

    async getMyGroupEvents(dateRange: DateRange, isPrivate: boolean, groupId: string): Promise<MyGroupEvent[]> {
        const myGroups = await this.getMyGroups();
        const targetMyGroups = myGroups.filter(g => g.key === groupId);

        if (targetMyGroups.length === 0) {
            throw new Error('選択したMyグループが存在しません');
        }
        const groupMemberList = targetMyGroups[0].belong_member;

        /*
        [
            [{}, {}, {}],
            [{}, {}, {}],
            [{}, {}, {}]
            ....
        ]
        */
        const eventInfoPerUserList = await Promise.all(
            groupMemberList.map(async userId => {
                const eventInfoList = await this.getMyEvents(dateRange, isPrivate, 'user', userId);
                return eventInfoList;
            })
        );

        /*
            [{}, {}, {},........]
        */
        let mergeEventInfoList: EventInfo[] = [];
        eventInfoPerUserList.forEach(events => {
            mergeEventInfoList = mergeEventInfoList.concat(events);
        });

        const myGroupEventList = mergeEventInfoList
            .reduce((uniqueEvents: EventInfo[], currentEvent: EventInfo) => {
                if (!uniqueEvents.some(event => event.id === currentEvent.id)) {
                    uniqueEvents.push(currentEvent);
                }
                return uniqueEvents;
            }, [])
            .sort(util.sortByTimeFunc)
            .map(eventInfo => {
                const participantList: Participant[] = [];
                eventInfo.attendees.forEach((participant: Participant) => {
                    groupMemberList.forEach(userId => {
                        if (participant.id === userId) {
                            participantList.push(participant);
                        }
                    });
                });
                return EventConverter.convertToMyGroupEvent(eventInfo, participantList);
            });

        /*
            [{}, {}, {}....]
        */
        return myGroupEventList;
    }

    async getNarrowedDownPublicHolidays(specificYear: number): Promise<Date[]> {
        const calendarEvents = await this.garoonDataSource.getCalendarEvents();
        return calendarEvents
            .filter(event => {
                const year = event.date.toString().split('-')[0];
                // リストのサイズが大きすぎるので、指定した年の１年前後の祝日のリストに絞り込む
                return (
                    event.type === 'public_holiday' &&
                    (String(specificYear - 1) === year ||
                        String(specificYear) === year ||
                        String(specificYear + 1) === year)
                );
            })
            .map(event => new Date(event.date));
    }
}
