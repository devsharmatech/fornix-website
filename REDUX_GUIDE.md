# Redux Integration Guide

This guide shows you how to use Redux in your components throughout the Fornix Medical application.

## Using Redux in Components

### 1. Authentication Example

```javascript
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, logoutUser, selectUser, selectIsAuthenticated } from '../redux/slices/authSlice';

function MyComponent() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Welcome, {user?.name}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <p>Please login</p>
      )}
    </div>
  );
}
```

### 2. Fetching Courses Example

```javascript
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllCourses, selectCourses, selectCoursesLoading } from '../redux/slices/coursesSlice';

function CoursesPage() {
  const dispatch = useDispatch();
  const courses = useSelector(selectCourses);
  const loading = useSelector(selectCoursesLoading);

  useEffect(() => {
    dispatch(fetchAllCourses());
  }, [dispatch]);

  if (loading) return <div>Loading courses...</div>;

  return (
    <div>
      {courses.map(course => (
        <div key={course.id}>{course.name}</div>
      ))}
    </div>
  );
}
```

### 3. Showing Notifications Example

```javascript
import { useDispatch } from 'react-redux';
import { showNotification } from '../redux/slices/uiSlice';

function MyComponent() {
  const dispatch = useDispatch();

  const handleSuccess = () => {
    dispatch(showNotification({
      type: 'success',
      message: 'Operation completed successfully!',
      duration: 3000
    }));
  };

  const handleError = () => {
    dispatch(showNotification({
      type: 'error',
      message: 'Something went wrong!',
      duration: 5000
    }));
  };

  return (
    <div>
      <button onClick={handleSuccess}>Show Success</button>
      <button onClick={handleError}>Show Error</button>
    </div>
  );
}
```

### 4. Payment Flow Example

```javascript
import { useDispatch, useSelector } from 'react-redux';
import { initiatePayment, verifyPayment, selectPaymentStatus } from '../redux/slices/paymentSlice';

function PaymentComponent() {
  const dispatch = useDispatch();
  const paymentStatus = useSelector(selectPaymentStatus);

  const handlePayment = async (planId) => {
    try {
      const result = await dispatch(initiatePayment(planId)).unwrap();
      // Handle Razorpay/PayU integration here
      // After payment, verify it
      await dispatch(verifyPayment({ transactionId: result.transactionId }));
    } catch (error) {
      console.error('Payment failed:', error);
    }
  };

  return (
    <div>
      <button onClick={() => handlePayment('plan-123')}>Pay Now</button>
      {paymentStatus === 'success' && <p>Payment successful!</p>}
    </div>
  );
}
```

### 5. Dashboard with Study Materials Example

```javascript
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudyMaterials, selectStudyMaterials } from '../redux/slices/dashboardSlice';

function DashboardPage() {
  const dispatch = useDispatch();
  const studyMaterials = useSelector(selectStudyMaterials);

  useEffect(() => {
    dispatch(fetchStudyMaterials());
  }, [dispatch]);

  return (
    <div>
      <h1>Study Materials</h1>
      {studyMaterials.map(material => (
        <div key={material.id}>
          <h3>{material.title}</h3>
          <a href={material.url}>Download</a>
        </div>
      ))}
    </div>
  );
}
```

## Available Redux Slices

### Auth Slice
- **Actions**: `registerUser`, `loginUser`, `logoutUser`, `fetchUserProfile`, `clearError`
- **Selectors**: `selectUser`, `selectIsAuthenticated`, `selectAuthLoading`, `selectAuthError`

### Courses Slice
- **Actions**: `fetchAllCourses`, `fetchCourseDetails`, `enrollInCourse`, `fetchEnrolledCourses`
- **Selectors**: `selectCourses`, `selectSelectedCourse`, `selectEnrolledCourses`, `selectCoursesLoading`

### Dashboard Slice
- **Actions**: `fetchStudyMaterials`, `fetchMCQBank`, `fetchUserProgress`, `submitMCQAnswer`
- **Selectors**: `selectStudyMaterials`, `selectMCQBank`, `selectProgress`, `selectActivePlan`

### Payment Slice
- **Actions**: `fetchPricingPlans`, `initiatePayment`, `verifyPayment`, `fetchPaymentHistory`
- **Selectors**: `selectPricingPlans`, `selectPaymentStatus`, `selectTransactionId`, `selectPaymentHistory`

### UI Slice
- **Actions**: `showNotification`, `hideNotification`, `openModal`, `closeModal`, `setGlobalLoading`
- **Selectors**: `selectNotifications`, `selectModals`, `selectGlobalLoading`

## Best Practices

1. **Always use selectors** instead of accessing state directly
2. **Use `.unwrap()`** with async thunks to handle errors in try-catch blocks
3. **Clear errors** when components unmount using `useEffect` cleanup
4. **Show notifications** for user feedback on success/error
5. **Check authentication** before accessing protected features
6. **Use loading states** to show spinners/skeletons during API calls

## Redux DevTools

Install Redux DevTools browser extension to inspect:
- Current state
- Action history
- State changes over time
- Time-travel debugging
