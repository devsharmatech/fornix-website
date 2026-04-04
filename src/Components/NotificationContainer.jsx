import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectNotifications, hideNotification } from '../redux/slices/uiSlice';

const NotificationContainer = () => {
    const notifications = useSelector(selectNotifications);
    const dispatch = useDispatch();

    useEffect(() => {
        notifications.forEach((notification) => {
            if (notification.duration) {
                setTimeout(() => {
                    dispatch(hideNotification(notification.id));
                }, notification.duration);
            }
        });
    }, [notifications, dispatch]);

    if (notifications.length === 0) return null;

    return (
        <div className="fixed top-24 right-4 z-100 space-y-2">
            {notifications.map((notification) => (
                <div
                    key={notification.id}
                    className={`px-6 py-4 rounded-lg shadow-lg flex items-center justify-between min-w-75 max-w-md animate-slide-in ${notification.type === 'success'
                        ? 'bg-green-500 text-white'
                        : notification.type === 'error'
                            ? 'bg-red-500 text-white'
                            : notification.type === 'warning'
                                ? 'bg-yellow-500 text-white'
                                : 'bg-orange-500 text-white'
                        }`}
                >
                    <p className="flex-1">{notification.message}</p>
                    <button
                        onClick={() => dispatch(hideNotification(notification.id))}
                        className="ml-4 text-white hover:text-gray-200 font-bold text-xl"
                    >
                        ×
                    </button>
                </div>
            ))}
        </div>
    );
};

export default NotificationContainer;
