import { createNativeStackNavigator } from '@react-navigation/native-stack';

const { Navigator, Screen } = createNativeStackNavigator();

import { OnboardingPageOne } from '../screens/OnboardingPageOne';
import { OnboardingPageTwo } from '../screens/OnboardingPageTwo';
import { Home } from '../screens/Home';
import { Login } from '../screens/Login';
import { Student } from '../screens/Student';
import { EnterpriseLanding } from '../screens/EnterpriseLanding';
import { ProfessorLanding } from '../screens/ProfessorLanding';
import { Skiller } from "../screens/Skiller";
import ListSkillers  from "../screens/ListSkillers";


export function AppRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name='onboardingPageOne' component={OnboardingPageOne} />
      <Screen name='onboardingPageTwo' component={OnboardingPageTwo} />
      <Screen name='enterpriseLanding' component={EnterpriseLanding} />
      <Screen name='home' component={Home} />
      <Screen name='login' component={Login} />
      <Screen name='student' component={Student} />
      <Screen name='professor' component={ProfessorLanding} />
      <Screen name='skiller' component={Skiller}/>
      <Screen name='skillers' component={ListSkillers}/>
    </Navigator>
  );
}
