// store.js

// CRUD CRUD API base URL
const apiUrl = 'https://crudcrud.com/api/d1e58999612a4b9a839f16e4dc0b3a24';


//this is Function to fetch inventory from the API and render it
async function fetchInventory() {
  try {
    const response = await axios.get(`${apiUrl}/inventory`);
    const inventoryBody = document.getElementById('inventoryBody');

    // Clear existing items
    inventoryBody.innerHTML = '';

    // Render items
    response.data.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${item.name}</td>
        <td>${item.price || 'itemPrice'}</td>
        <td>${item.description || 'itemDescription'}</td>
        <td>${item.quantity}</td>
        <td>
          <button onclick="sellItem('${item._id}', '${item.name}', ${item.quantity}, ${item.price || 0}, '${item.description || ''}')">Sell</button>
          <button onclick="buyItem('${item._id}', '${item.name}', ${item.quantity}, ${item.price || 0}, '${item.description || ''}', 1)">Buy 1</button>
          <button onclick="buyItem('${item._id}', '${item.name}', ${item.quantity}, ${item.price || 0}, '${item.description || ''}', 2)">Buy 2</button>
          <button onclick="buyItem('${item._id}', '${item.name}', ${item.quantity}, ${item.price || 0}, '${item.description || ''}', 3)">Buy 3</button>
          <button onclick="deleteItem('${item._id}')">Delete</button>
        </td>
      `;
      inventoryBody.appendChild(row);
    });
  } catch (error) {
    console.error('Error fetching inventory:', error);
  }
}

async function addItem() {
  const itemName = document.getElementById('itemName').value;
  const itemPrice = document.getElementById('itemPrice').value;
  const itemDescription = document.getElementById('itemDescription').value;
  const itemQuantity = document.getElementById('itemQuantity').value;

  try {
    await axios.post(`${apiUrl}/inventory`, {
      name: itemName,
      price: itemPrice,
      description: itemDescription,
      quantity: itemQuantity,
    });

    // Refresh inventory after adding a new item
    fetchInventory();
  } catch (error) {
    console.error('Error adding item:', error);
  }
}

// Function to sell an item using the input field for quantity
async function sellItem(itemId, itemName, currentQuantity, itemPrice, itemDescription) {
  try {
    // Get the quantity to sell from the user
    const quantityToSell = prompt(`Enter quantity to sell for ${itemName}:`, '1');

    // Check if the user entered a valid quantity
    if (quantityToSell !== null && !isNaN(quantityToSell) && quantityToSell > 0 && quantityToSell <= currentQuantity) {
      // Calculate the new quantity after selling
      const newQuantity = currentQuantity - parseInt(quantityToSell);

      // Update the item with the new quantity, keeping the same name, price, and description
      await axios.put(`${apiUrl}/inventory/${itemId}`, {
        name: itemName,
        price: itemPrice,
        description: itemDescription,
        quantity: newQuantity,
      });

      // Refresh inventory after selling an item
      fetchInventory();
    } else {
      alert(`Invalid quantity. Please enter a valid number between 1 and ${currentQuantity}.`);
    }
  } catch (error) {
    console.error('Error selling item:', error);
  }
}
async function buyItem(itemId, itemName, currentQuantity, itemPrice, itemDescription, quantityToBuy) {
  try {
    // Calculate the new quantity after buying
    const newQuantity = currentQuantity - quantityToBuy;

    // Update the item with the new quantity, keeping the same name, price, and description
    await axios.put(`${apiUrl}/inventory/${itemId}`, {
      name: itemName,
      price: itemPrice,
      description: itemDescription,
      quantity: newQuantity,
    });

    // Refresh inventory after buying items
    fetchInventory();
  } catch (error) {
    console.error('Error buying item:', error);
  }
}


// Function to delete an item
async function deleteItem(itemId) {
  try {
    await axios.delete(`${apiUrl}/inventory/${itemId}`);

    // Refresh inventory after deleting an item
    fetchInventory();
  } catch (error) {
    console.error('Error deleting item:', error);
  }
}

// Initial fetch of inventory when the page loads
fetchInventory();
