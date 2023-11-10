const inventory = [];
const apiUrl = 'https://crudcrud.com/api/941aaf8e2bef46a78d8322929c4348f0/inventory';

function addItem() {
  const itemName = document.getElementById('itemName').value;
  const itemPrice = parseFloat(document.getElementById('itemPrice').value);
  const itemDescription = document.getElementById('itemDescription').value;
  const itemQuantity = parseInt(document.getElementById('itemQuantity').value);

  if (itemName && itemPrice && itemDescription && itemQuantity) {
    const existingItemIndex = inventory.findIndex(item => item.name === itemName);

    if (existingItemIndex !== -1) {
      // If the item already exists, update the quantity and price
      inventory[existingItemIndex].quantity += itemQuantity;
    } else {
      // If the item doesn't exist, add it to the inventory
      inventory.push({ name: itemName, price: itemPrice, description: itemDescription, quantity: itemQuantity });
    }

    // Save the updated inventory to the API
    saveInventoryToApi();

    updateInventory();
    clearForm();
  }
}

function updateInventory() {
  const inventoryBody = document.getElementById('inventoryBody');
  inventoryBody.innerHTML = '';

  inventory.forEach((item, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.price}</td>
      <td>${item.description}</td>
      <td>${item.quantity}</td>
      <td><button onclick="sellItem(${index})">Sell</button> <button onclick="deleteItem(${index})">Delete</button></td>
    `;
    inventoryBody.appendChild(row);
  });
}

function sellItem(index) {
  const soldQuantity = parseInt(prompt(`Enter quantity sold for ${inventory[index].name}:`));
  if (soldQuantity && soldQuantity <= inventory[index].quantity) {
    inventory[index].quantity -= soldQuantity;

    // Save the updated inventory to the API
    saveInventoryToApi();

    updateInventory();
  } else {
    alert('Invalid quantity or not enough quantity available.');
  }
}

function deleteItem(index) {
  inventory.splice(index, 1);

  // Save the updated inventory to the API
  saveInventoryToApi();

  updateInventory();
}

function clearForm() {
  document.getElementById('itemName').value = '';
  document.getElementById('itemPrice').value = '';
  document.getElementById('itemDescription').value = '';
  document.getElementById('itemQuantity').value = '';
}

// Function to save the inventory to the API
function saveInventoryToApi() {
  axios.post(apiUrl, inventory)
    .then(response => {
      console.log('Inventory saved to API:', response.data);
    })
    .catch(error => {
      console.error('Error saving inventory to API:', error);
    });
}

// Function to load the inventory from the API
function loadInventoryFromApi() {
  axios.get(apiUrl)
    .then(response => {
      if (response.data && Array.isArray(response.data)) {
        inventory.length = 0; // Clear the current inventory
        inventory.push(...response.data); // Update with the data from the API
        updateInventory(); // Update the HTML display
      }
    })
    .catch(error => {
      console.error('Error loading inventory from API:', error);
    });
}

// Load the inventory from the API when the page loads
loadInventoryFromApi();
//comment