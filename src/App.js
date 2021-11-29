/**
 * The React App file
 */

// React libraries
import React from 'react';

// Stylings
import './App.scss';

// Application components
import {
    BryntumSchedulerPro,
} from '@bryntum/schedulerpro-react';
import { schedulerConfig } from './AppConfig';

const App = () => {
    const ref = React.useRef();
    const refCallback = React.useCallback((scheduler) => {
        ref.current = scheduler;
        if (ref.current?.instance != null) {
            // ref.current.instance.eventStore.addListener('catchAll', (event) => {
            //     console.log('eventStore event:', event);
            //     // return false;
            // });
            ref.current.instance.eventStore.addListener('beforeUpdate', event => {
                console.log('beforeUpdate: ', event);
                return false;
            })
            // ref.current.instance.project.addListener('catchAll', (event) => {
            //     console.log('project event:', event);

            // })
        }
    }, []);
    return <BryntumSchedulerPro ref={refCallback} {...schedulerConfig} />;
};

export default App;
