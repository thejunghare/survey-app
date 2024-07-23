import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import VoterDetailsView from './VoterDetailsView';
import VoterDetailsEdit from './VoterDetailsEdit';

const Tab = createMaterialTopTabNavigator();

const VoterDetailsScreen: React.FC<{ route: any }> = ({ route }) => {
  const { voter } = route.params;

  return (
    <Tab.Navigator>
      <Tab.Screen name="View Details">
        {props => <VoterDetailsView {...props} voter={voter} />}
      </Tab.Screen>
      <Tab.Screen name="Edit Details">
        {props => <VoterDetailsEdit {...props} voter={voter} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default VoterDetailsScreen;
