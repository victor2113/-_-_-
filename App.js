import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert
} from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

export default function App() {
  const initialState = {
    id: 0,
    title: "",
    description: "",
    completed: false
  };

  const [todo, setTodo] = useState([]);
  const [newTodo, setNewTodo] = useState(initialState);
  const [showModal, setShowModal] = useState(false);

  const getTodos = async () => {
    const todos = await AsyncStorage.getItem("todo");
    setTodo(JSON.parse(todos) ? JSON.parse(todos) : []);
  };

  useEffect(() => {
    getTodos()
  }, []);

  const handleChange = (title, value) =>
    setNewTodo({ ...newTodo, [title]: value });

  const clear = () => setNewTodo(initialState);

  const addTodo = () => {
    if (!newTodo.title || !newTodo.description) {
      alert("Please alert all the details.")
      return;
    }

    newTodo.id = todo.length + 1;
    const updatedTodo = [newTodo, ...todo];
    setTodo(updatedTodo);
    AsyncStorage.setItem("todo", JSON.stringify(updatedTodo));
    clear();
    setShowModal(false);
  };

  const updateTodo = item => {
    const itemToBeUpdated = todo.filter(todoItem => todoItem.id == item.id);
    itemToBeUpdated[0].completed = !itemToBeUpdated[0].completed;

    const remainingItems = todo.filter(todoItem => todoItem.id != item.id);
    const updatedTodo = [...itemToBeUpdated, ...remainingItems];

    setTodo(updatedTodo);
    AsyncStorage.setItem('todo', JSON.stringify(updatedTodo));
  }

  const displayTodo = (item) => (
    <TouchableOpacity
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomColor: '#000',
        borderBottomWidth: 1
      }}
      onPress={() =>
        Alert.alert(`${item.title}`, `${item.description}`, [
          {
            text: item.completed ? "Mark InProgress" : "Mark Completed",
            onPress: () => updateTodo(item)
          },
          {
            text: "Ok",
            style: "cancel"
          }
        ])
      }>
      <BouncyCheckbox
        isChecked={item.completed ? true : false}
        fillColor='blue'
        onPress={() => updateTodo(item)}
      />
      <Text
        style={{
          color: '#000',
          fontSize: 16,
          width: '90%',
          textDecorationLine: item.completed ? 'line-through' : 'none'
        }}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ marginHorizontal: 20 }}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingVertical: 20
        }}>
        <View>
          <Text style={{ color: '#000', fontSize: 28, fontWeight: 'bold' }}>
            Hey, User! 👋
          </Text>
          <Text style={{ fontSize: 16 }}>{todo.length} {todo.length == 1 ? 'task' : 'tasks'} for you</Text>
        </View>
        <Image
          source={require('./assets/icon.jpg')}
          style={{ height: 50, width: 50, borderRadius: 10 }}
        />
      </View>

      <Text style={{ color: '#000', fontSize: 22, fontWeight: 'bold' }}>
        To do 📄
      </Text>
      <ScrollView>
        <View style={{ height: 250 }}>
          {
            todo.map(item => !item.completed ? displayTodo(item) : null)
          }
        </View>
      </ScrollView>
      <Text style={{ color: '#000', fontSize: 22, fontWeight: 'bold' }}>
        Completed ✅
      </Text>
      <ScrollView>
        <View style={{ height: 250 }}>
          {
            todo.map(item => item.completed ? displayTodo(item) : null)
          }
        </View>
      </ScrollView>

      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-end'
        }}>
        <TouchableOpacity
          onPress={() => setShowModal(true)}
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'lightblue',
            borderRadius: 100,
            width: 60,
            height: 60
          }}>
          <Text style={{ fontSize: 34, fontWeight: 'bold' }}>+</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showModal}
        animationType='slide'
        onRequestClose={() => setShowModal(false)}>
        <View style={{ marginHorizontal: 20 }}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: 20
            }}>
            <View>
              <Text style={{ color: '#000', fontSize: 28, fontWeight: 'bold' }}>
                Hey, User! 👋
              </Text>
              <Text style={{ fontSize: 16 }}>{todo.length} {todo.length == 1 ? 'task' : 'tasks'} for you</Text>
            </View>
            <Image
              source={require('./assets/icon.jpg')}
              style={{ height: 50, width: 50, borderRadius: 10 }}
            />
          </View>

          <Text
            style={{
              marginVertical: 20,
              color: '#000',
              fontWeight: 'bold',
              fontSize: 22
            }}>
            Add a TODO Item
          </Text>

          <TextInput
            placeholder='Title'
            value={newTodo.title}
            onChangeText={(title) => handleChange('title', title)}
            style={{
              backgroundColor: 'rgb(220, 220, 220)',
              borderRadius: 10,
              paddingHorizontal: 10,
              marginVertical: 10
            }}
          />
          <TextInput
            placeholder='Description'
            value={newTodo.description}
            onChangeText={(description) => handleChange('description', description)}
            style={{
              backgroundColor: 'rgb(220, 220, 220)',
              borderRadius: 10,
              paddingHorizontal: 10,
              marginVertical: 10
            }}
            multiline={true}
            numberOfLines={6}
          />

          <View style={{ width: '100%', alignItems: 'center' }}>
            <TouchableOpacity
              onPress={addTodo}
              style={{
                backgroundColor: 'blue',
                width: 100,
                borderRadius: 10,
                alignItems: 'center',
                padding: 10
              }}>
              <Text style={{ color: '#fff', fontSize: 22 }}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}