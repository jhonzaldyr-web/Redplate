// ================= MENU =================

const menuData = [
  {
    name: "Pork Jowls",
    price: 199,
    sides: ["Kimchi","Lettuce Pajeori","Potato Marbles","Cucumber"]
  },
  {
    name: "Pork Belly",
    price: 249,
    sides: ["Kimchi","Lettuce","Potato Marbles","FishCake","Corn"]
  },
  {
    name: "Pork Jowls & Beef",
    price: 299,
    sides: ["Kimchi","Lettuce Pajeori","Potato Marbles","FishCake","Corn"]
  },
  {
    name: "Pork Belly & Beef",
    price: 349,
    sides: ["Kimchi","Lettuce Pajeori","Potato Marbles","FishCake","Corn"]
  },
  {
    name: "All Beef",
    price: 499,
    sides: ["Kimchi","Lettuce Pajeori","Potato Marbles","FishCake","Corn","1 Ramen + kimbap"]
  }
];

// ================= GLOBAL =================

let cart = [];
let discount = 0;
let discountUsed = false;

// ================= LOAD MENU =================

window.onload = () => {
  const menu = document.getElementById("menu-list");

  menuData.forEach((item,i)=>{
    let sides = "<ul class='sides-list'>";
    item.sides.forEach(s=> sides += `<li>${s}</li>`);
    sides += "</ul>";

    menu.innerHTML += `
      <div class="menu-item">
        <h3>${item.name}</h3>
        <p class="price">₱${item.price}</p>
        ${sides}
        <input type="number" id="qty-${i}" value="1" min="1">
        <button onclick="addToCart(${i})">Add</button>
      </div>
    `;
  });
};

// ================= ADD =================

function addToCart(i){
  const qty = Number(document.getElementById(`qty-${i}`).value);
  if(qty <= 0) return;

  const item = menuData[i];
  const found = cart.find(c => c.name === item.name);

  if(found){
    found.qty += qty;
  } else {
    cart.push({ name:item.name, price:item.price, qty });
  }

  document.getElementById(`qty-${i}`).value = 1;
  updateCart();
}

// ================= CART =================

function updateCart(){
  const box = document.getElementById("cart-items");
  box.innerHTML = "";
  let subtotal = 0;

  cart.forEach((item,i)=>{
    const total = item.price * item.qty;
    subtotal += total;

    box.innerHTML += `
      <div class="cart-item">
        <b>${item.name}</b><br>
        <button onclick="changeQty(${i},-1)">-</button>
        ${item.qty}
        <button onclick="changeQty(${i},1)">+</button>
        <button onclick="removeItem(${i})">🗑</button>
        <div>₱${total.toFixed(2)}</div>
      </div>
    `;
  });

  let final = subtotal - (subtotal * discount);
  if(final < 0) final = 0;
  document.getElementById("total").innerText = final.toFixed(2);
}

// ================= QTY =================

function changeQty(i,c){
  cart[i].qty += c;
  if(cart[i].qty <= 0) cart.splice(i,1);
  updateCart();
}

// ================= REMOVE =================

function removeItem(i){
  cart.splice(i,1);
  updateCart();
}

// ================= DISCOUNT =================

function applyDiscount(){
  if(discountUsed) return;
  const v = Number(document.getElementById("discountInput").value);
  if(v <= 0 || v > 100) return;
  discount = v / 100;
  discountUsed = true;
  updateCart();
}

// ================= CLEAR =================

function clearCart(){
  cart = [];
  updateCart();
}

// ================= CHECKOUT & PRINT =================
function checkoutAndPrint(){

  if(cart.length === 0) return;

  let subtotal = 0;

  let receipt = `
    <div id="print-area">
      <h3>Red Plate Grill</h3>
      <p style="text-align:center;font-size:12px;">
        Batangas City Branch<br>
        0917 689 1001
      </p>
      <hr>
  `;

  cart.forEach(item=>{
    const lineTotal = item.qty * item.price;
    subtotal += lineTotal;

    receipt += `
      <p>
        ${item.qty} x ${item.name}<br>
        ₱${lineTotal.toFixed(2)}
      </p>
    `;
  });

  const discountAmount = subtotal * discount;
  const finalTotal = subtotal - discountAmount;

  receipt += `
      <hr>
      <p>Subtotal: ₱${subtotal.toFixed(2)}</p>
      <p>Discount: ₱${discountAmount.toFixed(2)}</p>
      <hr>
      <b>Total: ₱${finalTotal.toFixed(2)}</b>
      <p style="text-align:center;font-size:12px;margin-top:10px;">
        Thank you!<br>Please come again ❤️
      </p>
    </div>
  `;

  saveToHistory(receipt, finalTotal.toFixed(2));

  const win = window.open("", "_blank", "width=300,height=600");

  win.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Receipt</title>
      <link rel="stylesheet" href="style.css">
      <style>
        body { margin: 0; }
      </style>
    </head>
    <body>
      ${receipt}
      <script>
        window.onload = function () {
          setTimeout(function () {
            window.print();
          }, 500);
        };
      </script>
    </body>
    </html>
  `);

  win.document.close();

  cart = [];
  discount = 0;
  discountUsed = false;
  document.getElementById("discountInput").value = "";
  updateCart();
  }

  const discountAmount = subtotal * discount;
  const finalTotal = subtotal - discountAmount;

  receipt += `
    <hr>
    <p>Subtotal: ₱${subtotal.toFixed(2)}</p>
    <p>Discount: ₱${discountAmount.toFixed(2)}</p>
    <hr>
    <b>Total: ₱${finalTotal.toFixed(2)}</b>
    <p style="text-align:center;font-size:12px;margin-top:10px;">
      Thank you!<br>Please come again ❤️
    </p>
  `;

  saveToHistory(receipt, finalTotal.toFixed(2));

  const win = window.open("", "", "width=300,height=500");
  win.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Receipt</title>
      <link rel="stylesheet" href="style.css">
    </head>
    <body onload="window.print(); window.close();">
      ${receipt}
    </body>
    </html>
  `);
  win.document.close();

  cart = [];
  discount = 0;
  discountUsed = false;
  document.getElementById("discountInput").value = "";
  updateCart();


// ================= SEARCH =================

function searchMenu(){
  const v = document.getElementById("searchBar").value.toLowerCase();
  document.querySelectorAll(".menu-item").forEach(m=>{
    m.style.display = m.innerText.toLowerCase().includes(v) ? "block" : "none";
  });
}

// ================= HISTORY =================

function saveToHistory(html,total){
  let history = JSON.parse(localStorage.getItem("orderHistory")) || [];
  history.push({ date:new Date().toLocaleString(), receipt:html, total });
  localStorage.setItem("orderHistory", JSON.stringify(history));
}

function viewHistory(){
  let history = JSON.parse(localStorage.getItem("orderHistory")) || [];
  if(history.length === 0) return alert("No history yet");

  const modal = document.getElementById("historyModal");
  const content = document.getElementById("historyContent");
  content.innerHTML = "";

  history.reverse().forEach(h=>{
    content.innerHTML += `
      <div class="history-receipt">
        <div class="history-date">${h.date}</div>
        ${h.receipt}
        <b>Total: ₱${h.total}</b>
      </div>
    `;
  });

  modal.style.display = "block";
}

// ================= CLOSE =================

function closeHistory(){
  document.getElementById("historyModal").style.display = "none";
}
