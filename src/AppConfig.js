/**
 * Application configuration
 */
import {
    ProjectModel,
    StringHelper
} from '@bryntum/schedulerpro';

export const projectModel = new ProjectModel({
    // autoLoad: true,
    // silenceInitialCommit: true,
    assignmentStore: {
        syncDataOnLoad: true,
    },
    eventStore: {
        syncDataOnLoad: true,
    },
    resourceStore: {
        syncDataOnLoad: true,
        tree: true,
    },
    // delayCalculation: false,

});

const schedulerConfig = {
    project: projectModel,
    startDate: new Date(2020, 10, 29),
    endDate: new Date(2021, 0, 10),
    rowHeight: 50,
    barMargin: 2,
    // forceFit   : true,
    // viewPreset: 'weekAndDay',
    resourceImagePath: 'users/',

    columns: [
        {
            text: 'Resource',
            field: 'name',
            width: 240,
            type: 'tree',
        },
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

export { schedulerConfig };
