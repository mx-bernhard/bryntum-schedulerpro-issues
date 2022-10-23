/**
 * The React App file
 */

// React libraries
import React, { useRef, useCallback, useEffect, useMemo, useReducer, useState } from 'react';

import { range } from 'lodash';

// Stylings
import './App.scss';

// Application components
import {
    BryntumSchedulerPro,
} from '@bryntum/schedulerpro-react';
import {
    StringHelper
} from '@bryntum/schedulerpro';
import { projectModel, schedulerConfig, } from './AppConfig';

const addDays = function (date, days) {
    var dateValue = new Date(date.valueOf());
    dateValue.setDate(dateValue.getDate() + days);
    return dateValue;
}
export const eventTemplate = (eventData) => {
    return `<div>${StringHelper.encodeHtml(eventData.eventRecord.data?.name)}</div>
    `;
};
export function useRerender() {
    const [, u] = useReducer(x => !x, true);
    return u;
}

const App = () => {
    const [grouped, updateGrouped] = useState('group-a');
    const rerender = useRerender();
    const resources = useMemo(() => [{
        id: '1',
        name: "Angelo",
        groups: ['group-a-1', 'group-a-2', 'group-b-1'],
    },
    {
        id: '2',
        name: "Arnold",
        groups: ['group-b-2'],
    }], []);
    const [assignments, updateAssignments] = useState(() => {
        return range(1, 1000).map(i => ({ id: i, eventId: i, resourceId: '1' }));
    });

    const maybeGroupedResources = useMemo(() => {
        if (grouped == null) {
            return resources;
        } else {
            const namedGroups = resources.flatMap(r => r.groups).filter(g => g.startsWith(grouped));
            return namedGroups.map(namedGroup =>
            ({
                id: namedGroup,
                name: namedGroup,
                expanded: true,
                children: resources.filter(r => r.groups.some(g => g === namedGroup)).map(r => ({ ...r, id: namedGroup + '/' + r.id }))
            })
            );
        }
    }, [grouped, resources]);
    const [events, updateEvents] = useState(() => {
        return range(1, 1000).map(i => ({
            id: i,
            name: "appointment",
            startDate: addDays(new Date(2020, 11, 1, 10), i),
            duration: 1,
            durationUnit: 'd',
        }));
    }, []);
    const maybeGroupedAssignments = useMemo(() => {
        if (grouped != null) {
            return resources[0].groups.filter(g => g.startsWith(grouped)).flatMap(g => {
                return assignments.map(a => ({
                    id: a.id + '/' + g + '/' + a.resourceId,
                    eventId: a.eventId,
                    resourceId: g + '/' + a.resourceId,
                }));
            })
        }
        return assignments.map(a => ({
            id: a.resourceId + a.eventId,
            eventId: a.eventId,
            resourceId: a.resourceId,
        }));
    }, [assignments, grouped, resources])

    const toggleGroupMode = useCallback(() => {
        updateGrouped(old => {
            const groupModes = [null, 'group-a', 'group-b'];
            return groupModes[(groupModes.indexOf(old) + 1) % 3];
        });
    }, []);
    const missedUpdateRef = useRef(false);
    const [missedUpdateState, updateMissedUpdate] = useState({});
    const updatingRef = useRef(false);
    useEffect(() => {
        (async () => {
            console.log('updating');
            if (updatingRef.current) {
                // missedUpdateRef.current = true;
                // return;
            }
            updatingRef.current = true;
            try {
                await projectModel.loadInlineData({
                    eventsData: events,
                    resourcesData: maybeGroupedResources,
                    assignmentsData: maybeGroupedAssignments,
                });
            } finally {
                updatingRef.current = false;
            } 
            console.log('finished updating');
            if (missedUpdateRef.current) {
                missedUpdateRef.current = false;
                updateMissedUpdate({});
            }
        })();
    }, [assignments, events, maybeGroupedAssignments, maybeGroupedResources, rerender, resources, missedUpdateState])

    useEffect(() => {
        const asgChangeListener = (evt) => {
            if (evt.changes?.resourceId != null) {
                updateAssignments(oldAssignments => [{ ...oldAssignments[0], resourceId: evt.changes.resourceId.value }])
            }
        };
        const eventChangeListener = (evt) => {
            console.log('test');
            if (evt.changes?.duration != null) {
                updateEvents(oldEvents => [{ ...oldEvents[0], duration: evt.changes.duration.value }]);
            }
        }
        projectModel.assignmentStore.addListener('change', asgChangeListener);
        projectModel.eventStore.addListener('change', eventChangeListener);
        return () => {
            projectModel.eventStore.removeListener('change', eventChangeListener);
            projectModel.assignmentStore.removeListener('change', asgChangeListener);
        };
    }, [])

    const scrollable = useMemo(() => ({ onScroll: e => console.log(e) }), []);

    return <div style={{ minHeight: '50vh' }}>
        <div style={{ display: 'flex', margin: '1rem' }}>
            <button type="button" onClick={toggleGroupMode}>Toggle grouping mode</button>
            <div style={{ margin: '1rem' }}>Group: {grouped != null ? grouped : 'without groups'}</div>
        </div>
        <BryntumSchedulerPro {...schedulerConfig}
            project={projectModel}
            eventStyle="regular"
            eventRenderer={eventTemplate}
            headerMenuFeature={false}
            cellMenuFeature={false}
            dependencyEditFeature={false}
            dependenciesFeature={false}
            columnPickerFeature={false}
            eventMenuFeature={{
                items: {
                    deleteEvent: false,
                    unassignEvent: false,
                },
            }}
            scrollable={scrollable}
            sortFeature={false}
            eventCopyPasteFeature={false}
            eventDragCreateFeature={false}
            scheduleTooltipFeature={false}
            scheduleMenuFeature={{
                items: {
                    addEvent: false,
                },
            }}
            cellEditFeature={false}
            timeAxisHeaderMenuFeature={{
                items: {
                    zoomLevel: false,
                    eventsFilter: false,
                    dateRange: false,
                },
            }}
            // treeFeature
            taskEditFeature={false}
            headerZoomFeature={false}
            eventEditFeature
            createEventOnDblClick={false}
            enableDeleteKey={false} />
    </div >
};

export default App;
