/**
 * Application configuration
 */
import {
    ProjectModel,
    StringHelper
} from '@bryntum/schedulerpro';

const project = new ProjectModel({
    autoLoad: true,
});

const schedulerConfig = {
    project,
    startDate: new Date(2020, 10, 29),
    endDate: new Date(2021, 0, 10),
    rowHeight: 50,
    barMargin: 2,

    viewPreset: 'weekAndDay',
    resourceImagePath: 'users/',

    columns: [
        {
            text: 'Resource',
            field: 'name',
            width: 120,
            type: 'resourceInfo'
        },
        {
            text: 'Tasks',
            field: 'events.length',
            width: 70,
            align: 'right',
            editor: false
        }
    ],

    eventRenderer({ eventRecord: task, renderData }) {
        if (task.showInTimeline) {
            renderData.eventColor = 'green';
        } else {
            renderData.eventColor = 'blue';
        }

        return StringHelper.encodeHtml(task.name);
    }
};

const timelineConfig = {
    project
};

export { schedulerConfig, timelineConfig };
