import * as React from 'react';
import {
  SafeAreaView, Button, View, Text,
  Image, TouchableOpacity, Keyboard, Alert, FlatList, StyleSheet, ScrollView, Picker
} from
  'react-native';
import { createAppContainer, NavigationEvents } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Card, ListItem } from 'react-native-elements'
class PantallaInicio extends React.Component {
  state = {
    usuario: '',
    contrasena: ''
  }
  static navigationOptions = {
    header: null
  };
  Entrar() {
    if (!!this.state.usuario && !!this.state.contrasena) {
      fetch('https://apireactnativedps.000webhostapp.com/apiusuario.php?comando=autenticar&usuario=' + this.state.usuario + '&contrasena=' + this.state.contrasena, {
        method: 'GET'
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
          const encontrado = responseJson.encontrado;
          // Alert("Mensaje="+mensaje);
          if (encontrado == 'si') {
            this.props.navigation.navigate('ListarProductos')
          }
          else {
            Alert.alert(
              'Usuario',
              'No encontrado!!',
              [
                { text: 'OK', onPress: () => console.log('OK Pressed') },
              ],
              { cancelable: false }
            )
          }
        })
        .catch((error) => {
          console.error(error);
          Alert.alert(
            'Aviso',
            'Error de Internet!!',
            [
              { text: 'OK', onPress: () => console.log('OK Pressed') },
            ],
            { cancelable: false }
          );
        });
    } else {
      Alert.alert(
        'Aviso',
        'No introdujo datos',
        [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ],
        { cancelable: false }
      );

    }
  }
  render() {
    return (
      <View style={{ flex: 1, padding: 10 }}>

        <Text
          style={{ fontSize: 34, marginTop: 25, alignSelf: 'center' }}>Bienvenidos</Text>
      

        <View style={{ marginLeft: 10, marginRight: 10 }}>
          <Input
            placeholder='USUARIO'
            onChangeText={(text) => this.setState({ usuario: text })}
            rightIcon={
              <Icon
                name='user'
                size={24}
                color='black'
              />
            }
          />
          <Input
            placeholder='CONTRASEÑA'
            onChangeText={(text) => this.setState({ contrasena: text })}
            secureTextEntry={true}
            rightIcon={
              <Icon
                name='lock'
                size={24}
                color='black'
              />
            }
          />
        </View>
        <TouchableOpacity
          style={{
            height: 50, backgroundColor: 'red',
            marginTop: 15, borderRadius: 5, justifyContent:
              'center', marginLeft: 20, marginRight: 20
          }}
          onPress={() => { this.Entrar() }}
        >
          <Text style={{
            color: 'white', fontSize: 22, textAlign: 'center',
            textAlignVertical: 'center'
          }}>Entrar</Text>
        </TouchableOpacity>
      </View>
    );
  }
}


class listarProductos extends React.Component {
  state = {
    elementos: [],
    total: 0
  }
  static navigationOptions = {
    title: 'Clientes',
    headerStyle: {
      backgroundColor: '#f4511e',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  };

  cargarRegistros() {
    console.log('Prueba');
    fetch('https://apireactnativedps.000webhostapp.com/apicartera.php?comando=listar', {
      method: 'GET'
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        const listado = responseJson.records;
        console.log(listado);
        this.setState({
          elementos: listado,
          total: listado.length
        })
      })
      .catch((error) => {
        console.error(error);
      });
  }
  render() {
    return (
      <View style={{ flex: 1 }} >
        <NavigationEvents
          onWillFocus={() => {
            // Do your things here
            this.cargarRegistros();
          }}
        />
        <Text
          style={{
            fontSize: 18, textAlign: 'center', height: 40, marginTop: 10, backgroundColor: 'lightgray', textAlignVertical: 'center',
            borderRadius: 10, marginLeft: 10, marginRight: 10
          }}>{this.state.total} Clientes </Text>
        <FlatList
          data={this.state.elementos}
          renderItem={({ item }) => <TouchableOpacity
            key={item.id}
            //onPress = {() => this.alertItemName(item)}
            onPress={() =>
              this.props.navigation.navigate('Detalles', item)}
          >
            <View style={{ flexDirection: 'row', marginTop: 15, marginLeft: 2 }}>
          
              <View style={{ margin: 5, flex:1, borderWidth:1,borderStyle:'solid',borderColor:'#dedede'}}>
                <Text style={{ flex: 1, fontSize: 18, textAlign:'center' }}>
                  {item.nombre}
                </Text>

<Text style={{ flex: 1, fontSize: 18,  }}>
                  Teléfono: {item.telefono}
                </Text>

                <Text style={{ flex: 1, fontSize: 18 }}>
               Tipo de cliente:   {item.tipo}
                </Text>

                <Text style={{
                  flex: 1, fontSize: 16, fontWeight:
                    'bold',color:'#3ab8de',textAlign:'center'
                }}>
                 Ver más
                </Text>
                <Text style={{ flex: 1, fontSize: 14 }}>
                 
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          
  
          }
          keyExtractor={item => item.id}
        />



        <TouchableOpacity
          style={{
            borderWidth: 1,
            borderColor: 'rgba(0,0,0,0.2)',
            alignItems: 'center',
            justifyContent: 'center',
            width: 70,
            position: 'absolute',
            bottom: 10,
            right: 10,
            height: 70,
            backgroundColor: 'red',
            borderRadius: 100,

          }}
          onPress={() => this.props.navigation.navigate('Agregar')}
        >
          <Icon name="plus" size={30} color="white" />
        </TouchableOpacity>
      </View>
    );
  }
}


class PaginaDetalle extends React.Component {
  state = {
    nombre: '',
    dirpostal: '',
    dirtrabajo: '',
    telefono: '',
    correo: '',
    tipo: '',
    intereses:'',
  }
  static navigationOptions = {
    title: 'Editar cliente',
    headerStyle: {
      backgroundColor: '#f4511e',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  };
  Actualizar() {

    fetch('https://apireactnativedps.000webhostapp.com/apicartera.php?comando=editar&nombre=' + this.state.nombre
      + '&descripcion=' + this.state.descripcion
      + '&cantidad=' + this.state.cantidad
      + '&preciodecosto=' + this.state.preciodecosto
      + '&preciodeventa=' + this.state.preciodeventa
      + '&fotografia=' + this.state.fotografia
      + '&id=' + this.state.id, {
      method: 'GET'
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        const mensaje = responseJson.mensaje;
        console.log(mensaje);
        if (!mensaje)
          alert("Error al actualizar!");
        else {
          alert(mensaje);
          this.props.navigation.goBack();
        }
      })
      .catch((error) => {
        console.error(error);
        alert("Error de Internet!!");
      });
  }
  Eliminar() {

    fetch('https://apireactnativedps.000webhostapp.com/apicartera.php?comando=eliminar&id=' + this.state.id, {
      method: 'GET'
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        const mensaje = responseJson.mensaje;
        console.log(mensaje);
        if (!mensaje)
          alert("Error al eliminar!");
        else {
          alert(mensaje);
          this.props.navigation.goBack();
        }
      })
      .catch((error) => {
        console.error(error);
        alert("Error de Internet!!");
      });
  }
  render() {
    const { navigation } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }}>
          <View
            style={{
              flex: 1, flexDirection: 'row', alignContent: 'center', alignItems: 'center'
              , height: 60
            }}>
            <TouchableOpacity
              style={{
                flex: 1, height:
                  40, backgroundColor: 'black', borderRadius: 5, justifyContent:
                  'center', marginLeft: 5
              }}
              onPress={() => { this.Actualizar() }}
            >
              <Text style={{
                color: 'white', fontSize: 22, textAlign: 'center',
                textAlignVertical: 'center', padding: 3
              }}>Actualizar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flex: 1, height:
                  40, backgroundColor: 'black', borderRadius: 5, justifyContent:
                  'center', marginLeft: 5, marginRight: 5
              }}
              onPress={() => { this.Eliminar() }}
            >
              <Text style={{
                color: 'white', fontSize: 22, textAlign: 'center',
                textAlignVertical: 'center', padding: 3
              }}>Eliminar</Text>
            </TouchableOpacity>
          </View>

          <View style={{ flex: 1, padding: 20 }}>

            <NavigationEvents
              onWillFocus={() => {
                // Do your things here
                console.log("Entro aqui" + navigation.getParam('nombre'));
                this.setState({
                  nombre: navigation.getParam('nombre'),

                  dirpostal: navigation.getParam('dirpostal'),
                  dirtrabajo: navigation.getParam('dirtrabajo'),
                  telefono: navigation.getParam('telefono'),

                  correo: navigation.getParam('correo'),

                  tipo: navigation.getParam('tipo'),
                  intereses:navigation.getParam('intereses'),
                  id: navigation.getParam('id')
                });
              }}
            />
            
 <Input
 value={this.state.nombre}
          placeholder='Nombre'
          onChangeText={(text) => this.setState({ nombre: text })}
        />
        <Input
        value={this.state.dirpostal}
          inputStyle={{ marginTop: 10 }}
          placeholder='Dirección postal'
          onChangeText={(text) => this.setState({ dirpostal: text })}
        />
        <Input
        value={this.state.dirtrabajo}
          inputStyle={{ marginTop: 10 }}
          placeholder='Dirección de trabajo'
          onChangeText={(text) => this.setState({ dirtrabajo: text })}
        />
       
        <Input
        value={this.state.telefono}
          inputStyle={{ marginTop: 10 }}
          placeholder='Teléfono'
          onChangeText={(text) => this.setState({ telefono: text })}
        />
        <Input
        value={this.state.correo}
          inputStyle={{ marginTop: 10 }}
          placeholder='Correo electrónico'
          onChangeText={(text) => this.setState({ correo: text })}
        />

        <View>

      <Picker
        selectedValue={this.state.tipo}
        style={{ height: 50, width: 150 }}
        onValueChange={(itemValue, itemIndex) => this.setState({tipo:itemValue})}
      >
        <Picker.Item label="Real" value="real" />
        <Picker.Item label="Potencial" value="potencial" />
      </Picker>
    </View>

        <Input
        value={this.state.intereses}
          inputStyle={{ marginTop: 10 }}
          placeholder='Intereses'
          onChangeText={(text) => this.setState({ intereses: text })}
        />


          </View>
        </ScrollView>
      </View>

    );
  }
}


class PaginaAgregar extends React.Component {
  state = {
    nombre: '',
    dirpostal: '',
    dirtrabajo: '',
    telefono: '',
    correo: '',
    tipo: 'real',
    intereses:'',
  }
  static navigationOptions = {
    title: 'Agregar producto',
    headerStyle: {
      backgroundColor: '#f4511e',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  };

 
  Guardar() {

alert("Error al agregar!");
    fetch('https://apireactnativedps.000webhostapp.com/apicartera.php?comando=agregar&nombre=' +
      this.state.nombre
      + '&dirpostal=' + this.state.dirpostal
      + '&dirtrabajo=' + this.state.dirtrabajo
      + '&telefono=' + this.state.telefono
      + '&correo=' + this.state.correo
      + '&tipo=' + this.state.tipo 
      + '&intereses=' + this.state.intereses, {
      method: 'GET'
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        const mensaje = responseJson.mensaje;
        console.log(mensaje);
        if (!mensaje)
          alert("Error al agregar!");
        else {
          alert(mensaje);
          this.props.navigation.goBack(); 
        }
      })
      .catch((error) => {
        console.error(error);
        alert("Error de Internet!!");
      });
  }

  render() {
    return (
      <ScrollView>
      <View style={{ flex: 1, padding: 20 }}>
        <Input
          placeholder='Nombre'
          onChangeText={(text) => this.setState({ nombre: text })}
        />
        <Input
          inputStyle={{ marginTop: 10 }}
          placeholder='Dirección postal'
          onChangeText={(text) => this.setState({ dirpostal: text })}
        />
        <Input
          inputStyle={{ marginTop: 10 }}
          placeholder='Dirección de trabajo'
          onChangeText={(text) => this.setState({ dirtrabajo: text })}
        />
       
        <Input
          inputStyle={{ marginTop: 10 }}
          placeholder='Teléfono'
          onChangeText={(text) => this.setState({ telefono: text })}
        />
        <Input
          inputStyle={{ marginTop: 10 }}
          placeholder='Correo electrónico'
          onChangeText={(text) => this.setState({ correo: text })}
        />

        <View>

      <Picker
        selectedValue={this.state.tipo}
        style={{ height: 50, width: 150 }}
        onValueChange={(itemValue, itemIndex) => this.setState({tipo:itemValue})}
      >
        <Picker.Item label="Real" value="real" />
        <Picker.Item label="Potencial" value="potencial" />
      </Picker>
    </View>

        <Input
          inputStyle={{ marginTop: 10 }}
          placeholder='Intereses'
          onChangeText={(text) => this.setState({ intereses: text })}
        />

        <TouchableOpacity
          style={{
            height: 50, backgroundColor: 'red',
            marginTop: 15, borderRadius: 5, justifyContent:
              'center', marginLeft: 20, marginRight: 20
          }}
          onPress={() => { this.Guardar() }}
        >
          <Text style={{
            color: 'white', fontSize: 22, textAlign: 'center',
            textAlignVertical: 'center'
          }}>Guardar</Text>
        </TouchableOpacity>
      </View>
</ScrollView>
    );
  }
}

const RootStack = createStackNavigator(
  {
    Inicio: PantallaInicio,
    ListarProductos: listarProductos,
    Detalles: PaginaDetalle,
    Agregar: PaginaAgregar,
  },
  {
    initialRouteName: 'ListarProductos',
  }
);
const AppContainer = createAppContainer(RootStack);
export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}