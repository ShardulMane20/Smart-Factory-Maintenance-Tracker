import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Card from '../common/Card';

const localizer = momentLocalizer(moment);

const MaintenanceCalendar = ({ maintenanceRecords }) => {
  // Transform maintenance records to calendar events
  const events = maintenanceRecords?.map(record => {
    let eventColor = '#10b981'; // green - completed
    
    if (record.status === 'Scheduled') {
      eventColor = '#f59e0b'; // yellow - upcoming
    } else if (record.status === 'Overdue') {
      eventColor = '#ef4444'; // red - overdue
    }

    return {
      id: record.id,
      title: `${record.machine_name || 'Machine'} - ${record.maintenance_type}`,
      start: new Date(record.maintenance_date),
      end: new Date(record.maintenance_date),
      resource: record,
      style: {
        backgroundColor: eventColor,
      },
    };
  }) || [];

  const eventStyleGetter = (event) => {
    return {
      style: {
        backgroundColor: event.style.backgroundColor,
        borderRadius: '5px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block',
        fontSize: '12px',
        padding: '2px 5px',
      }
    };
  };

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-white mb-4">Maintenance Schedule</h3>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-gray-400">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span className="text-gray-400">Scheduled</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-gray-400">Overdue</span>
          </div>
        </div>
      </div>
      
      <div style={{ height: '600px' }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          eventPropGetter={eventStyleGetter}
          views={['month', 'week', 'day']}
          defaultView="month"
          popup
        />
      </div>
    </Card>
  );
};

export default MaintenanceCalendar;