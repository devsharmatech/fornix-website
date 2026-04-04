import { useState, useEffect } from "react";
import { FaBell, FaTrash } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { 
  fetchNotifications, 
  selectNotifications, 
  selectUnreadCount,
  markAsRead,
  deleteNotifications
} from "../redux/slices/notificationSlice";
import { selectUser } from "../redux/slices/authSlice";

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const notifications = useSelector(selectNotifications);
  const unreadCount = useSelector(selectUnreadCount);

  // Robust User ID extraction
  const userId = user?.id || user?._id;

  useEffect(() => {
    if (userId) {
      dispatch(fetchNotifications({ userId }));
    }
  }, [dispatch, userId]);

  const handleMarkAsRead = (id) => {
    if (userId) {
      dispatch(markAsRead({ userId, notificationId: id }));
    }
  };

  const handleClearAll = () => {
    if (userId && window.confirm("Are you sure you want to delete all notifications?")) {
      dispatch(deleteNotifications({ userId }));
    }
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    if (userId) {
      dispatch(deleteNotifications({ userId, notificationId: id }));
    }
  };

  return (
    <div className="relative">
      {/* Bell */}
      <button
        onClick={() => setOpen(!open)}
        className="text-gray-700 hover:text-orange-500 text-xl relative cursor-pointer flex items-center justify-center p-2"
      >
        <FaBell />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="fixed top-[70px] left-1/2 -translate-x-1/2 sm:absolute sm:top-full sm:left-auto sm:translate-x-0 sm:right-0 mt-2 sm:mt-4 w-[340px] max-w-[95vw] sm:w-[380px] bg-white shadow-[0_10px_40px_rgba(0,0,0,0.15)] rounded-2xl border border-gray-100 z-[9999] overflow-hidden transform sm:origin-top-right transition-all">
          {/* Header */}
          <div className="flex justify-between items-center p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
            <h3 className="font-bold text-gray-800 text-sm sm:text-base tracking-tight">Notifications</h3>
            {notifications.length > 0 && (
              <button
                onClick={handleClearAll}
                className="text-[10px] sm:text-xs font-semibold text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2 py-1 rounded-md transition-colors"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Notification List */}
          <div className="max-h-[60vh] sm:max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
            {notifications.length === 0 ? (
              <div className="p-8 sm:p-10 text-center flex flex-col items-center justify-center">
                <div className="bg-gray-50 p-4 rounded-full mb-3">
                  <FaBell className="text-gray-300 text-xl" />
                </div>
                <p className="text-gray-500 font-medium text-sm">No notifications yet</p>
                <p className="text-gray-400 text-xs mt-1">Check back later for updates</p>
              </div>
            ) : (
              notifications.map((n) => {
                const nId = n.id || n._id;
                return (
                  <div
                    key={nId}
                    onClick={() => !n.is_read && handleMarkAsRead(nId)}
                    className={`group flex items-start gap-3 sm:gap-4 p-3 sm:p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer relative ${
                      !n.is_read ? "bg-orange-50/40" : ""
                    }`}
                  >
                    {!n.is_read && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3/4 bg-orange-500 rounded-r-md"></div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className={`text-xs sm:text-sm truncate ${!n.is_read ? "font-bold text-gray-900" : "font-medium text-gray-700"}`}>
                          {n.title}
                        </p>
                        <p className="text-[9px] sm:text-[10px] text-gray-400 font-medium whitespace-nowrap shrink-0 mt-0.5">
                          {new Date(n.created_at || Date.now()).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <p className={`text-[11px] sm:text-xs leading-relaxed line-clamp-2 ${!n.is_read ? "text-gray-600" : "text-gray-500"}`}>
                        {n.message}
                      </p>
                    </div>

                    <button
                      onClick={(e) => handleDelete(e, nId)}
                      className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 text-gray-300 hover:text-red-500 p-1.5 sm:p-2 rounded-lg hover:bg-red-50 transition-all shrink-0 -mr-1 sm:-mr-2 border border-transparent hover:border-red-100"
                      title="Delete"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                );
              })
            )}
          </div>
          
          {notifications.length > 0 && (
            <div className="p-2 sm:p-3 bg-gray-50/80 backdrop-blur text-center border-t border-gray-100">
               <button 
                onClick={() => userId && dispatch(markAsRead({ userId }))}
                className="text-[11px] sm:text-xs font-bold text-orange-500 hover:text-orange-600 w-full rounded-md py-1.5 hover:bg-orange-50 transition-colors"
               >
                 Mark all as read
               </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;