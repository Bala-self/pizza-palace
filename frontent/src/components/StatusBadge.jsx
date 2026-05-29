import {
  FiClock,
  FiCheckCircle,
  FiTool,
  FiTruck,
  FiPackage
} from 'react-icons/fi';


const STATUS_STYLES ={
 
      'Pending': {
    className: 'bg-yellow-100 text-yellow-700',
    Icon:      FiClock
  },
  'Confirmed': {
    className: 'bg-blue-100 text-blue-700',
    Icon:      FiCheckCircle
  },
  'Preparing': {
    className: 'bg-orange-100 text-orange-700',
    Icon:      FiTool
  },
  'Out for Delivery': {
    className: 'bg-purple-100 text-purple-700',
    Icon:      FiTruck
  },
  'Delivered': {
    className: 'bg-green-100 text-green-700',
    Icon:      FiPackage
  }

}

const StatusBadge = ({status})=>{
const config =STATUS_STYLES[status] || 
{ className :'bg-gray-100 text-gray-600 ',
    Icon:FiClock
};

const {className , Icon } = config

return(
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium
                  px-2.5 py-1 rounded-full ${className}`}>
              <Icon size={11} />{status}
                  </span>
);


};

export default StatusBadge;