// Importando os módulos necessários
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';

// Definindo a URL da API
const API_URL = 'http://192.168.179.32:3000/users';
const API_URL_PRODUCT = 'http://192.168.179.32:3000/product';

// Criando um componente para renderizar cada item da lista de usuários
const UserItem = ({ user, onDelete, onEdit }) => {
  return (
    <View style={styles.userItem}>
      <Text style={styles.userName}>{user.nome}</Text>
      <Text style={styles.userAge}>{user.idade}</Text>
      <View style={styles.userActions}>
        <Button title="Editar" onPress={() => onEdit(user)} />
        <Button title="Excluir" onPress={() => onDelete(user.id)} />
      </View>
    </View>
  );
};

// Criando um componente para o formulário de cadastro e edição de usuários
const UserForm = ({ user, onSave, onCancel }) => {
  const [name, setName] = useState(user ? user.nome : '');
  const [age, setAge] = useState(user ? user.idade : '');

  const handleSubmit = () => {
    if (user) {
      // Atualizando um usuário existente
      axios.put(`${API_URL}/${user.id}`, { nome: name, idade: age })
        .then(() => onSave())
        .catch((error) => alert(error.message));
    } else {
      // Criando um novo usuário
      axios.post(API_URL, { nome: name, idade: age })
        .then(() => onSave())
        .catch((error) => alert(error.message));
    }
  };

  return (
    <View style={styles.userForm}>
      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Idade"
        value={age.toString()}
        onChangeText={setAge}
        keyboardType="numeric"
      />
      <View style={styles.formActions}>
        <Button title="Salvar" onPress={handleSubmit} />
        <Button title="Cancelar" onPress={onCancel} />
      </View>
    </View>
  );
};

// Criando um componente para renderizar cada item da lista de produtos
const ProductItem = ({ product, onDelete, onEdit }) => {
  return (
    <View style={styles.productItem}>
      <Text style={styles.productName}>{product.nome}</Text>
      <Text style={styles.productPrice}>{product.preco}</Text>
      <Text style={styles.productDescription}>{product.descricao}</Text>
      <View style={styles.userActions}>
        <Button title="Editar" onPress={() => onEdit(product)} />
        <Button title="Excluir" onPress={() => onDelete(product.id)} />
      </View>
    </View>
  );
};

// Criando um componente para o formulário de cadastro e edição de um produto
const ProductForm = ({ product, onSave, onCancel }) => {
  const [name, setName] = useState(product ? product.nome : '');
  const [price, setPrice] = useState(product ? product.preco : '');
  const [description, setDescription] = useState(product ? product.descricao : '');

  const handleSubmitp = () => {
    if (product) {
      // Atualizando um produto existente
      axios.put(`${API_URL_PRODUCT}/${product.id}`, { nome: name, preco: price, descricao: description })
        .then(() => onSave())
        .catch((error) => alert(error.message));
    } else {
      // Criando um novo produto
      axios.post(API_URL_PRODUCT, { nome: name, preco: price, descricao: description })
        .then(() => onSave())
        .catch((error) => alert(error.message));
    }
  };

  return (
    <View style={styles.prodForm}>
      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Preço"
        value={price.toString()}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Descrição"
        value={description}
        onChangeText={setDescription}
      />
      <View style={styles.formActions}>
        <Button title="Salvar" onPress={handleSubmitp} />
        <Button title="Cancelar" onPress={onCancel} />
      </View>
    </View>
  );
};

// Criando um componente para a tela principal da aplicação
const App = () => {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showFormP, setShowFormP] = useState(false);
 
  useEffect(() => {
    // Buscando os usuários e produtos da API quando o componente é montado
    fetchUsers();
    fetchProducts();
  }, []);

  const fetchUsers = () => {
    // Buscando os usuários da API e atualizando o estado
    axios.get(API_URL)
      .then((response) => setUsers(response.data))
      .catch((error) => alert(error.message));
  };

  const handleDeleteUser = (id) => {
    Alert.alert(
      "Alerta de exclusão",
      "Deseja realmente excluir este usuário?",
      [
        {
          text: "Cancelar",
          onPress: () => console.log("Exclusão cancelada"),
          style: "cancel"
        },
        {
          text: "Excluir",
          onPress: () => {
            axios.delete(`${API_URL}/${id}`)
              .then(() => { fetchUsers(); })
              .catch((error) => {
                Alert.alert("Erro", error.message);
              });
          }
        }
      ],
      { cancelable: false }
    );
  };

  const handleEditUser = (user) => {
    // Selecionando um usuário para editar e mostrando o formulário
    setSelectedUser(user);
    setShowForm(true);
  };

  const handleSaveUser = () => {
    // Escondendo o formulário e atualizando os usuários
    setShowForm(false);
    fetchUsers();
    setSelectedUser(null);
  };

  const handleCancelUser = () => {
    // Escondendo o formulário e limpando o usuário selecionado
    setShowForm(false);
    setSelectedUser(null);
  };

  const fetchProducts = () => {
    // Buscando os produtos da API e atualizando o estado
    axios.get(API_URL_PRODUCT)
      .then((response) => setProducts(response.data))
      .catch((error) => alert(error.message));
  };

  const handleDeleteProduct = (id) => {
    Alert.alert(
      "Alerta de exclusão",
      "Deseja realmente excluir este produto?",
      [
        {
          text: "Cancelar",
          onPress: () => console.log("Exclusão cancelada"),
          style: "cancel"
        },
        {
          text: "Excluir",
          onPress: () => {
            axios.delete(`${API_URL_PRODUCT}/${id}`)
              .then(() => { fetchProducts(); })
              .catch((error) => {
                Alert.alert("Erro", error.message);
              });
          }
        }
      ],
      { cancelable: false }
    );
  };

  const handleEditProduct = (product) => {
    // Selecionando um produto para editar e mostrando o formulário
    setSelectedProduct(product);
    setShowFormP(true);
  };

  const handleSaveProduct = () => {
    // Escondendo o formulário e atualizando os produtos
    setShowFormP(false);
    fetchProducts();
    setSelectedProduct(null);
  };

  const handleCancelProduct = () => {
    // Escondendo o formulário e limpando o produto selecionado
    setShowFormP(false);
    setSelectedProduct(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CRUD API com React Native</Text>
      {showForm ? (
        // Mostrando o formulário se o estado showForm for verdadeiro
        <UserForm
          user={selectedUser}
          onSave={handleSaveUser}
          onCancel={handleCancelUser}
        />
      ) : showFormP ? (
        // Mostrando o formulário de produtos se o estado showFormP for verdadeiro
        <ProductForm
          product={selectedProduct}
          onSave={handleSaveProduct}
          onCancel={handleCancelProduct}
        />
      ) : (
        // Mostrando a lista de usuários se o estado showForm for falso
        <>
          <FlatList
            data={users}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <UserItem
                user={item}
                onDelete={handleDeleteUser}
                onEdit={handleEditUser}
              />
            )}
          />
          <Button title="Adicionar usuário" onPress={() => setShowForm(true)} />
          <FlatList
            data={products}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <ProductItem
                product={item}
                onDelete={handleDeleteProduct}
                onEdit={handleEditProduct}
              />
            )}
          />
          <Button title="Adicionar produto" onPress={() => setShowFormP(true)} />
        </>
      )}
    </View>
  );
};

export default App;

// Definindo os estilos dos componentes
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#eee',
    borderRadius: 10,
  },
  userName: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
  },
  userAge: {
    flex: 1,
    fontSize: 18,
    textAlign: 'right',
  },
  userActions: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  userForm: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#AA5AEB',
    borderRadius: 10,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#eee',
    borderRadius: 10,
  },
  productName: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
  },
  productPrice: {
    flex: 1,
    fontSize: 18,
    textAlign: 'center',
  },
  productDescription: {
    flex: 1,
    fontSize: 18,
    textAlign: 'justify',
  },
  prodForm: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#8100EB',
    borderRadius: 10,
  },
  input: {
    height: 40,
    borderColor: '#000',
    borderWidth: 1,
    marginVertical: 5,
    paddingHorizontal: 10,
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
});