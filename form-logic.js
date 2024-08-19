const overlay = document.getElementById("overlay");
const confirmDialogue = document.getElementById("confirm-order");
const form = document.getElementById("order-form");
const orderResultDialogue = document.getElementById("order-result-dialogue");
const orderResultText = document.getElementById("order-result-text");
const orderResultLink = document.getElementById("order-result-link");

const sourdough = document.getElementById("sourdough_select");
const pretzels = document.getElementById("pretzels_select");
const hefezopf = document.getElementById("hefezopf_select");

const date = document.getElementById("pickup_date");
if (date != null) {
  const todaysDate = new Date(new Date().toISOString());
  console.log(`todaysDate: ${todaysDate}`);
  const twoDaysInTheFuture = new Date(todaysDate.setDate(todaysDate.getDate() + 2));

  const nextPossibleOrder = twoDaysInTheFuture.toISOString().split("T")[0];
  date.value = nextPossibleOrder;
  date.min = nextPossibleOrder;
}

const getDateString = date => date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
const getTimeString = date => date.getHours() + ":" + date.getMinutes();

const recordVisit = () =>
  fetch("https://backend-nameless-sun-9083.fly.dev/add-visit", {
  // fetch("http://localhost:5555/add-visit", {

    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      site: "bakery",
    }),
  }).then(response => console.log(response));

recordVisit();

const getTotalPrice = () => {
  const numSourdough = sourdough.value;
  const numPretzels = pretzels.value;
  const numHefezopf = hefezopf.value;

  const totalPrice = sourdoughPrice * numSourdough + pretzelsPrice * numPretzels + hefezopfPrice * numHefezopf;

  return totalPrice;
};

const asDollarString = num => {
  const formatter = new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
  });
  return formatter.format(num);
};

const addOptions = (select, min, max) => {
  for (var i = min; i <= max; i++) {
    var opt = document.createElement("option");
    opt.value = i;
    opt.innerHTML = i;
    select.appendChild(opt);
  }
};

const sourdoughPrice = 9;
const pretzelsPrice = 3.5;
const hefezopfPrice = 7;

const onSubmit = e => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const pickupDate = document.getElementById("pickup_date").value;
  const pickupTime = document.getElementById("pickup_time").value;
  const numSourdough = sourdough.value;
  const numPretzels = pretzels.value;
  const numHefezopf = hefezopf.value;
  console.log(`pickupDate ${pickupDate}`);
  console.log(`pickupTime ${pickupTime}`);
  const dateTime = new Date(pickupDate + "T" + pickupTime);
  console.log(`dateTime ${dateTime}`);
  console.log(`UTC: ${dateTime.toISOString()}`);

  let text = "";
  if (numSourdough > 0) {
    text += `${numSourdough} x sourdough loaf(s) = $${sourdoughPrice * numSourdough}\n`;
  }
  if (numPretzels > 0) {
    text += `${numPretzels} x pretzel(s) = $${pretzelsPrice * numPretzels}\n`;
  }
  if (numHefezopf > 0) {
    text += `${numHefezopf} x hefezopf loaf(s) = $${hefezopfPrice * numHefezopf}\n`;
  }
  text += `Total price is ${asDollarString(getTotalPrice())}.\nDo you want to proceed?`;
  confirmDialogue.classList.remove("hidden");
  const orderText = document.getElementById("order-text");
  orderText.textContent = text;
  const okButton = document.getElementById("ok-button");
  const cancelButton = document.getElementById("cancel-button");
  okButton.addEventListener("click", () => {
    const items = [];
    if (numSourdough > 0) {
      items.push({ name: "sourdough", quantity: numSourdough, price: sourdoughPrice });
    }
    if (numPretzels > 0) {
      items.push({ name: "pretzels", quantity: numPretzels, price: pretzelsPrice });
    }
    if (numHefezopf > 0) {
      items.push({ name: "hefezopf", quantity: numHefezopf, price: hefezopfPrice });
    }

    console.log(pickupDate);
    const pickupDateTime = new Date(pickupDate + "T" + pickupTime).toISOString();

    placeOrder({
      name,
      phone,
      items,
      pickupDateTime,
      // pickupTime,
      totalPrice: getTotalPrice(),
    });
  });
  cancelButton.addEventListener("click", () => {
    confirmDialogue.classList.add("hidden");
    // overlay.classList.add("hidden");
  });
};

form.addEventListener("submit", onSubmit);

const placeOrder = async ({ name, phone, items, pickupDateTime, totalPrice }) => {
  const response = await fetch("https://backend-nameless-sun-9083.fly.dev/place-bakery-order", {
    // const response = await fetch("https://resume-backend.fly.dev/place-bakery-order", {
    // const response = await fetch("http://localhost:5555/place-bakery-order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      phone,
      order: { items, totalPrice },
      pickupDateTime,
      totalPrice,
    }),
  });
  console.log({
    name,
    phone,
    order: { items, totalPrice },
    pickupDateTime,
    totalPrice,
  });

  if (response.ok) {
    confirmDialogue.classList.add("hidden");
    // overlay.classList.add("hidden");
    orderResultDialogue.classList.remove("hidden");
    const date = new Date(pickupDateTime);
    console.log(date);
    const dateString = getDateString(date);
    const timeString = getTimeString(date);
    orderResultText.textContent = `Your order has been placed successfully!\n Pickup on ${dateString} from ${timeString}\n  at 56 Valley Drive, Caboolture`;
  } else {
    confirmDialogue.classList.add("hidden");
    orderResultDialogue.classList.remove("hidden");
    orderResultText.textContent =
      "There was a problem placing your order!\nPlease try again or send your order via email to thisisjustafowardingaddress[at]gmail.com";
    orderResultLink.href = "./form.html";
  }
};

addOptions(sourdough, 0, 3);
addOptions(pretzels, 0, 10);
addOptions(hefezopf, 0, 3);

const onSelect = () => {
  document.getElementById("total-price").textContent = asDollarString(getTotalPrice());
};

sourdough.addEventListener("change", onSelect);
pretzels.addEventListener("change", onSelect);
hefezopf.addEventListener("change", onSelect);
const totalPriceEl = document.getElementById("total-price");

// const preOrderButton = document.getElementById("pre-order-button");
// preOrderButton.addEventListener("click", () => {
//   overlay.classList.remove("hidden");
// });

// const closeButton = document.getElementById("close-button");
// closeButton.addEventListener("click", () => {
//   overlay.classList.add("hidden");
// });
getTotalPrice();
