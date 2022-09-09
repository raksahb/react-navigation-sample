import * as React from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';

import { NavigationContainer, StackActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigation } from '@react-navigation/native';

// You can import from local files
import AssetExample from './components/AssetExample';

// or any pure javascript modules available in npm
import { Card } from 'react-native-paper';

function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>Home Screen</Text>
      <Card>
        <AssetExample />
      </Card>
      <Button
        title="Go to Details"
        onPress={() => {
          /* 1. Navigate to the Details route with params */
          navigation.navigate('Details', {
            itemId: 86,
            otherParam: 'anything you want here',
          });
        }}
      />
      <GoToButton screenName="Start" replace />
    </View>
  );
}

function DetailsScreen({ route, navigation }) {
  /* 2. Get the param */
  const { itemId } = route.params;
  const { otherParam } = route.params;
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen</Text>
      <Text>itemId: {JSON.stringify(itemId)}</Text>
      <Text>otherParam: {JSON.stringify(otherParam)}</Text>
      <Button
        title="Go to Details... again"
        onPress={() =>
          navigation.push('Details', {
            itemId: Math.floor(Math.random() * 100),
          })
        }
      />
      <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />
      <Button title="Go back" onPress={() => navigation.goBack()} />
      <Button
        title="Go back to first screen in stack"
        onPress={() => navigation.popToTop()}
      />
    </View>
  );
}

function ProfileScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Profile Screen</Text>
    </View>
  );
}

function SettingsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings!</Text>
    </View>
  );
}

function GoToButton({ screenName, replace }) {
  const navigation = useNavigation();

  return (
    <Button
      title={`Go to ${screenName}`}
      onPress={() => {
        console.log('onPress', { screenName });
        if (replace) {
          navigation.dispatch(StackActions.replace(screenName)); 
        } else {
          navigation.navigate(screenName);
        }
      }}
    />
  );
}

function SomeScreen({ title = 'Default', children }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{title}</Text>
      {children}
    </View>
  );
}

const HomeStack = createStackNavigator();

function HomeStacks() {
  return (
    <HomeStack.Navigator
      initialRouteName="Home"
      headerMode="none"
      screenOptions={{ gestureEnabled: false }}>
      <HomeStack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'My app' }}
      />
      <HomeStack.Screen
        name="Profile"
        component={ProfileScreen}
        initialParams={{ user: 'me' }}
      />
      <HomeStack.Screen name="Home2">
        {(props) => <HomeScreen {...props} extraData={{ blah: 'blah' }} />}
      </HomeStack.Screen>
      <HomeStack.Screen
        name="Details"
        component={DetailsScreen}
        initialParams={{ itemId: 42 }}
      />
    </HomeStack.Navigator>
  );
}

const TopTab = createMaterialTopTabNavigator();
function TopTabs() {
  return (
    <TopTab.Navigator>
      <TopTab.Screen
        name="Tab 1"
        component={() => <SomeScreen title="Tab 1" />}
      />
      <TopTab.Screen
        name="Tab 2"
        component={() => <SomeScreen title="Tab 2" />}
      />
    </TopTab.Navigator>
  );
}

const BottomTab = createBottomTabNavigator();

function BottomTabs() {
  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      headerMode="none"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === 'Home') {
            return (
              <Ionicons
                name={
                  focused
                    ? 'ios-information-circle'
                    : 'ios-information-circle-outline'
                }
                size={size}
                color={color}
              />
            );
          } else if (route.name === 'Settings') {
            return (
              <Ionicons
                name={focused ? 'ios-list-box' : 'ios-list'}
                size={size}
                color={color}
              />
            );
          }
        },
      })}
      tabBarOptions={{
        activeTintColor: 'tomato',
        inactiveTintColor: 'gray',
      }}>
      <BottomTab.Screen name="Home">{() => <HomeStacks />}</BottomTab.Screen>
      <BottomTab.Screen
        name="Middle"
        options={{
          tabBarLabel: 'Middle',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="map" size={size} color={color} />
          ),
        }}>
        {() => <TopTabs />}
      </BottomTab.Screen>
      <BottomTab.Screen
        name="Settings"
        options={{ tabBarBadge: 3 }}
        component={SettingsScreen}
      />
    </BottomTab.Navigator>
  );
}

const RootStack = createStackNavigator();

function RootStacks() {
  return (
    <RootStack.Navigator>
      <RootStack.Screen
        name="Start"
        component={() => (
          <SomeScreen title="Start Screen">
            <GoToButton screenName="BottomTabs" replace />
            <GoToButton screenName="Other" />
          </SomeScreen>
        )}
        options={{ title: 'Start Screen' }}
      />
      <RootStack.Screen
        name="Other"
        component={() => (
          <SomeScreen title="Other Screen">
            <GoToButton screenName="Start" />
          </SomeScreen>
        )}
      />
      <RootStack.Screen
        name="BottomTabs"
        component={BottomTabs}
        options={{ headerShown: false }}
      />
    </RootStack.Navigator>
  );
}

// home screen to screen with multiple bottom tabs
// screen with bottom tabs has middle tab that leads to screen with top tabs
export default function App() {
  return (
    <NavigationContainer>
      <RootStacks />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
