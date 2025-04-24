import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// PATIENTS SCREENS
import PatientLoginScreen from './screens/Patient/PatientLoginScreen';
import PatientSignupScreen from './screens/Patient/PatientSignupScreen';
import PatientDashboardScreen from './screens/Patient/PatientDashboardScreen';
import PatientAdditionalInfoScreen from './screens/Patient/PatientAdditionalInfoScreen';
import PatientForgotPasswordScreen from "./screens/Patient/PatientForgotPasswordScreen";
import PatientProfile from "./screens/Patient/PatientProfile";
import PatientDonationList from './screens/Patient/PatientDonationsList';
import PatientMedicineListScreen from './screens/Patient/PatientMedicineListScreen';
import PatientNotificationScreen from './screens/Patient/PatientNotificationScreen';
import PatientDonationDetails from './screens/Patient/PatientDonationDetails';
import PatientMyRequestsScreen from './screens/Patient/PatientMyRequestsScreen';
import PatientMedicineDetailsScreen from './screens/Patient/PatientMedicineDetailsScreen';
import PatientRequestMedicineScreen from './screens/Patient/PatientRequestMedicineScreen';
import PatientDonateMedicineScreen from "./screens/Patient/PatientDonateMedicineScreen";

//DONOR SCREENS
import DonorAdditionalInfoScreen from './screens/Donor/DonorAdditionalInfoScreen';
import DonorLoginScreen from './screens/Donor/DonorLoginScreen';
import DonorSignupScreen from './screens/Donor/DonorSignupScreen';
import DonorDashboardScreen from './screens/Donor/DonorDashboardScreen';
import DonorNotificationScreen from './screens/Donor/DonorNotificationScreen';
import DonorForgotPasswordScreen from "./screens/Donor/DonorForgotPasswordScreen";
import DonorProfile from "./screens/Donor/DonorProfile";
import DonorDonationsList from './screens/Donor/DonorDonationsList';
import DonorMedicineListScreen from './screens/Donor/DonorMedicineListScreen';
import DonorDonationDetails from './screens/Donor/DonorDonationDetails';
import DonorMyRequestsScreen from './screens/Donor/DonorMyRequestsScreen';
import DonorMedicineDetailsScreen from './screens/Donor/DonorMedicineDetailsScreen';
import DonorRequestMedicineScreen from './screens/Donor/DonorRequestMedicineScreen';
import DonorDonateMedicineScreen from "./screens/Donor/DonorDonateMedicineScreen";

//COMMON SCREENS
import WelcomeScreen from './screens/WelcomeScreen';
import MapScreen from './screens/MapScreen';
import RiderLoginScreen from './screens/Rider/RiderLoginScreen';
import RiderForgotPasswordScreen from './screens/Rider/RiderForgotPasswordScreen';
import RiderDashboardScreen from './screens/Rider/RiderDashboardScreen';
import RiderProfile from './screens/Rider/RiderProfile';
import RidesAssigned from './screens/Rider/RidesAssigned';
import RidesCompleted from './screens/Rider/RidesCompleted';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">

        {/* COMMON ROUTES */}
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MapScreen" component={MapScreen} options={{ headerShown: false }} />

        {/* PATIENT ROUTES */}
        <Stack.Screen name="PatientLogin" component={PatientLoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="PatientSignup" component={PatientSignupScreen} options={{ headerShown: false }} />
        <Stack.Screen name="PatientAdditionalInfo" component={PatientAdditionalInfoScreen} options={{ headerShown: false }} />
        <Stack.Screen name="PatientForgotPassword" component={PatientForgotPasswordScreen} options={{ headerShown: false }} />
        <Stack.Screen name="PatientDashboardScreen" component={PatientDashboardScreen} options={{ headerShown: false }} />
        <Stack.Screen name="PatientProfile" component={PatientProfile} options={{ headerShown: false }} />
        <Stack.Screen name="PatientNotificationScreen" component={PatientNotificationScreen} options={{ headerShown: false }} />
        <Stack.Screen name="PatientMedicineList" component={PatientMedicineListScreen} options={{ headerShown: false }} />
        <Stack.Screen name="PatientDonationsList" component={PatientDonationList} options={{ headerShown: false }} />
        <Stack.Screen name="PatientDonationDetails" component={PatientDonationDetails} options={{ headerShown: false }} />
        <Stack.Screen name="PatientMedicineDetails" component={PatientMedicineDetailsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="PatientMyRequestsScreen" component={PatientMyRequestsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="PatientRequestMedicine" component={PatientRequestMedicineScreen} options={{ headerShown: false }} />
        <Stack.Screen name="PatientDonateMedicineScreen" component={PatientDonateMedicineScreen} options={{ headerShown: false }} />

        {/* DONOR ROUTES */}
        <Stack.Screen name="DonorLogin" component={DonorLoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="DonorSignup" component={DonorSignupScreen} options={{ headerShown: false }} />
        <Stack.Screen name="DonorAdditionalInfo" component={DonorAdditionalInfoScreen} options={{ headerShown: false }} />
        <Stack.Screen name="DonorForgotPassword" component={DonorForgotPasswordScreen} options={{ headerShown: false }} />
        <Stack.Screen name="DonorDashboardScreen" component={DonorDashboardScreen} options={{ headerShown: false }} />
        <Stack.Screen name="DonorProfile" component={DonorProfile} options={{ headerShown: false }} />
        <Stack.Screen name="DonorNotificationScreen" component={DonorNotificationScreen} options={{ headerShown: false }} />
        <Stack.Screen name="DonorMedicineList" component={DonorMedicineListScreen} options={{ headerShown: false }} />
        <Stack.Screen name="DonorDonationsList" component={DonorDonationsList} options={{ headerShown: false }} />
        <Stack.Screen name="DonorDonationDetails" component={DonorDonationDetails} options={{ headerShown: false }} />
        <Stack.Screen name="DonorMedicineDetails" component={DonorMedicineDetailsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="DonorMyRequestsScreen" component={DonorMyRequestsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="DonorRequestMedicine" component={DonorRequestMedicineScreen} options={{ headerShown: false }} />
        <Stack.Screen name="DonorDonateMedicineScreen" component={DonorDonateMedicineScreen} options={{ headerShown: false }} />

        {/* Rider Screens */}
        <Stack.Screen name="RiderLoginScreen" component={RiderLoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="RiderForgotPassword" component={RiderForgotPasswordScreen} options={{ headerShown: false }} />
        <Stack.Screen name="RiderDashboardScreen" component={RiderDashboardScreen} options={{ headerShown: false }} />
        <Stack.Screen name="RiderProfile" component={RiderProfile} options={{ headerShown: false }} />
        <Stack.Screen name="RidesAssigned" component={RidesAssigned} options={{ headerShown: false }} />
        <Stack.Screen name="RidesCompleted" component={RidesCompleted} options={{ headerShown: false }} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}