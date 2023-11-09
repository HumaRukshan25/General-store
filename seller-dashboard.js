document.addEventListener("DOMContentLoaded", function () {
    const itemsList = document.getElementById("items-list");
    const itemForm = document.getElementById("item-form");
    const itemInput = document.getElementById("item-name");
    const priceInput = document.getElementById("item-price");
    const descriptionInput = document.getElementById("item-description");
    const quantityInput = document.getElementById("item-quantity");
    const addItemBtn = document.getElementById("add-item");
    const updateQuantityInput = document.getElementById("update-quantity");
    const updateSoldInput = document.getElementById("update-sold");
    const updateItemBtn = document.getElementById("update-item");

    const crudCrudApiUrl = 'https://crudcrud.com/api/b29498f7084845a4b58fb23351766d8a/items';

    const sellerData = {
        items: [],
        selectedIdx: -1, // Keep track of the selected item index
        buy1Price: 0,
        buy2Price: 0,
    };

    // Add item to the list and to CrudCrud
    addItemBtn.addEventListener("click", function () {
        const itemName = itemInput.value;
        const itemPrice = parseFloat(priceInput.value);
        const itemDescription = descriptionInput.value;
        const itemQuantity = parseInt(quantityInput.value);

        if (itemName && !isNaN(itemPrice) && itemDescription && !isNaN(itemQuantity)) {
            const newItem = {
                name: itemName,
                price: itemPrice,
                description: itemDescription,
                quantity: itemQuantity,
                sold: 0,
            };

            // Add item to CrudCrud
            axios.post(crudCrudApiUrl, newItem)
                .then((response) => {
                    newItem._id = response.data._id; // Save _id from response
                    sellerData.items.push(newItem);
                    updateItemList();
                })
                .catch((error) => {
                    console.error('Error adding item to CrudCrud:', error);
                });
        }
    });

    // Update item quantity in the dashboard
    updateItemBtn.addEventListener("click", function () {
        const selectedIndex = sellerData.selectedIdx;
        const selected = sellerData.items[selectedIndex];
        const updateQuantity = parseInt(updateQuantityInput.value);
        const updateSold = parseInt(updateSoldInput.value);

        if (!isNaN(updateQuantity) && !isNaN(updateSold) &&
            updateQuantity <= selected.quantity && updateSold <= updateQuantity) {
            selected.sold = updateSold;
            selected.quantity = updateQuantity;
            updateItemInCrudCrud(selected);
            updateItemList();
        }
    });

    // Update the item list and prices
    function updateItemList() {
        itemsList.innerHTML = "";
        for (let i = 0; i < sellerData.items.length; i++) {
            const item = sellerData.items[i];
            const itemPrice = calculateItemPrice(item.price);
            const remainingQuantity = item.quantity - item.sold; // Calculate remaining quantity
            itemsList.innerHTML += `<li>${item.name}: $${itemPrice.toFixed(2)}, Quantity: ${remainingQuantity} (Sold: ${item.sold}), Remaining: ${remainingQuantity}</li>`;
        }
    }

    // Calculate item price based on quantity
    function calculateItemPrice(price) {
        if (price && sellerData.buy1Price && sellerData.buy2Price) {
            if (sellerData.buy1Price <= price) {
                if (sellerData.buy2Price <= price) {
                    return sellerData.buy2Price;
                } else {
                    return sellerData.buy1Price;
                }
            }
        }
        return price;
    }

    // Function to update an item in CrudCrud
    function updateItemInCrudCrud(item) {
        const updateUrl = `${crudCrudApiUrl}/${item._id}`;
        axios.put(updateUrl, { sold: item.sold, quantity: item.quantity })
            .then((response) => {
                console.log('Item updated in CrudCrud:', response.data);
            })
            .catch((error) => {
                console.error('Error updating item in CrudCrud:', error);
            });
    }
});
// Update item quantity in the dashboard
updateItemBtn.addEventListener("click", function () {
    const selectedIndex = sellerData.selectedIdx;
    if (selectedIndex !== -1) {
        const selected = sellerData.items[selectedIndex];
        const updateQuantity = parseInt(updateQuantityInput.value);
        const updateSold = parseInt(updateSoldInput.value);

        if (!isNaN(updateQuantity) && !isNaN(updateSold) &&
            updateQuantity <= selected.quantity && updateSold <= updateQuantity) {
            selected.sold = updateSold;
            selected.quantity = updateQuantity;
            updateItemInCrudCrud(selected);
            updateItemList();
        }
    }
});
